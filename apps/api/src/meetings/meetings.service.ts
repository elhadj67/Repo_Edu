// src/meetings/meetings.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class MeetingsService {
  constructor(private readonly prisma: PrismaService) {}

  // Générer un lien Jitsi pour une session
  async generateJitsiLink(sessionId: number) {
    const meetingUrl = `https://meet.jit.si/${sessionId}-${Date.now()}`;
    await this.prisma.courseSession.update({
      where: { id: sessionId },
      data: { meetingUrl },
    });
    return meetingUrl;
  }

  // Envoyer l'email de confirmation à l'étudiant
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

  // Créer un meeting et notifier tous les étudiants
  async createMeetingAndNotify(sessionId: number) {
    const session = await this.prisma.courseSession.findUnique({
      where: { id: sessionId },
      include: { bookings: { include: { student: true } } }, // ✅ bookings au lieu de booking
    });

    if (!session || !session.bookings || session.bookings.length === 0) return null;

    const meetingUrl = await this.generateJitsiLink(sessionId);

    // envoyer l'email à tous les étudiants
    for (const booking of session.bookings) {
      await this.sendConfirmationEmail(
        booking.student.email,
        meetingUrl,
        session.start,
      );
    }

    return meetingUrl;
  }
}
