// src/payments/payments.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  private stripe = new Stripe(process.env.STRIPE_SECRET!, { apiVersion: '2022-11-15' });

  constructor(private readonly prisma: PrismaService) {}

  async createPaymentIntent(
    amount: number,
    currency = 'EUR',
    metadata: Record<string, string> = {},
  ) {
    return this.stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata,
    });
  }

  async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const bookingId = paymentIntent.metadata.bookingId;
    if (!bookingId) return;

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
    });

    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (booking) {
      await this.prisma.courseSession.update({
        where: { id: booking.sessionId },
        data: { status: 'RESERVED' },
      });
    }
  }
}
