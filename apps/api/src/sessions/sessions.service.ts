import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SessionsService {
  private prisma = new PrismaClient();

  async listOpenSessions() {
    return this.prisma.courseSession.findMany({ where: { status: 'OPEN' }, include: { teacher: true } });
  }

  async createSession(teacherId: string, start: Date, end: Date) {
    return this.prisma.courseSession.create({
      data: { teacherId, start, end, status: 'OPEN' },
    });
  }

  async bookSession(sessionId: string, studentId: string) {
    const session = await this.prisma.courseSession.findUnique({ where: { id: sessionId } });
    if (!session || session.status !== 'OPEN') throw new NotFoundException('Session not available');

    // create booking
    const booking = await this.prisma.booking.create({
      data: { sessionId, studentId, status: 'PENDING_PAYMENT' },
    });

    // mark session as reserved
    await this.prisma.courseSession.update({ where: { id: sessionId }, data: { status: 'RESERVED' } });

    return booking;
  }
}