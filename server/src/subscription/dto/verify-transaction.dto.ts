import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyTransactionDto {
  @IsString()
  @IsNotEmpty()
  signedTransaction: string;
}
