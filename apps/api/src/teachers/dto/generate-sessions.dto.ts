import { IsDateString, IsNotEmpty } from 'class-validator';

// src/teachers/dto/generate-sessions.dto.ts
export class GenerateSessionsDto {
  startDate!: string;
  endDate!: string;
}

// src/teachers/entities/teacher.entity.ts
export class Teacher {
  id!: string; // UUID
  firstName!: string;
  lastName!: string;
  email!: string;
}
