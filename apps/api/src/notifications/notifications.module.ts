import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [NotificationsService],
})
export class NotificationsModule {}