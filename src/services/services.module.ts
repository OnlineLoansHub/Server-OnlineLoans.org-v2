import { Module, Global } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { EmailModule } from './email/email.module';
import { SmsModule } from './sms/sms.module';
import { GoogleSheetsModule } from './google-sheets/google-sheets.module';
import { HubspotModule } from './hubspot/hubspot.module';

@Global()
@Module({
  imports: [
    TelegramModule,
    EmailModule,
    SmsModule,
    GoogleSheetsModule,
    HubspotModule,
  ],
  exports: [
    TelegramModule,
    EmailModule,
    SmsModule,
    GoogleSheetsModule,
    HubspotModule,
  ],
})
export class ServicesModule {}

