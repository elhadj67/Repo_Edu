'use client';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';

export default function LoginPage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const res = await api.post('/auth/login', data);
      console.log('JWT token:', res.data.accessToken);
      localStorage.setItem('token', res.data.accessToken);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <input placeholder="Email" {...register('email')} />
      <input type="password" placeholder="Password" {...register('password')} />
      <button type="submit">Login</button>
    </form>
  );
}