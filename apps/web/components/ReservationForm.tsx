import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({ email: z.string().email() });

export function ReservationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register("email")} placeholder="Votre email"/>
      {errors.email && <p className="text-red-500">Email invalide</p>}
      <button type="submit">Réserver</button>
    </form>
  );
}