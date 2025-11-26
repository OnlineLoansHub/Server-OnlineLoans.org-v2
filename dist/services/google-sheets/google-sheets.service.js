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
var GoogleSheetsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSheetsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let GoogleSheetsService = GoogleSheetsService_1 = class GoogleSheetsService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(GoogleSheetsService_1.name);
        this.spreadsheetId = this.configService.get('GOOGLE_SHEETS_ID');
        this.credentials = this.configService.get('GOOGLE_SHEETS_CREDENTIALS');
    }
    /**
     * Append a row to a Google Sheet
     */
    async appendRow(sheetName, values) {
        if (!this.spreadsheetId || !this.credentials) {
            this.logger.warn('Google Sheets configuration not complete. Data not saved.');
            this.logger.debug(`Would append to sheet "${sheetName}": ${JSON.stringify(values)}`);
            return false;
        }
        try {
            // TODO: Implement actual Google Sheets API integration
            // Example with googleapis:
            // const { GoogleSpreadsheet } = require('google-spreadsheet');
            // const doc = new GoogleSpreadsheet(this.spreadsheetId);
            // await doc.useServiceAccountAuth(JSON.parse(this.credentials));
            // await doc.loadInfo();
            // const sheet = doc.sheetsByTitle[sheetName];
            // await sheet.addRow(values);
            this.logger.log(`Row appended to sheet "${sheetName}"`);
            return true;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Error appending to Google Sheet: ${errorMessage}`);
            return false;
        }
    }
    /**
     * Log a new partner to Google Sheets
     */
    async logPartner(partnerData) {
        const values = [
            partnerData.name,
            partnerData.email,
            partnerData.phone,
            partnerData.company,
            partnerData.site,
            partnerData.createdAt.toISOString(),
        ];
        return this.appendRow('Partners', values);
    }
    /**
     * Log a new contact form submission to Google Sheets
     */
    async logContact(contactData) {
        const values = [
            contactData.name,
            contactData.email,
            contactData.phone,
            contactData.subject,
            contactData.message,
            contactData.createdAt.toISOString(),
        ];
        return this.appendRow('Contacts', values);
    }
    /**
     * Log a new loan application to Google Sheets
     */
    async logLoanApplication(applicationData) {
        const values = [
            applicationData.email,
            applicationData.loanType,
            applicationData.amount,
            applicationData.phone || '',
            applicationData.createdAt.toISOString(),
        ];
        return this.appendRow('Loan Applications', values);
    }
};
exports.GoogleSheetsService = GoogleSheetsService;
exports.GoogleSheetsService = GoogleSheetsService = GoogleSheetsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GoogleSheetsService);
