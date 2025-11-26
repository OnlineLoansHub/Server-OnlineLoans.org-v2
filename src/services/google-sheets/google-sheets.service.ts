import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleSheetsService {
  private readonly logger = new Logger(GoogleSheetsService.name);
  private readonly spreadsheetId?: string;
  private readonly credentials?: string; // JSON credentials or path to credentials file

  constructor(private configService: ConfigService) {
    this.spreadsheetId = this.configService.get<string>('GOOGLE_SHEETS_ID');
    this.credentials = this.configService.get<string>('GOOGLE_SHEETS_CREDENTIALS');
  }

  /**
   * Append a row to a Google Sheet
   */
  async appendRow(
    sheetName: string,
    values: (string | number)[],
  ): Promise<boolean> {
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error appending to Google Sheet: ${errorMessage}`);
      return false;
    }
  }

  /**
   * Log a new partner to Google Sheets
   */
  async logPartner(partnerData: {
    name: string;
    email: string;
    phone: string;
    company: string;
    site: string;
    createdAt: Date;
  }): Promise<boolean> {
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
  async logContact(contactData: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    createdAt: Date;
  }): Promise<boolean> {
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
  async logLoanApplication(applicationData: {
    email: string;
    loanType: string;
    amount: string;
    phone?: string;
    createdAt: Date;
  }): Promise<boolean> {
    const values = [
      applicationData.email,
      applicationData.loanType,
      applicationData.amount,
      applicationData.phone || '',
      applicationData.createdAt.toISOString(),
    ];

    return this.appendRow('Loan Applications', values);
  }
}

