import { IsString, IsOptional } from 'class-validator';

export class GenerateExerciseDto {
  @IsString()
  noteId: string;

  @IsOptional()
  @IsString()
  difficulty?: string;
}
