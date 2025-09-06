// src/meetings/meetings.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class MeetingsService {
  constructor(private readonly prisma: PrismaService) {}

  async generateJitsiLink(sessionId: string) {
    const meetingUrl = `https://meet.jit.si/${sessionId}-${Date.now()}`;
    await this.prisma.courseSession.update({
      where: { id: sessionId },
      data: { meetingUrl },
    });
    return meetingUrl;
  }

  async sendConfirmationEmail(studentEmail: string, meetingUrl: string, sessionDate: Date) {
    await axios.post(
      'https://api.resend.com/emails',
      {
        from: 'no-reply@edu-live.com',
        to: studentEmail,
        subject: 'Confirmation de votre cours',
        html: `<p>Votre cours est confirmé pour ${sessionDate.toLocaleString()}</p>
               <p>Lien : <a href='${meetingUrl}'>Rejoindre le cours</a></p>`,
      },
      {
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      },
    );
  }

  async createMeetingAndNotify(sessionId: string) {
    const session = await this.prisma.courseSession.findUnique({
      where: { id: sessionId },
      include: { booking: { include: { student: true } } },
    });

    if (!session || !session.booking) return null;

    const meetingUrl = await this.generateJitsiLink(sessionId);
    await this.sendConfirmationEmail(
      session.booking.student.email,
      meetingUrl,
      session.start,
    );
    return meetingUrl;
  }
}
