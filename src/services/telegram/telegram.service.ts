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

  /**
   * Send a message using custom bot token and chat ID
   */
  async sendMessageWithCredentials(
    botToken: string,
    chatId: string,
    message: string,
  ): Promise<boolean> {
    if (!botToken || !chatId) {
      this.logger.warn('Bot token or chat ID not provided. Message not sent.');
      return false;
    }

    try {
      const apiUrl = `https://api.telegram.org/bot${botToken}`;
      const response = await fetch(`${apiUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
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
   * Send a formatted notification about a new impression
   */
  async notifyNewImpression(
    botToken: string,
    chatId: string,
    impressionData: any,
  ): Promise<boolean> {
    const formatValue = (value: any): string => {
      if (value === null || value === undefined) return 'N/A';
      if (typeof value === 'object') return JSON.stringify(value);
      if (typeof value === 'string' && value.length > 100) return value.substring(0, 100) + '...';
      return String(value);
    };

    const formatReferrer = (referrer: any): string => {
      if (referrer === null || referrer === undefined) return 'N/A';
      let referrerStr = String(referrer);
      
      // Remove https://www. or https:// from the beginning
      referrerStr = referrerStr.replace(/^https:\/\/www\./i, '');
      referrerStr = referrerStr.replace(/^https:\/\//i, '');
      
      if (referrerStr.length > 100) return referrerStr.substring(0, 100) + '...';
      return referrerStr;
    };

    const message = `
👁️ <b>New Impression</b>

🆔 <b>ID:</b> <code>${impressionData._id || impressionData.id}</code>
🌐 <b>IP:</b> ${formatValue(impressionData.userIp)}
📱 <b>Device Type:</b> ${formatValue(impressionData.deviceType)}
🖥️ <b>User Agent:</b> ${formatValue(impressionData.userAgent)}
🔗 <b>Referrer:</b> ${formatReferrer(impressionData.referrer)}

📊 <b>Sub Parameters:</b>
${impressionData.sub1 ? `  • Sub1: ${formatValue(impressionData.sub1)}` : ''}
${impressionData.sub2 ? `  • Sub2: ${formatValue(impressionData.sub2)}` : ''}
${impressionData.sub3 ? `  • Sub3: ${formatValue(impressionData.sub3)}` : ''}
${impressionData.sub4 ? `  • Sub4: ${formatValue(impressionData.sub4)}` : ''}
${impressionData.sub5 ? `  • Sub5: ${formatValue(impressionData.sub5)}` : ''}
${impressionData.sub6 ? `  • Sub6: ${formatValue(impressionData.sub6)}` : ''}
${impressionData.sub7 ? `  • Sub7: ${formatValue(impressionData.sub7)}` : ''}
${impressionData.sub8 ? `  • Sub8: ${formatValue(impressionData.sub8)}` : ''}
${impressionData.sub9 ? `  • Sub9: ${formatValue(impressionData.sub9)}` : ''}
${impressionData.sub10 ? `  • Sub10: ${formatValue(impressionData.sub10)}` : ''}

🌍 <b>Geo Location:</b>
${impressionData.geo?.country ? `  • Country: ${formatValue(impressionData.geo.country)}` : ''}
${impressionData.geo?.region ? `  • Region: ${formatValue(impressionData.geo.region)}` : ''}
${impressionData.geo?.city ? `  • City: ${formatValue(impressionData.geo.city)}` : ''}
${impressionData.geo?.timezone ? `  • Timezone: ${formatValue(impressionData.geo.timezone)}` : ''}
${impressionData.geo?.lat ? `  • Latitude: ${formatValue(impressionData.geo.lat)}` : ''}
${impressionData.geo?.lon ? `  • Longitude: ${formatValue(impressionData.geo.lon)}` : ''}

⏰ <b>Created:</b> ${impressionData.createdAt ? new Date(impressionData.createdAt).toLocaleString() : new Date().toLocaleString()}
    `.trim();

    return this.sendMessageWithCredentials(botToken, chatId, message);
  }
}

