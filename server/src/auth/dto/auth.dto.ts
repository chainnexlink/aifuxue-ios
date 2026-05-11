import { IsString, IsOptional, IsEnum, Matches, Length, IsIn } from 'class-validator';
import { GradeLevel } from '@prisma/client';

export class RegisterDto {
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone: string;

  @IsString()
  @Length(4, 6, { message: '验证码为4-6位' })
  code: string;

  @IsString()
  @Length(1, 20, { message: '昵称长度为1-20个字符' })
  nickname: string;

  @IsEnum(GradeLevel, { message: '学段必须为 PRIMARY/JUNIOR/SENIOR/COLLEGE/ADULT' })
  gradeLevel: GradeLevel;

  @IsString()
  province: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsIn(['student', 'parent', 'teacher'], { message: '角色必须为 student/parent/teacher' })
  role?: string;

  @IsOptional()
  @IsString()
  inviteCode?: string;
}

export class LoginDto {
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone: string;

  @IsString()
  @Length(4, 6, { message: '验证码为4-6位' })
  code: string;
}

export class WxLoginDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsEnum(GradeLevel)
  gradeLevel?: GradeLevel;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  city?: string;
}
