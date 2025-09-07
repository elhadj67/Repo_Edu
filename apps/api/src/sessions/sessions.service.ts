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
  async createSession(teacherId: number, start: Date, end: Date) {
    return this.prisma.courseSession.create({
      data: {
        teacherId,
        start,
        end,
        status: 'OPEN',
      },
    });
  }

  // Réserver une session
  async bookSession(sessionId: number, studentId: number) {
    const session = await this.prisma.courseSession.findUnique({ where: { id: sessionId } });

    if (!session || session.status !== 'OPEN') {
      throw new NotFoundException('Session not available');
    }

    // Créer une réservation
    const booking = await this.prisma.booking.create({
      data: {
        sessionId,
        studentId,
        status: 'PENDING_PAYMENT',
      },
    });

    // Marquer la session comme réservée
    await this.prisma.courseSession.update({
      where: { id: sessionId },
      data: { status: 'RESERVED' },
    });

    return booking;
  }
}
