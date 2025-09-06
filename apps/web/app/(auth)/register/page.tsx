'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['STUDENT', 'TEACHER']),
});

export default function RegisterPage() {
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: any) => {
    try {
      const res = await api.post('/auth/register', data);
      console.log('User registered:', res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <input placeholder="Email" {...register('email')} />
      <input type="password" placeholder="Password" {...register('password')} />
      <input placeholder="First Name" {...register('firstName')} />
      <input placeholder="Last Name" {...register('lastName')} />
      <select {...register('role')}>
        <option value="STUDENT">Student</option>
        <option value="TEACHER">Teacher</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
}