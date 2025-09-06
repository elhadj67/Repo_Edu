'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function TeacherDashboard() {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    api.get('/me/sessions').then(res => setSessions(res.data));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1>Mes Sessions</h1>
      {sessions.map(session => (
        <div key={session.id} className="border p-2 rounded">
          <p>Étudiants inscrits: {session.booking.length}</p>
          <p>Date: {new Date(session.start).toLocaleString()}</p>
          <p>Lien: {session.meetingUrl || 'Non généré'}</p>
        </div>
      ))}
    </div>
  );
}