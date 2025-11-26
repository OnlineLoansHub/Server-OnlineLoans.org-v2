# Services Module

This folder contains shared services that can be used throughout the application.

## Current Services

### Telegram Service
- **Location**: `telegram/telegram.service.ts`
- **Purpose**: Send notifications to a Telegram group/chat
- **Usage**: Inject `TelegramService` into any service or controller
- **Environment Variables**:
  - `TELEGRAM_BOT_TOKEN` - Your Telegram bot token
  - `TELEGRAM_CHAT_ID` - The chat ID where messages should be sent
- **Methods**:
  - `sendMessage(message: string)` - Send a custom message
  - `notifyNewPartner(partnerData)` - Send formatted partner notification
  - `notifyNewContact(contactData)` - Send formatted contact notification
  - `notifyNewLoanApplication(applicationData)` - Send formatted loan application notification

### Email Service
- **Location**: `email/email.service.ts`
- **Purpose**: Send emails via SMTP or email service providers
- **Usage**: Inject `EmailService` into any service or controller
- **Environment Variables**:
  - `EMAIL_FROM` - Default sender email (default: noreply@onlineloans.org)
  - `EMAIL_FROM_NAME` - Default sender name (default: OnlineLoans.org)
  - `SMTP_HOST` - SMTP server host
  - `SMTP_PORT` - SMTP server port
  - `SMTP_USER` - SMTP username
  - `SMTP_PASSWORD` - SMTP password
  - `ADMIN_EMAIL` - Admin email for notifications
- **Methods**:
  - `sendEmail(to, subject, htmlBody, textBody?)` - Send a custom email
  - `sendPartnerWelcomeEmail(partnerData)` - Send welcome email to new partner
  - `sendContactConfirmationEmail(contactData)` - Send confirmation to contact form submitter
  - `sendLoanApplicationNotification(applicationData)` - Send notification to admins

### SMS Service
- **Location**: `sms/sms.service.ts`
- **Purpose**: Send SMS messages via various providers (Twilio, AWS SNS, etc.)
- **Usage**: Inject `SmsService` into any service or controller
- **Environment Variables**:
  - `SMS_API_KEY` - SMS provider API key
  - `SMS_API_SECRET` - SMS provider API secret
  - `SMS_FROM_NUMBER` - Sender phone number
  - `SMS_PROVIDER` - Provider name (default: twilio)
- **Methods**:
  - `sendSms(to, message)` - Send a custom SMS
  - `sendVerificationCode(phoneNumber, code)` - Send verification code
  - `sendLoanStatusUpdate(phoneNumber, status)` - Send loan status update

### Google Sheets Service
- **Location**: `google-sheets/google-sheets.service.ts`
- **Purpose**: Log data to Google Sheets for tracking and analytics
- **Usage**: Inject `GoogleSheetsService` into any service or controller
- **Environment Variables**:
  - `GOOGLE_SHEETS_ID` - Google Spreadsheet ID
  - `GOOGLE_SHEETS_CREDENTIALS` - JSON credentials or path to credentials file
- **Methods**:
  - `appendRow(sheetName, values)` - Append a row to a sheet
  - `logPartner(partnerData)` - Log partner to "Partners" sheet
  - `logContact(contactData)` - Log contact to "Contacts" sheet
  - `logLoanApplication(applicationData)` - Log loan application to "Loan Applications" sheet

### HubSpot Service
- **Location**: `hubspot/hubspot.service.ts`
- **Purpose**: Sync contacts and deals to HubSpot CRM
- **Usage**: Inject `HubspotService` into any service or controller
- **Environment Variables**:
  - `HUBSPOT_API_KEY` - HubSpot API key (legacy)
  - `HUBSPOT_ACCESS_TOKEN` - HubSpot access token (recommended)
- **Methods**:
  - `createOrUpdateContact(contactData)` - Create or update a contact
  - `createDeal(dealData)` - Create a deal
  - `syncPartner(partnerData)` - Sync partner as HubSpot contact
  - `syncLoanApplication(applicationData)` - Sync loan application (contact + deal)

## Adding New Services

To add a new service (e.g., Email, SMS, Google Sheets, HubSpot):

1. Create a new folder for your service:
   ```
   src/services/email/
   ```

2. Create the service file:
   ```typescript
   // src/services/email/email.service.ts
   import { Injectable } from '@nestjs/common';
   import { ConfigService } from '@nestjs/config';

   @Injectable()
   export class EmailService {
     constructor(private configService: ConfigService) {}

     async sendEmail(to: string, subject: string, body: string) {
       // Your email sending logic
     }
   }
   ```

3. Create the module file:
   ```typescript
   // src/services/email/email.module.ts
   import { Module } from '@nestjs/common';
   import { EmailService } from './email.service';

   @Module({
     providers: [EmailService],
     exports: [EmailService],
   })
   export class EmailModule {}
   ```

4. Add the module to `services.module.ts`:
   ```typescript
   import { EmailModule } from './email/email.module';

   @Global()
   @Module({
     imports: [TelegramModule, EmailModule], // Add here
     exports: [TelegramModule, EmailModule], // Export here
   })
   export class ServicesModule {}
   ```

5. Use the service anywhere in your app:
   ```typescript
   import { EmailService } from '../../services/email/email.service';

   constructor(private emailService: EmailService) {}
   ```

## Usage Examples

### Telegram Service
```typescript
import { TelegramService } from '../../services/telegram/telegram.service';

@Injectable()
export class YourService {
  constructor(private telegramService: TelegramService) {}

  async doSomething() {
    // Send a custom message
    await this.telegramService.sendMessage('Hello from the app!');

    // Or use predefined notification methods
    await this.telegramService.notifyNewPartner({
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Acme Corp',
      phone: '+1234567890',
    });
  }
}
```

### Email Service
```typescript
import { EmailService } from '../../services/email/email.service';

@Injectable()
export class YourService {
  constructor(private emailService: EmailService) {}

  async sendWelcomeEmail() {
    await this.emailService.sendPartnerWelcomeEmail({
      email: 'partner@example.com',
      name: 'John Doe',
      company: 'Acme Corp',
    });
  }
}
```

### SMS Service
```typescript
import { SmsService } from '../../services/sms/sms.service';

@Injectable()
export class YourService {
  constructor(private smsService: SmsService) {}

  async sendVerification() {
    await this.smsService.sendVerificationCode('+1234567890', '123456');
  }
}
```

### Google Sheets Service
```typescript
import { GoogleSheetsService } from '../../services/google-sheets/google-sheets.service';

@Injectable()
export class YourService {
  constructor(private googleSheetsService: GoogleSheetsService) {}

  async logData() {
    await this.googleSheetsService.logPartner({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      company: 'Acme Corp',
      site: 'https://acme.com',
      createdAt: new Date(),
    });
  }
}
```

### HubSpot Service
```typescript
import { HubspotService } from '../../services/hubspot/hubspot.service';

@Injectable()
export class YourService {
  constructor(private hubspotService: HubspotService) {}

  async syncToHubSpot() {
    const contactId = await this.hubspotService.syncPartner({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      company: 'Acme Corp',
      site: 'https://acme.com',
    });
  }
}
```

