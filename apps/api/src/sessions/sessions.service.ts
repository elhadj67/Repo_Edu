import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SessionsService {
  private prisma = new PrismaClient();

  // Lister les sessions ouvertes
  async listOpenSessions() {
    return this.prisma.courseSession.findMany({
      where: { status: 'OPEN' },
      include: { teacher: true },
    });
  }

  // Créer une session
  async createSession(teacherId: number | string, start: Date, end: Date) {
    return this.prisma.courseSession.create({
      data: {
        teacherId: teacherId.toString(), // conversion en string
        start,
        end,
        status: 'OPEN',
      },
    });
  }

  // Réserver une session
  async bookSession(sessionId: number | string, studentId: number | string) {
    const session = await this.prisma.courseSession.findUnique({
      where: { id: sessionId.toString() }, // conversion en string
    });

    if (!session || session.status !== 'OPEN') {
      throw new NotFoundException('Session not available');
    }

    // Créer une réservation
    const booking = await this.prisma.booking.create({
      data: {
        sessionId: sessionId.toString(), // conversion en string
        studentId: studentId.toString(), // conversion en string
        status: 'PENDING_PAYMENT',
      },
    });

    // Marquer la session comme réservée
    await this.prisma.courseSession.update({
      where: { id: sessionId.toString() }, // conversion en string
      data: { status: 'RESERVED' },
    });

    return booking;
  }
}
