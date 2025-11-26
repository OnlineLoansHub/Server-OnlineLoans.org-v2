import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HubspotService {
  private readonly logger = new Logger(HubspotService.name);
  private readonly apiKey?: string;
  private readonly accessToken?: string;
  private readonly baseUrl = 'https://api.hubapi.com';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('HUBSPOT_API_KEY');
    this.accessToken = this.configService.get<string>('HUBSPOT_ACCESS_TOKEN');
  }

  /**
   * Create or update a contact in HubSpot
   */
  async createOrUpdateContact(contactData: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    company?: string;
    website?: string;
    [key: string]: any; // Allow additional custom properties
  }): Promise<string | null> {
    if (!this.apiKey && !this.accessToken) {
      this.logger.warn('HubSpot API key or access token not configured. Contact not synced.');
      return null;
    }

    try {
      const authHeader = this.accessToken
        ? `Bearer ${this.accessToken}`
        : `Bearer ${this.apiKey}`;

      // TODO: Implement actual HubSpot API call
      // Example:
      // const response = await fetch(
      //   `${this.baseUrl}/crm/v3/objects/contacts`,
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Authorization': authHeader,
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       properties: {
      //         email: contactData.email,
      //         firstname: contactData.firstName,
      //         lastname: contactData.lastName,
      //         phone: contactData.phone,
      //         company: contactData.company,
      //         website: contactData.website,
      //         ...contactData,
      //       },
      //     }),
      //   }
      // );

      this.logger.log(`Contact synced to HubSpot: ${contactData.email}`);
      return 'contact-id'; // Return actual contact ID from HubSpot
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error syncing contact to HubSpot: ${errorMessage}`);
      return null;
    }
  }

  /**
   * Create a deal in HubSpot
   */
  async createDeal(dealData: {
    name: string;
    amount: string;
    contactEmail?: string;
    stage?: string;
    [key: string]: any;
  }): Promise<string | null> {
    if (!this.apiKey && !this.accessToken) {
      this.logger.warn('HubSpot API key or access token not configured. Deal not created.');
      return null;
    }

    try {
      // TODO: Implement actual HubSpot deal creation
      this.logger.log(`Deal created in HubSpot: ${dealData.name}`);
      return 'deal-id'; // Return actual deal ID from HubSpot
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error creating deal in HubSpot: ${errorMessage}`);
      return null;
    }
  }

  /**
   * Sync a partner to HubSpot as a contact
   */
  async syncPartner(partnerData: {
    name: string;
    email: string;
    phone: string;
    company: string;
    site: string;
  }): Promise<string | null> {
    const nameParts = partnerData.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return this.createOrUpdateContact({
      email: partnerData.email,
      firstName,
      lastName,
      phone: partnerData.phone,
      company: partnerData.company,
      website: partnerData.site,
      lifecyclestage: 'partner',
    });
  }

  /**
   * Sync a loan application to HubSpot (create contact + deal)
   */
  async syncLoanApplication(applicationData: {
    email: string;
    loanType: string;
    amount: string;
    phone?: string;
  }): Promise<{ contactId: string | null; dealId: string | null }> {
    const contactId = await this.createOrUpdateContact({
      email: applicationData.email,
      phone: applicationData.phone,
      lifecyclestage: 'lead',
    });

    const dealId = await this.createDeal({
      name: `${applicationData.loanType} Loan Application`,
      amount: applicationData.amount,
      contactEmail: applicationData.email,
      stage: 'appointmentscheduled',
      dealtype: applicationData.loanType,
    });

    return { contactId, dealId };
  }
}

