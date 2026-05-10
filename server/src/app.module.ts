import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NotesModule } from './notes/notes.module';
import { ParentModule } from './parent/parent.module';
import { ExercisesModule } from './exercises/exercises.module';
import { MistakesModule } from './mistakes/mistakes.module';
import { WebsiteModule } from './website/website.module';
import { GradesModule } from './grades/grades.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AiModule,
    AuthModule,
    UsersModule,
    NotesModule,
    ParentModule,
    ExercisesModule,
    MistakesModule,
    WebsiteModule,
    GradesModule,
  ],
})
export class AppModule {}
