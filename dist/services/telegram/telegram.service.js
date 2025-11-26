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
var TelegramService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let TelegramService = TelegramService_1 = class TelegramService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(TelegramService_1.name);
        this.botToken = this.configService.get('TELEGRAM_BOT_TOKEN') || '';
        this.chatId = this.configService.get('TELEGRAM_CHAT_ID') || '';
        this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
    }
    /**
     * Send a message to the configured Telegram chat
     */
    async sendMessage(message) {
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
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Error sending Telegram message: ${errorMessage}`);
            return false;
        }
    }
    /**
     * Send a formatted notification about a new partner
     */
    async notifyNewPartner(partnerData) {
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
    async notifyNewContact(contactData) {
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
    async notifyNewLoanApplication(applicationData) {
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
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = TelegramService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TelegramService);
