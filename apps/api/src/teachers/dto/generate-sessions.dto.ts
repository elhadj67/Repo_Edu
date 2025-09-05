import { IsDateString, IsNotEmpty } from 'class-validator';

export class GenerateSessionsDto {
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;
}
