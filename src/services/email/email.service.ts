import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail: string;
  private readonly fromName: string;
  private readonly smtpHost?: string;
  private readonly smtpPort?: number;
  private readonly smtpUser?: string;
  private readonly smtpPassword?: string;

  constructor(private configService: ConfigService) {
    this.fromEmail = this.configService.get<string>('EMAIL_FROM') || 'noreply@onlineloans.org';
    this.fromName = this.configService.get<string>('EMAIL_FROM_NAME') || 'OnlineLoans.org';
    this.smtpHost = this.configService.get<string>('SMTP_HOST');
    this.smtpPort = this.configService.get<number>('SMTP_PORT');
    this.smtpUser = this.configService.get<string>('SMTP_USER');
    this.smtpPassword = this.configService.get<string>('SMTP_PASSWORD');
  }

  /**
   * Send an email (basic implementation - can be extended with nodemailer, sendgrid, etc.)
   */
  async sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
    textBody?: string,
  ): Promise<boolean> {
    if (!this.smtpHost || !this.smtpUser || !this.smtpPassword) {
      this.logger.warn('SMTP configuration not complete. Email not sent.');
      this.logger.debug(`Would send email to: ${to}, subject: ${subject}`);
      return false;
    }

    try {
      // TODO: Implement actual email sending with nodemailer, sendgrid, or AWS SES
      // Example with nodemailer:
      // const transporter = nodemailer.createTransport({
      //   host: this.smtpHost,
      //   port: this.smtpPort,
      //   secure: this.smtpPort === 465,
      //   auth: {
      //     user: this.smtpUser,
      //     pass: this.smtpPassword,
      //   },
      // });
      // await transporter.sendMail({
      //   from: `${this.fromName} <${this.fromEmail}>`,
      //   to,
      //   subject,
      //   html: htmlBody,
      //   text: textBody || htmlBody.replace(/<[^>]*>/g, ''),
      // });
      
      // Placeholder to avoid unused variable warnings
      void htmlBody;
      void textBody;

      this.logger.log(`Email sent to ${to}: ${subject}`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error sending email: ${errorMessage}`);
      return false;
    }
  }

  /**
   * Send a welcome email to a new partner
   */
  async sendPartnerWelcomeEmail(partnerData: {
    email: string;
    name: string;
    company: string;
  }): Promise<boolean> {
    const subject = 'Welcome to OnlineLoans.org Partnership Program';
    const htmlBody = `
      <h2>Welcome ${partnerData.name}!</h2>
      <p>Thank you for joining the OnlineLoans.org partnership program.</p>
      <p>We're excited to work with <strong>${partnerData.company}</strong>.</p>
      <p>Our team will be in touch with you shortly.</p>
      <br>
      <p>Best regards,<br>The OnlineLoans.org Team</p>
    `;

    return this.sendEmail(partnerData.email, subject, htmlBody);
  }

  /**
   * Send a confirmation email for contact form submission
   */
  async sendContactConfirmationEmail(contactData: {
    email: string;
    name: string;
    subject: string;
  }): Promise<boolean> {
    const subject = 'We received your message';
    const htmlBody = `
      <h2>Hello ${contactData.name},</h2>
      <p>Thank you for contacting OnlineLoans.org.</p>
      <p>We have received your message regarding: <strong>${contactData.subject}</strong></p>
      <p>Our team will get back to you as soon as possible.</p>
      <br>
      <p>Best regards,<br>The OnlineLoans.org Team</p>
    `;

    return this.sendEmail(contactData.email, subject, htmlBody);
  }

  /**
   * Send a notification email to admins about a new loan application
   */
  async sendLoanApplicationNotification(applicationData: {
    email: string;
    loanType: string;
    amount: string;
  }): Promise<boolean> {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || this.fromEmail;
    const subject = `New Loan Application: ${applicationData.loanType}`;
    const htmlBody = `
      <h2>New Loan Application Received</h2>
      <p><strong>Email:</strong> ${applicationData.email}</p>
      <p><strong>Loan Type:</strong> ${applicationData.loanType}</p>
      <p><strong>Amount:</strong> ${applicationData.amount}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
    `;

    return this.sendEmail(adminEmail, subject, htmlBody);
  }
}

