import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser('sub') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Put('profile')
  async updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Get('stats')
  async getStats(@CurrentUser('sub') userId: string) {
    return this.usersService.getStats(userId);
  }

  @Get('badges')
  async getBadges(@CurrentUser('sub') userId: string) {
    return this.usersService.getBadges(userId);
  }

  @Get('today-stats')
  async getTodayStats(@CurrentUser('sub') userId: string) {
    return this.usersService.getTodayStats(userId);
  }
}
