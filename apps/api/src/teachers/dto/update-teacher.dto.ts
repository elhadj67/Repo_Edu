import { IsOptional, IsString, IsNumber, IsArray, IsObject } from 'class-validator';

export class UpdateTeacherDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  pricePerSlot?: number;

  @IsOptional()
  @IsNumber()
  slotDuration?: number;

  @IsOptional()
  @IsObject()
  weeklyAvailability?: Record<string, string[]>; 
}
