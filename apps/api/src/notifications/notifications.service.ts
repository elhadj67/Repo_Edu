import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class NotificationsService {
  private prisma = new PrismaClient();

  // Cron toutes les heures
  @Cron(CronExpression.EVERY_HOUR)
  async sendUpcomingSessionReminders() {
    const now = new Date();
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000);

    const upcomingBookings = await this.prisma.booking.findMany({
      where: {
        status: 'CONFIRMED',
        session: {
          start: {
            gte: now,
            lte: nextHour
          }
        }
      },
      include: { student: true, session: true }
    });

    for (const booking of upcomingBookings) {
      await axios.post('https://api.resend.com/emails', {
        from: 'no-reply@edu-live.com',
        to: booking.student.email,
        subject: 'Rappel : Votre cours commence bientôt',
        html: `<p>Votre cours commence à ${booking.session.start.toLocaleString()}</p><p>Lien : <a href='${booking.session.meetingUrl}'>Rejoindre le cours</a></p>`
      }, {
        headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` }
      });
    }
  }
}