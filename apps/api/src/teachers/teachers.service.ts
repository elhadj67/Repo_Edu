import { Injectable, NotFoundException } from '@nestjs/common';
import { Teacher } from './entities/teacher.entity';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { GenerateSessionsDto } from './dto/generate-sessions.dto';

@Injectable()
export class TeachersService {
  private teachers: Teacher[] = [
    {
      id: '1',
      firstName: 'Alice',
      lastName: 'Dupont',
      email: 'alice@test.com',
      weeklyAvailability: {
        monday: ['09:00-11:00', '14:00-16:00'],
        wednesday: ['10:00-12:00'],
      },
      slotDuration: 60, // minutes
      pricePerSlot: 30,
    },
  ];

  findAll(): Teacher[] {
    return this.teachers;
  }

  findOne(id: string): Teacher {
    const teacher = this.teachers.find(t => t.id === id);
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  update(id: string, dto: UpdateTeacherDto): Teacher {
    const teacher = this.findOne(id);
    Object.assign(teacher, dto);
    return teacher;
  }

  generateSessions(id: string, dto: GenerateSessionsDto): string[] {
    const teacher = this.findOne(id);
    if (!teacher.weeklyAvailability || !teacher.slotDuration) {
      return [];
    }

    const slots: string[] = [];
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    // Parcours chaque jour de la fenêtre
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const availabilities = teacher.weeklyAvailability[dayName];
      if (availabilities) {
        for (const range of availabilities) {
          const [startTime, endTime] = range.split('-');
          let slotStart = new Date(d);
          const [startHour, startMinute] = startTime.split(':').map(Number);
          slotStart.setHours(startHour, startMinute, 0, 0);

          const [endHour, endMinute] = endTime.split(':').map(Number);
          const slotEndLimit = new Date(d);
          slotEndLimit.setHours(endHour, endMinute, 0, 0);

          while (slotStart < slotEndLimit) {
            const slotEnd = new Date(slotStart.getTime() + teacher.slotDuration * 60000);
            if (slotEnd > slotEndLimit) break;
            slots.push(`${slotStart.toISOString()} - ${slotEnd.toISOString()}`);
            slotStart = slotEnd;
          }
        }
      }
    }

    return slots;
  }
}
