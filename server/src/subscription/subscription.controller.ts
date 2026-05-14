import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { VerifyTransactionDto } from './dto/verify-transaction.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('subscription')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post('verify')
  async verifyTransaction(
    @CurrentUser('sub') userId: string,
    @Body() dto: VerifyTransactionDto,
  ) {
    return this.subscriptionService.verifyAndProcessTransaction(
      userId,
      dto.signedTransaction,
    );
  }

  @Get('status')
  async getStatus(@CurrentUser('sub') userId: string) {
    return this.subscriptionService.getSubscriptionStatus(userId);
  }
}
