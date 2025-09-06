// src/teachers/teachers.service.ts
import { Injectable } from '@nestjs/common';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class TeachersService {
  private teachers: Teacher[] = [];

  // Ajouter un enseignant
  addTeacher(teacher: Teacher) {
    this.teachers.push(teacher);
  }

  // Obtenir tous les enseignants
  findAll(): Teacher[] {
    return this.teachers;
  }

  // Obtenir un enseignant par ID
  findOne(id: string): Teacher | undefined {
    return this.teachers.find(t => t.id === id);
  }

  // Mettre à jour un enseignant
  update(id: string, updated: Partial<Teacher>): Teacher | undefined {
    const teacher = this.findOne(id);
    if (!teacher) return undefined;
    Object.assign(teacher, updated);
    return teacher;
  }

  // Générer des créneaux disponibles pour un jour donné
  getAvailableSlots(teacherId: string, dayName: string) {
    const teacher = this.findOne(teacherId);
    if (!teacher || !teacher.weeklyAvailability || !teacher.slotDuration) return [];

    const slots = teacher.weeklyAvailability[dayName] || [];
    return slots.map(slot => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slotStart.getTime() + teacher.slotDuration! * 60000);
      return { start: slotStart, end: slotEnd };
    });
  }

  // Générer des sessions sur plusieurs jours (exemple)
  generateSessions(id: string, dto: { startDate: string; endDate: string }) {
    const teacher = this.findOne(id);
    if (!teacher) return [];

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    const sessions = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      const slots = this.getAvailableSlots(id, dayName);
      sessions.push(...slots.map(slot => ({ teacherId: id, date: d.toISOString(), ...slot })));
    }

    return sessions;
  }
}
