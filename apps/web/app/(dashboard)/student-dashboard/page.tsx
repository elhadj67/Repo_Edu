'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function StudentDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    api.get('/me/bookings').then(res => setBookings(res.data));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1>Mes Cours</h1>
      {bookings.map(booking => (
        <div key={booking.id} className="border p-2 rounded">
          <p>Prof: {booking.session.teacher.userId}</p>
          <p>Date: {new Date(booking.session.start).toLocaleString()}</p>
          <p>Lien: {booking.session.meetingUrl || 'Non généré'}</p>
        </div>
      ))}
    </div>
  );
}