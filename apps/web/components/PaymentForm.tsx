'use client';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { api } from '@/lib/api';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);

export function PaymentForm({ bookingId, amount }: { bookingId: string; amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const { data } = await api.post('/payments/create-intent', { bookingId, amount });
    const clientSecret = data.clientSecret;

    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, { payment_method: { card } });
    setLoading(false);

    if (error) alert(error.message);
    else if (paymentIntent?.status === 'succeeded') alert('Paiement réussi !');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <CardElement />
      <button type="submit" disabled={loading}>Payer {amount / 100} €</button>
    </form>
  );
}

export default function StripeWrapper(props: any) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}