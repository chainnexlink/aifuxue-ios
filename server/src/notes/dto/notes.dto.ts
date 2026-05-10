import { IsOptional, IsString, IsArray, ArrayMaxSize } from 'class-validator';

export class CreateNoteDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subject?: string;
}

export class UnlockNoteDto {
  @IsString()
  adType: string; // 广告类型标识
}
