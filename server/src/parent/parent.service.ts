import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ParentService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async setPassword(userId: string, password: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        parentPasswordHash: hash,
        parentPasswordSalt: salt,
      },
    });

    return { message: '家长密码设置成功' };
  }

  async verifyPassword(userId: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        parentPasswordHash: true,
        parentFailedCount: true,
        parentLockedUntil: true,
      },
    });

    if (!user?.parentPasswordHash) {
      throw new BadRequestException('尚未设置家长密码');
    }

    // 检查锁定状态
    if (user.parentLockedUntil && new Date(user.parentLockedUntil) > new Date()) {
      const remainMinutes = Math.ceil(
        (new Date(user.parentLockedUntil).getTime() - Date.now()) / 60000,
      );
      throw new ForbiddenException(
        `密码错误次数过多，请${remainMinutes}分钟后再试`,
      );
    }

    const isValid = await bcrypt.compare(password, user.parentPasswordHash);

    if (!isValid) {
      const failedCount = user.parentFailedCount + 1;
      const updateData: any = { parentFailedCount: failedCount };

      // 连续失败5次，锁定15分钟
      if (failedCount >= 5) {
        updateData.parentLockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        updateData.parentFailedCount = 0;
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      throw new BadRequestException(
        failedCount >= 5
          ? '错误次数过多，已锁定15分钟'
          : `密码错误，还剩${5 - failedCount}次机会`,
      );
    }

    // 验证成功，重置计数
    await this.prisma.user.update({
      where: { id: userId },
      data: { parentFailedCount: 0, parentLockedUntil: null },
    });

    // 生成家长临时JWT
    const secret = this.configService.getOrThrow<string>('PARENT_JWT_SECRET');
    const expiresIn =
      this.configService.get<string>('PARENT_JWT_EXPIRES_IN') || '5m';
    const token = jwt.sign({ sub: userId, role: 'parent' }, secret, {
      expiresIn: expiresIn as unknown as jwt.SignOptions['expiresIn'],
    } as jwt.SignOptions);

    return { token, message: '验证成功' };
  }

  async hasPassword(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { parentPasswordHash: true },
    });
    return !!user?.parentPasswordHash;
  }
}
