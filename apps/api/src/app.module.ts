import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MeetingsModule } from './meetings/meetings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import { SessionsModule } from './sessions/sessions.module';
import { TeachersModule } from './teachers/teachers.module';

@Module({
  imports: [
    MeetingsModule,
    NotificationsModule,
    PaymentsModule,
    SessionsModule,
    TeachersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
