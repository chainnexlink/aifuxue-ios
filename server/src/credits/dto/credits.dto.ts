import { IsInt, IsEnum, IsOptional, IsString, Min } from 'class-validator';

export class UseCreditsForMembershipDto {
  @IsInt()
  @Min(1)
  creditsToUse: number;

  @IsString()
  planId: string; // monthly, yearly, per-use
}

export class UseCreditsForQuotaDto {
  @IsInt()
  @Min(1)
  creditsToUse: number;
}

export class CreditHistoryQueryDto {
  @IsOptional()
  @IsString()
  type?: string; // REFERRAL, MEMBERSHIP_DEDUCTION, QUOTA_DEDUCTION

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number;
}
