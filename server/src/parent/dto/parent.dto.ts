import { IsString, Length, Matches } from 'class-validator';

export class SetParentPasswordDto {
  @IsString()
  @Length(4, 6)
  @Matches(/^\d{4,6}$/, { message: '密码必须为4-6位数字' })
  password: string;
}

export class VerifyParentPasswordDto {
  @IsString()
  @Length(4, 6)
  password: string;
}
