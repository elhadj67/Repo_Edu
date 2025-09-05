export class Teacher {
  id: string; // UUID
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  pricePerSlot?: number;
  slotDuration?: number; // en minutes
  weeklyAvailability?: Record<string, string[]>; 
  // ex: { monday: ['09:00-11:00', '14:00-16:00'], tuesday: [...] }
}
