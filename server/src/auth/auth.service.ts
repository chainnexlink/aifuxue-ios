import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import Dysmsapi20170525, * as $Dysmsapi from '@alicloud/dysmsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';
import * as $Util from '@alicloud/tea-util';
import { PrismaService } from '../prisma/prisma.service';
import { CreditsService } from '../credits/credits.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  // 内存存储验证码（生产环境应使用Redis）
  private verificationCodes = new Map<string, { code: string; expiresAt: number }>();
  private smsClient: Dysmsapi20170525 | null = null;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private creditsService: CreditsService,
  ) {
    this.initSmsClient();
  }

  private initSmsClient() {
    const accessKeyId = this.configService.get<string>('ALIBABA_ACCESS_KEY_ID');
    const accessKeySecret = this.configService.get<string>('ALIBABA_ACCESS_KEY_SECRET');
    if (!accessKeyId || !accessKeySecret) {
      console.warn('[SMS] 阿里云 AccessKey 未配置，短信服务不可用');
      return;
    }
    const config = new $OpenApi.Config({
      accessKeyId,
      accessKeySecret,
    });
    config.endpoint = 'dysmsapi.aliyuncs.com';
    this.smsClient = new Dysmsapi20170525(config);
  }

  async sendVerificationCode(phone: string): Promise<{ message: string }> {
    // 生成6位验证码
    const code = Math.random().toString().slice(2, 8);
    this.verificationCodes.set(phone, {
      code,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5分钟有效
    });

    // 调用阿里云短信API发送验证码
    if (this.smsClient) {
      const signName = this.configService.get<string>('SMS_SIGN_NAME') || '';
      const templateCode = this.configService.get<string>('SMS_TEMPLATE_CODE') || '';
      const sendSmsRequest = new $Dysmsapi.SendSmsRequest({
        phoneNumbers: phone,
        signName,
        templateCode,
        templateParam: JSON.stringify({ code }),
      });
      const runtime = new $Util.RuntimeOptions({});
      try {
        const resp = await this.smsClient.sendSmsWithOptions(sendSmsRequest, runtime);
        if (resp.body?.code !== 'OK') {
          console.error('[SMS] 发送失败:', resp.body?.code, resp.body?.message);
          throw new BadRequestException(`短信发送失败: ${resp.body?.message || '未知错误'}`);
        }
      } catch (err: any) {
        if (err instanceof BadRequestException) throw err;
        console.error('[SMS] 调用异常:', err.message);
        throw new BadRequestException('短信服务暂时不可用，请稍后重试');
      }
    } else {
      // 未配置短信服务，开发模式打印验证码
      console.log(`[DEV] 手机号 ${phone} 的验证码: ${code}`);
    }

    return { message: '验证码已发送' };
  }

  private verifyCode(phone: string, code: string): boolean {
    const stored = this.verificationCodes.get(phone);
    if (!stored) return false;
    if (Date.now() > stored.expiresAt) {
      this.verificationCodes.delete(phone);
      return false;
    }
    // 开发阶段: 验证码 "000000" 始终有效
    if (code === '000000') return true;
    return stored.code === code;
  }

  private generateToken(userId: string): string {
    const secret = this.configService.getOrThrow<string>('JWT_SECRET');
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '7d';
    return jwt.sign({ sub: userId }, secret, {
      expiresIn: expiresIn as unknown as jwt.SignOptions['expiresIn'],
    } as jwt.SignOptions);
  }

  async register(dto: RegisterDto) {
    // 验证码校验
    if (!this.verifyCode(dto.phone, dto.code)) {
      throw new BadRequestException('验证码错误或已过期');
    }

    // 检查手机号是否已注册
    const existing = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    if (existing) {
      throw new BadRequestException('该手机号已注册');
    }

    // 解析邀请码，查找推荐教师
    let referredByTeacherId: string | null = null;
    if (dto.inviteCode) {
      const teacherIdSuffix = this.parseTeacherInviteCode(dto.inviteCode);
      if (teacherIdSuffix) {
        const teacher = await this.prisma.user.findFirst({
          where: {
            role: 'teacher',
            id: { endsWith: teacherIdSuffix.toLowerCase() },
          },
        });
        if (teacher) {
          referredByTeacherId = teacher.id;
        }
      }
    }

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        phone: dto.phone,
        nickname: dto.nickname,
        gradeLevel: dto.gradeLevel,
        province: dto.province,
        city: dto.city,
        role: dto.role || 'student',
        referredByTeacherId,
      },
    });

    // 如果是通过教师邀请码注册的，给教师奖励积分
    if (referredByTeacherId) {
      try {
        await this.creditsService.awardReferralCredit(referredByTeacherId, user.id);
      } catch (err) {
        console.error('[Credits] 积分奖励失败:', err);
      }
    }

    this.verificationCodes.delete(dto.phone);

    return {
      token: this.generateToken(user.id),
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        gradeLevel: user.gradeLevel,
        province: user.province,
        city: user.city,
        membershipType: user.membershipType,
        role: user.role,
      },
    };
  }

  /** 解析教师邀请码，返回教师ID后缀 */
  private parseTeacherInviteCode(code: string): string | null {
    const match = code.match(/^TEACHER-([A-Za-z0-9]{6})$/i);
    return match ? match[1] : null;
  }

  async login(dto: LoginDto) {
    // 验证码校验
    if (!this.verifyCode(dto.phone, dto.code)) {
      throw new BadRequestException('验证码错误或已过期');
    }

    // 查找用户
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    if (!user) {
      throw new BadRequestException('该手机号未注册');
    }

    this.verificationCodes.delete(dto.phone);

    return {
      token: this.generateToken(user.id),
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        gradeLevel: user.gradeLevel,
        province: user.province,
        city: user.city,
        membershipType: user.membershipType,
        vipExpireAt: user.vipExpireAt,
        role: user.role,
        credits: user.role === 'teacher' ? user.credits : undefined,
      },
    };
  }

  // ==================== 管理后台登录 ====================

  async adminLogin(username: string, password: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { username },
    });

    if (!admin || !admin.isActive) {
      throw new BadRequestException('账号或密码错误');
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      throw new BadRequestException('账号或密码错误');
    }

    // 更新最后登录时间
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    const secret = this.configService.getOrThrow<string>('JWT_SECRET');
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '12h';
    const token = jwt.sign({ sub: admin.id, username: admin.username, role: admin.role }, secret, {
      expiresIn: expiresIn as unknown as jwt.SignOptions['expiresIn'],
    } as jwt.SignOptions);

    return {
      token,
      user: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
      },
    };
  }
}
