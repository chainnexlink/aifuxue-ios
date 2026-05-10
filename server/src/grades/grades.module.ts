import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { GradesController } from './grades.controller';
import { GradesService } from './grades.service';

@Module({
  imports: [MulterModule],
  controllers: [GradesController],
  providers: [GradesService],
})
export class GradesModule {}
