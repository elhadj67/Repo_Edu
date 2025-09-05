import { Controller, Get, Patch, Param, Body, Post } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { GenerateSessionsDto } from './dto/generate-sessions.dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  findAll() {
    return this.teachersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTeacherDto) {
    return this.teachersService.update(id, dto);
  }

  @Post(':id/sessions/generate')
  generateSessions(@Param('id') id: string, @Body() dto: GenerateSessionsDto) {
    return this.teachersService.generateSessions(id, dto);
  }
}
