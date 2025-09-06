// src/teachers/teachers.controller.ts
import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { Teacher } from './entities/teacher.entity';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  // Obtenir tous les enseignants
  @Get()
  findAll(): Teacher[] {
    return this.teachersService.findAll();
  }

  // Obtenir un enseignant par ID
  @Get(':id')
  findOne(@Param('id') id: string): Teacher | undefined {
    return this.teachersService.findOne(id);
  }

  // Mettre à jour un enseignant
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<Teacher>): Teacher | undefined {
    return this.teachersService.update(id, dto);
  }

  // Générer des sessions pour un enseignant
  @Post(':id/sessions')
  generateSessions(
    @Param('id') id: string,
    @Body() dto: { startDate: string; endDate: string },
  ) {
    return this.teachersService.generateSessions(id, dto);
  }

  // Ajouter un nouvel enseignant
  @Post()
  addTeacher(@Body() dto: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    slotDuration?: number;
    weeklyAvailability?: { [day: string]: { start: string }[] };
  }): Teacher {
    const teacher = new Teacher(
      dto.id,
      dto.firstName,
      dto.lastName,
      dto.email,
      dto.slotDuration,
      dto.weeklyAvailability,
    );
    this.teachersService.addTeacher(teacher);
    return teacher;
  }
}
