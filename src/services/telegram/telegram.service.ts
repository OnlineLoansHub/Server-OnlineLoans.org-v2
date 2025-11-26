import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken: string;
  private readonly chatId: string;
  private readonly apiUrl: string;

  constructor(private configService: ConfigService) {
    this.botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN') || '';
    this.chatId = this.configService.get<string>('TELEGRAM_CHAT_ID') || '';
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  /**
   * Send a message to the configured Telegram chat
   */
  async sendMessage(message: string): Promise<boolean> {
    if (!this.botToken || !this.chatId) {
      this.logger.warn('Telegram bot token or chat ID not configured. Message not sent.');
      return false;
    }

    try {
      const response = await fetch(`${this.apiUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        this.logger.error(`Failed to send Telegram message: ${JSON.stringify(error)}`);
        return false;
      }

      this.logger.log('Telegram message sent successfully');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error sending Telegram message: ${errorMessage}`);
      return false;
    }
  }

  /**
   * Send a formatted notification about a new partner
   */
  async notifyNewPartner(partnerData: {
    name: string;
    email: string;
    company: string;
    phone?: string;
  }): Promise<boolean> {
    const message = `
🔔 <b>New Partner Added</b>

👤 <b>Name:</b> ${partnerData.name}
📧 <b>Email:</b> ${partnerData.email}
🏢 <b>Company:</b> ${partnerData.company}
${partnerData.phone ? `📞 <b>Phone:</b> ${partnerData.phone}` : ''}

⏰ <i>${new Date().toLocaleString()}</i>
    `.trim();

    return this.sendMessage(message);
  }

  /**
   * Send a formatted notification about a new contact form submission
   */
  async notifyNewContact(contactData: {
    name: string;
    email: string;
    subject: string;
    phone?: string;
  }): Promise<boolean> {
    const message = `
📬 <b>New Contact Form Submission</b>

👤 <b>Name:</b> ${contactData.name}
📧 <b>Email:</b> ${contactData.email}
${contactData.phone ? `📞 <b>Phone:</b> ${contactData.phone}` : ''}
📋 <b>Subject:</b> ${contactData.subject}

⏰ <i>${new Date().toLocaleString()}</i>
    `.trim();

    return this.sendMessage(message);
  }

  /**
   * Send a formatted notification about a new loan application
   */
  async notifyNewLoanApplication(applicationData: {
    email: string;
    loanType: string;
    amount: string;
    phone?: string;
  }): Promise<boolean> {
    const message = `
💰 <b>New Loan Application</b>

📧 <b>Email:</b> ${applicationData.email}
${applicationData.phone ? `📞 <b>Phone:</b> ${applicationData.phone}` : ''}
💵 <b>Loan Type:</b> ${applicationData.loanType}
💲 <b>Amount:</b> ${applicationData.amount}

⏰ <i>${new Date().toLocaleString()}</i>
    `.trim();

    return this.sendMessage(message);
  }
}

