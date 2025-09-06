'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function MyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    api.get('/me/bookings').then(res => setBookings(res.data));
  }, []);

  const handleGenerateMeeting = async (id: string) => {
    const res = await api.post(`/meetings/${id}/create`);
    alert(`Lien du cours : ${res.data}`);
  };

  return (
    <div className="flex flex-col gap-4">
      {bookings.map(booking => (
        <div key={booking.id} className="border p-2 rounded">
          <p>Prof: {booking.session.teacher.userId}</p>
          <p>Date: {new Date(booking.session.start).toLocaleString()}</p>
          <p>Lien: {booking.session.meetingUrl || 'Non généré'}</p>
          {!booking.session.meetingUrl && <button onClick={() => handleGenerateMeeting(booking.session.id)}>Générer lien</button>}
        </div>
      ))}
    </div>
  );
}