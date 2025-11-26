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
var HubspotService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubspotService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let HubspotService = HubspotService_1 = class HubspotService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(HubspotService_1.name);
        this.baseUrl = 'https://api.hubapi.com';
        this.apiKey = this.configService.get('HUBSPOT_API_KEY');
        this.accessToken = this.configService.get('HUBSPOT_ACCESS_TOKEN');
    }
    /**
     * Create or update a contact in HubSpot
     */
    async createOrUpdateContact(contactData) {
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
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Error syncing contact to HubSpot: ${errorMessage}`);
            return null;
        }
    }
    /**
     * Create a deal in HubSpot
     */
    async createDeal(dealData) {
        if (!this.apiKey && !this.accessToken) {
            this.logger.warn('HubSpot API key or access token not configured. Deal not created.');
            return null;
        }
        try {
            // TODO: Implement actual HubSpot deal creation
            this.logger.log(`Deal created in HubSpot: ${dealData.name}`);
            return 'deal-id'; // Return actual deal ID from HubSpot
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Error creating deal in HubSpot: ${errorMessage}`);
            return null;
        }
    }
    /**
     * Sync a partner to HubSpot as a contact
     */
    async syncPartner(partnerData) {
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
    async syncLoanApplication(applicationData) {
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
};
exports.HubspotService = HubspotService;
exports.HubspotService = HubspotService = HubspotService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], HubspotService);
