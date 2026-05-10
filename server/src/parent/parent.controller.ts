import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ParentService } from './parent.service';
import {
  SetParentPasswordDto,
  VerifyParentPasswordDto,
} from './dto/parent.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('parent')
@UseGuards(JwtAuthGuard)
export class ParentController {
  constructor(private parentService: ParentService) {}

  @Post('set-password')
  async setPassword(
    @CurrentUser('sub') userId: string,
    @Body() dto: SetParentPasswordDto,
  ) {
    return this.parentService.setPassword(userId, dto.password);
  }

  @Post('verify-password')
  async verifyPassword(
    @CurrentUser('sub') userId: string,
    @Body() dto: VerifyParentPasswordDto,
  ) {
    return this.parentService.verifyPassword(userId, dto.password);
  }

  @Get('has-password')
  async hasPassword(@CurrentUser('sub') userId: string) {
    const has = await this.parentService.hasPassword(userId);
    return { hasPassword: has };
  }
}
