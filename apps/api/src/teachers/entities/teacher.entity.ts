// src/teachers/entities/teacher.entity.ts
export class Teacher {
  id: string; // UUID
  firstName: string;
  lastName: string;
  email: string;
  slotDuration?: number; // durée d'un créneau en minutes
  weeklyAvailability?: {
    [day: string]: { start: string }[]; // liste des créneaux par jour
  };

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    slotDuration?: number,
    weeklyAvailability?: { [day: string]: { start: string }[] },
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.slotDuration = slotDuration;
    this.weeklyAvailability = weeklyAvailability;
  }
}
