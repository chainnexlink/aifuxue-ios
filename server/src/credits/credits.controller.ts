import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { UseCreditsForMembershipDto, UseCreditsForQuotaDto } from './dto/credits.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('credits')
@UseGuards(JwtAuthGuard)
export class CreditsController {
  constructor(private creditsService: CreditsService) {}

  /** 获取积分余额 */
  @Get('balance')
  async getBalance(@CurrentUser('sub') userId: string) {
    return this.creditsService.getBalance(userId);
  }

  /** 获取积分概览统计 */
  @Get('overview')
  async getOverview(@CurrentUser('sub') userId: string) {
    return this.creditsService.getOverview(userId);
  }

  /** 获取积分明细 */
  @Get('history')
  async getHistory(
    @CurrentUser('sub') userId: string,
    @Query('type') type?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.creditsService.getHistory(userId, {
      type,
      page: page ? parseInt(page) : undefined,
      pageSize: pageSize ? parseInt(pageSize) : undefined,
    });
  }

  /** 积分抵扣会员购买 */
  @Post('use/membership')
  async useForMembership(
    @CurrentUser('sub') userId: string,
    @Body() dto: UseCreditsForMembershipDto,
  ) {
    return this.creditsService.useCreditsForMembership(userId, dto.creditsToUse, dto.planId);
  }

  /** 积分抵扣消耗次数 */
  @Post('use/quota')
  async useForQuota(
    @CurrentUser('sub') userId: string,
    @Body() dto: UseCreditsForQuotaDto,
  ) {
    return this.creditsService.useCreditsForQuota(userId, dto.creditsToUse);
  }
}
