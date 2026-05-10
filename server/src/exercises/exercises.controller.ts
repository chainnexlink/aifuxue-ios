import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { GenerateExerciseDto } from './dto/exercise.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ParentAuthGuard } from '../common/guards/parent-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('exercises')
@UseGuards(JwtAuthGuard)
export class ExercisesController {
  constructor(private exercisesService: ExercisesService) {}

  @Post('generate')
  async generate(
    @CurrentUser('sub') userId: string,
    @Body() dto: GenerateExerciseDto,
  ) {
    return this.exercisesService.generate(userId, dto.noteId);
  }

  @Get(':id')
  async getById(
    @CurrentUser('sub') userId: string,
    @Param('id') exerciseId: string,
  ) {
    return this.exercisesService.getById(userId, exerciseId);
  }

  @Post(':id/submit')
  async submit(
    @CurrentUser('sub') userId: string,
    @Param('id') exerciseId: string,
    @Body('answers') answers: any,
  ) {
    return this.exercisesService.submit(userId, exerciseId, answers);
  }

  @Post(':id/answer-key')
  @UseGuards(ParentAuthGuard)
  async getAnswerKey(
    @CurrentUser('sub') userId: string,
    @Param('id') exerciseId: string,
  ) {
    return this.exercisesService.getAnswerKey(userId, exerciseId);
  }
}
