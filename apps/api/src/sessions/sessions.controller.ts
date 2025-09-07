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
    // Conversion teacherId en string pour Prisma
    return this.service.createSession(
      teacherId.toString(),
      new Date(start),
      new Date(end),
    );
  }

  @Post(':id/book')
  async book(@Param('id') sessionId: string, @Body() body: any) {
    const { studentId } = body;
    // Conversion sessionId et studentId en string
    return this.service.bookSession(
      sessionId.toString(),
      studentId.toString(),
    );
  }
}
