// src/payments/payments.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  private stripe = new Stripe(process.env.STRIPE_SECRET!, { apiVersion: '2022-11-15' });

  constructor(private readonly prisma: PrismaService) {}

  // Créer un PaymentIntent Stripe
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

  // Gestion du paiement réussi
  async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    let bookingId = paymentIntent.metadata.bookingId;
    if (!bookingId) return;

    // Convertir en string pour Prisma
    bookingId = bookingId.toString();

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
    });

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (booking) {
      await this.prisma.courseSession.update({
        where: { id: booking.sessionId.toString() }, // conversion en string
        data: { status: 'RESERVED' },
      });
    }
  }
}
