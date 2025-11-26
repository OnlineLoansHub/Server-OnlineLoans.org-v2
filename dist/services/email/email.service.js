"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let EmailService = EmailService_1 = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(EmailService_1.name);
        this.fromEmail = this.configService.get('EMAIL_FROM') || 'noreply@onlineloans.org';
        this.fromName = this.configService.get('EMAIL_FROM_NAME') || 'OnlineLoans.org';
        this.smtpHost = this.configService.get('SMTP_HOST');
        this.smtpPort = this.configService.get('SMTP_PORT');
        this.smtpUser = this.configService.get('SMTP_USER');
        this.smtpPassword = this.configService.get('SMTP_PASSWORD');
    }
    /**
     * Send an email (basic implementation - can be extended with nodemailer, sendgrid, etc.)
     */
    async sendEmail(to, subject, htmlBody, textBody) {
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
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Error sending email: ${errorMessage}`);
            return false;
        }
    }
    /**
     * Send a welcome email to a new partner
     */
    async sendPartnerWelcomeEmail(partnerData) {
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
    async sendContactConfirmationEmail(contactData) {
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
    async sendLoanApplicationNotification(applicationData) {
        const adminEmail = this.configService.get('ADMIN_EMAIL') || this.fromEmail;
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
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
