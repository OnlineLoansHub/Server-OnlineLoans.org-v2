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
exports.LoanApplicationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const loan_application_service_1 = require("./loan-application.service");
const create_loan_application_dto_1 = require("./dto/create-loan-application.dto");
const start_application_dto_1 = require("./dto/start-application.dto");
const update_application_dto_1 = require("./dto/update-application.dto");
const complete_application_dto_1 = require("./dto/complete-application.dto");
const zod_validation_pipe_1 = require("./pipes/zod-validation.pipe");
const application_schemas_1 = require("./schemas/application.schemas");
let LoanApplicationController = class LoanApplicationController {
    constructor(loanApplicationService) {
        this.loanApplicationService = loanApplicationService;
    }
    /**
     * Legacy endpoint - kept for backward compatibility
     */
    async create(createLoanApplicationDto) {
        const application = await this.loanApplicationService.create(createLoanApplicationDto);
        return {
            message: 'Loan application submitted successfully',
            id: application._id,
        };
    }
    /**
     * Start a new application (Step 1)
     */
    async start(startDto, req) {
        const application = await this.loanApplicationService.startApplication(startDto, req);
        return {
            applicationId: application._id.toString(),
            step: application.step,
            status: application.status,
            message: 'Application started successfully',
        };
    }
    /**
     * Update an existing application (Step 2, 3, 4...)
     */
    async update(id, updateDto, req) {
        const application = await this.loanApplicationService.updateApplication(id, updateDto, req);
        // Determine which fields were updated
        const updatedFields = [];
        if (updateDto.loanType !== undefined)
            updatedFields.push('loanType');
        if (updateDto.amount !== undefined)
            updatedFields.push('amount');
        if (updateDto.email !== undefined)
            updatedFields.push('email');
        if (updateDto.phone !== undefined)
            updatedFields.push('phone');
        if (updateDto.formData !== undefined)
            updatedFields.push('formData');
        if (updateDto.step !== undefined)
            updatedFields.push('step');
        return {
            applicationId: application._id.toString(),
            step: application.step,
            status: application.status,
            updatedFields,
            message: 'Application updated successfully',
        };
    }
    /**
     * Complete an application (Final step)
     */
    async complete(id, completeDto, req) {
        const application = await this.loanApplicationService.completeApplication(id, completeDto, req);
        if (!application) {
            throw new common_1.NotFoundException(`Application with ID ${id} not found`);
        }
        return {
            applicationId: application._id.toString(),
            status: application.status,
            completedAt: application.completedAt,
            message: 'Application completed successfully',
        };
    }
    async findAll() {
        const applications = await this.loanApplicationService.findAll();
        return { applications };
    }
    async findOne(id) {
        const application = await this.loanApplicationService.findOne(id);
        if (!application) {
            throw new common_1.NotFoundException(`Application with ID ${id} not found`);
        }
        return { application };
    }
};
exports.LoanApplicationController = LoanApplicationController;
__decorate([
    (0, common_1.Post)('loan-application'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create loan application (legacy)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_loan_application_dto_1.CreateLoanApplicationDto]),
    __metadata("design:returntype", Promise)
], LoanApplicationController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('applications/start'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(application_schemas_1.applicationPartialSchema)),
    (0, swagger_1.ApiOperation)({ summary: 'Start a new loan application' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Application started successfully',
        schema: {
            type: 'object',
            properties: {
                applicationId: { type: 'string' },
                step: { type: 'number' },
                status: { type: 'string', enum: ['unCompleted'] },
                message: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [start_application_dto_1.StartApplicationDto, Object]),
    __metadata("design:returntype", Promise)
], LoanApplicationController.prototype, "start", null);
__decorate([
    (0, common_1.Patch)('applications/:id/update'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(application_schemas_1.applicationPartialSchema)),
    (0, swagger_1.ApiOperation)({ summary: 'Update application progress' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Application updated successfully',
        schema: {
            type: 'object',
            properties: {
                applicationId: { type: 'string' },
                step: { type: 'number' },
                status: { type: 'string', enum: ['unCompleted', 'completed'] },
                updatedFields: { type: 'array', items: { type: 'string' } },
                message: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_application_dto_1.UpdateApplicationDto, Object]),
    __metadata("design:returntype", Promise)
], LoanApplicationController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('applications/:id/complete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(application_schemas_1.applicationFullSchema)),
    (0, swagger_1.ApiOperation)({ summary: 'Complete loan application' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Application completed successfully',
        schema: {
            type: 'object',
            properties: {
                applicationId: { type: 'string' },
                status: { type: 'string', enum: ['completed'] },
                completedAt: { type: 'string', format: 'date-time' },
                message: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, complete_application_dto_1.CompleteApplicationDto, Object]),
    __metadata("design:returntype", Promise)
], LoanApplicationController.prototype, "complete", null);
__decorate([
    (0, common_1.Get)('loan-application'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all loan applications' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoanApplicationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('loan-application/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific loan application' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoanApplicationController.prototype, "findOne", null);
exports.LoanApplicationController = LoanApplicationController = __decorate([
    (0, swagger_1.ApiTags)('loan-application'),
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [loan_application_service_1.LoanApplicationService])
], LoanApplicationController);
