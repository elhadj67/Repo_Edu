'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    api.get('/sessions').then(res => setSessions(res.data));
  }, []);

  const handleBook = async (id: string) => {
    const studentId = localStorage.getItem('studentId');
    await api.post(`/sessions/${id}/book`, { studentId });
    alert('Session booked!');
  };

  return (
    <div className="flex flex-col gap-4">
      {sessions.map(session => (
        <div key={session.id} className="border p-2 rounded">
          <p>Prof: {session.teacher.userId}</p>
          <p>Start: {new Date(session.start).toLocaleString()}</p>
          <p>End: {new Date(session.end).toLocaleString()}</p>
          <button onClick={() => handleBook(session.id)}>Réserver</button>
        </div>
      ))}
    </div>
  );
}