import { Controller, Post, Body, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import Stripe from 'stripe';

@Controller('payments')
export class PaymentsController {
  constructor(private service: PaymentsService) {}

  @Post('create-intent')
  async createIntent(@Body() body: { amount: number; bookingId: string }) {
    const paymentIntent = await this.service.createPaymentIntent(body.amount, 'EUR', { bookingId: body.bookingId });
    return { clientSecret: paymentIntent.client_secret };
  }

  @Post('webhook')
  async webhook(@Req() req: any) {
    const sig = req.headers['stripe-signature'];
    const event = this.service['stripe'].webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    if (event.type === 'payment_intent.succeeded') {
      await this.service.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
    }
    return { received: true };
  }
}