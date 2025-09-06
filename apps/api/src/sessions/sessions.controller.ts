import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private service: SessionsService) {}

  @Get()
  async listOpen() {
    return this.service.listOpenSessions();
  }

  @Post('create')
  async create(@Body() body: any) {
    const { teacherId, start, end } = body;
    return this.service.createSession(teacherId, new Date(start), new Date(end));
  }

  @Post(':id/book')
  async book(@Param('id') sessionId: string, @Body() body: any) {
    const { studentId } = body;
    return this.service.bookSession(sessionId, studentId);
  }
}