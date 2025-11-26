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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanApplicationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const loan_application_schema_1 = require("./loan-application.schema");
const tracking_utils_1 = require("./utils/tracking.utils");
let LoanApplicationService = class LoanApplicationService {
    constructor(loanApplicationModel) {
        this.loanApplicationModel = loanApplicationModel;
    }
    /**
     * Create a new application (backward compatibility)
     */
    async create(createLoanApplicationDto) {
        const createdApplication = new this.loanApplicationModel(createLoanApplicationDto);
        return createdApplication.save();
    }
    /**
     * Start a new application (Step 1)
     * Creates document with tracking data and initial form data
     */
    async startApplication(startDto, req) {
        const userIp = (0, tracking_utils_1.extractIp)(req);
        const userAgent = req.headers['user-agent'] || '';
        const fullUrl = (0, tracking_utils_1.extractFullUrl)(req);
        const deviceType = (0, tracking_utils_1.detectDeviceType)(userAgent);
        const geo = (0, tracking_utils_1.geoLookup)(userIp);
        const subs = (0, tracking_utils_1.parseSubs)(fullUrl);
        const userAgentData = (0, tracking_utils_1.parseUserAgent)(userAgent);
        // Merge form data
        const formData = {
            ...(startDto.loanType && { loanType: startDto.loanType }),
            ...(startDto.amount && { amount: startDto.amount }),
            ...(startDto.email && { email: startDto.email }),
            ...(startDto.phone && { phone: startDto.phone }),
            ...(startDto.formData || {}),
        };
        const applicationData = {
            status: 'unCompleted',
            step: 1,
            // Store in both original fields and formData for backward compatibility
            loanType: startDto.loanType,
            amount: startDto.amount,
            email: startDto.email,
            phone: startDto.phone,
            formData,
            // Tracking data
            userIp,
            userAgent,
            fullUrl,
            deviceType,
            geo,
            ...subs,
            metadata: {
                browser: userAgentData.browser,
                os: userAgentData.os,
                referrer: req.headers.referer || undefined,
            },
        };
        const createdApplication = new this.loanApplicationModel(applicationData);
        return createdApplication.save();
    }
    /**
     * Update an existing application (Step 2, 3, 4...)
     * Partial update, never overwrites with undefined
     */
    async updateApplication(id, updateDto, req) {
        const application = await this.loanApplicationModel.findById(id).exec();
        if (!application) {
            throw new common_1.NotFoundException(`Application with ID ${id} not found`);
        }
        // Prepare update object - never set undefined values
        const updateData = {};
        // Update step if provided, otherwise increment
        if (updateDto.step !== undefined) {
            updateData.step = updateDto.step;
        }
        else if (application.step !== undefined) {
            updateData.step = application.step + 1;
        }
        else {
            updateData.step = 2;
        }
        // Update original fields if provided
        if (updateDto.loanType !== undefined) {
            updateData.loanType = updateDto.loanType;
        }
        if (updateDto.amount !== undefined) {
            updateData.amount = updateDto.amount;
        }
        if (updateDto.email !== undefined) {
            updateData.email = updateDto.email;
        }
        if (updateDto.phone !== undefined) {
            updateData.phone = updateDto.phone;
        }
        // Merge formData - deep merge to preserve existing fields
        if (updateDto.formData !== undefined) {
            const existingFormData = application.formData || {};
            updateData.formData = {
                ...existingFormData,
                ...updateDto.formData,
                // Also update top-level fields in formData
                ...(updateDto.loanType && { loanType: updateDto.loanType }),
                ...(updateDto.amount && { amount: updateDto.amount }),
                ...(updateDto.email && { email: updateDto.email }),
                ...(updateDto.phone && { phone: updateDto.phone }),
            };
        }
        else {
            // Still update formData with top-level fields if provided
            const existingFormData = application.formData || {};
            updateData.formData = {
                ...existingFormData,
                ...(updateDto.loanType && { loanType: updateDto.loanType }),
                ...(updateDto.amount && { amount: updateDto.amount }),
                ...(updateDto.email && { email: updateDto.email }),
                ...(updateDto.phone && { phone: updateDto.phone }),
            };
        }
        // Update the document
        Object.assign(application, updateData);
        return application.save();
    }
    /**
     * Complete an application (Final step)
     * Full validation, set status to completed
     */
    async completeApplication(id, completeDto, req) {
        const application = await this.loanApplicationModel.findById(id).exec();
        if (!application) {
            throw new common_1.NotFoundException(`Application with ID ${id} not found`);
        }
        // Prepare final update
        const finalFormData = {
            ...(application.formData || {}),
            loanType: completeDto.loanType,
            amount: completeDto.amount,
            email: completeDto.email,
            ...(completeDto.phone && { phone: completeDto.phone }),
            ...(completeDto.formData || {}),
        };
        // Update with final data
        application.status = 'completed';
        application.completedAt = new Date();
        application.step = (application.step || 1) + 1;
        application.loanType = completeDto.loanType;
        application.amount = completeDto.amount;
        application.email = completeDto.email;
        if (completeDto.phone !== undefined) {
            application.phone = completeDto.phone;
        }
        application.formData = finalFormData;
        return application.save();
    }
    async findAll() {
        return this.loanApplicationModel
            .find()
            .sort({ createdAt: -1 })
            .limit(100)
            .exec();
    }
    async findOne(id) {
        return this.loanApplicationModel.findById(id).exec();
    }
};
exports.LoanApplicationService = LoanApplicationService;
exports.LoanApplicationService = LoanApplicationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(loan_application_schema_1.LoanApplication.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LoanApplicationService);
