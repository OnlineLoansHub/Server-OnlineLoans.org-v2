import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly apiKey?: string;
  private readonly apiSecret?: string;
  private readonly fromNumber?: string;
  private readonly provider?: string; // 'twilio', 'aws-sns', 'nexmo', etc.

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('SMS_API_KEY');
    this.apiSecret = this.configService.get<string>('SMS_API_SECRET');
    this.fromNumber = this.configService.get<string>('SMS_FROM_NUMBER');
    this.provider = this.configService.get<string>('SMS_PROVIDER') || 'twilio';
  }

  /**
   * Send an SMS message
   */
  async sendSms(to: string, message: string): Promise<boolean> {
    if (!this.apiKey || !this.apiSecret || !this.fromNumber) {
      this.logger.warn('SMS configuration not complete. SMS not sent.');
      this.logger.debug(`Would send SMS to: ${to}, message: ${message.substring(0, 50)}...`);
      return false;
    }

    try {
      // TODO: Implement actual SMS sending based on provider
      // Example with Twilio:
      // const client = require('twilio')(this.apiKey, this.apiSecret);
      // await client.messages.create({
      //   body: message,
      //   from: this.fromNumber,
      //   to: to,
      // });

      this.logger.log(`SMS sent to ${to}`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error sending SMS: ${errorMessage}`);
      return false;
    }
  }

  /**
   * Send a verification code via SMS
   */
  async sendVerificationCode(phoneNumber: string, code: string): Promise<boolean> {
    const message = `Your OnlineLoans.org verification code is: ${code}. Valid for 10 minutes.`;
    return this.sendSms(phoneNumber, message);
  }

  /**
   * Send a notification about loan application status
   */
  async sendLoanStatusUpdate(phoneNumber: string, status: string): Promise<boolean> {
    const message = `Your loan application status has been updated to: ${status}. Check your email for details.`;
    return this.sendSms(phoneNumber, message);
  }
}

