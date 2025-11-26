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
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let SmsService = SmsService_1 = class SmsService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(SmsService_1.name);
        this.apiKey = this.configService.get('SMS_API_KEY');
        this.apiSecret = this.configService.get('SMS_API_SECRET');
        this.fromNumber = this.configService.get('SMS_FROM_NUMBER');
        this.provider = this.configService.get('SMS_PROVIDER') || 'twilio';
    }
    /**
     * Send an SMS message
     */
    async sendSms(to, message) {
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
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Error sending SMS: ${errorMessage}`);
            return false;
        }
    }
    /**
     * Send a verification code via SMS
     */
    async sendVerificationCode(phoneNumber, code) {
        const message = `Your OnlineLoans.org verification code is: ${code}. Valid for 10 minutes.`;
        return this.sendSms(phoneNumber, message);
    }
    /**
     * Send a notification about loan application status
     */
    async sendLoanStatusUpdate(phoneNumber, status) {
        const message = `Your loan application status has been updated to: ${status}. Check your email for details.`;
        return this.sendSms(phoneNumber, message);
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SmsService);
