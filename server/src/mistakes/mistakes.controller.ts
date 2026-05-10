import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MistakesService } from './mistakes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('mistakes')
@UseGuards(JwtAuthGuard)
export class MistakesController {
  constructor(private mistakesService: MistakesService) {}

  @Post()
  async create(
    @CurrentUser('sub') userId: string,
    @Body() body: { imageUrls: string[]; wrongAnswer?: string; subject?: string },
  ) {
    return this.mistakesService.create(
      userId,
      body.imageUrls,
      body.wrongAnswer,
      body.subject,
    );
  }

  @Get()
  async list(
    @CurrentUser('sub') userId: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('subject') subject?: string,
  ) {
    return this.mistakesService.list(
      userId,
      page ? parseInt(page) : 1,
      pageSize ? parseInt(pageSize) : 20,
      subject,
    );
  }

  @Get(':id')
  async getById(
    @CurrentUser('sub') userId: string,
    @Param('id') mistakeId: string,
  ) {
    return this.mistakesService.getById(userId, mistakeId);
  }

  @Post(':id/similar')
  async generateSimilar(
    @CurrentUser('sub') userId: string,
    @Param('id') mistakeId: string,
  ) {
    return this.mistakesService.generateSimilar(userId, mistakeId);
  }

  @Post('similar/:id/submit')
  async submitSimilar(
    @CurrentUser('sub') userId: string,
    @Param('id') similarId: string,
    @Body('answers') answers: any,
  ) {
    return this.mistakesService.submitSimilar(userId, similarId, answers);
  }

  @Delete(':id')
  async delete(
    @CurrentUser('sub') userId: string,
    @Param('id') mistakeId: string,
  ) {
    return this.mistakesService.delete(userId, mistakeId);
  }
}
