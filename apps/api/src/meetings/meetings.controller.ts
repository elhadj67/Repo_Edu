// src/meetings/meetings.controller.ts
import { Controller, Post, Param } from '@nestjs/common';
import { MeetingsService } from './meetings.service';

@Controller('meetings')
export class MeetingsController {
  constructor(private readonly service: MeetingsService) {}

  @Post(':sessionId/create')
  async createMeeting(@Param('sessionId') sessionId: string) {
    // Convertir en string si nécessaire
    return this.service.createMeetingAndNotify(sessionId.toString());
  }
}
