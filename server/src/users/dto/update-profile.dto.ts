import { IsString, IsOptional, IsEnum } from 'class-validator';
import { GradeLevel } from '@prisma/client';

export class UpdateProfileDto {
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

  @IsOptional()
  @IsString()
  avatar?: string;
}
