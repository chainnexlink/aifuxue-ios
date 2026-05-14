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
import { CreditsModule } from './credits/credits.module';
import { SearchModule } from './search/search.module';
import { SubscriptionModule } from './subscription/subscription.module';

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
    CreditsModule,
    SearchModule,
    SubscriptionModule,
  ],
})
export class AppModule {}
