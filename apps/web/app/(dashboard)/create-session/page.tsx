'use client';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';

export default function CreateSessionPage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    await api.post('/sessions/create', {
      teacherId: localStorage.getItem('teacherId'),
      start: data.start,
      end: data.end,
    });
    alert('Session créée !');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <input type="datetime-local" {...register('start')} />
      <input type="datetime-local" {...register('end')} />
      <button type="submit">Créer Session</button>
    </form>
  );
}