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
exports.TrackingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tracking_service_1 = require("./tracking.service");
let TrackingController = class TrackingController {
    constructor(trackingService) {
        this.trackingService = trackingService;
    }
    async track(req) {
        const tracking = await this.trackingService.createTracking(req);
        return {
            id: tracking._id.toString(),
            userIp: tracking.userIp,
            userAgent: tracking.userAgent,
            referrer: tracking.referrer,
            deviceType: tracking.deviceType,
            sub1: tracking.sub1,
            sub2: tracking.sub2,
            sub3: tracking.sub3,
            sub4: tracking.sub4,
            sub5: tracking.sub5,
            sub6: tracking.sub6,
            sub7: tracking.sub7,
            sub8: tracking.sub8,
            sub9: tracking.sub9,
            sub10: tracking.sub10,
            form: tracking.form,
            geo: tracking.geo,
            message: 'Tracking data saved successfully',
        };
    }
    async findAll() {
        const trackings = await this.trackingService.findAll();
        return { trackings };
    }
    async findOne(id) {
        const tracking = await this.trackingService.findOne(id);
        if (!tracking) {
            throw new common_1.NotFoundException(`Tracking record with ID ${id} not found`);
        }
        return { tracking };
    }
};
exports.TrackingController = TrackingController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Track visitor data',
        description: 'Captures visitor tracking data including IP, user agent, full URL, and geo location. No request body required.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Tracking data saved successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                userIp: { type: 'string', example: '192.168.1.1' },
                userAgent: { type: 'string', example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
                referrer: { type: 'string', example: 'https://onlineloans.org?sub1=abc&sub2=123' },
                deviceType: { type: 'string', enum: ['mobile', 'desktop', 'tablet'], example: 'desktop' },
                sub1: { type: 'string', example: 'abc' },
                sub2: { type: 'string', example: '123' },
                sub3: { type: 'string', example: '' },
                sub4: { type: 'string', example: '' },
                sub5: { type: 'string', example: '' },
                sub6: { type: 'string', example: '' },
                sub7: { type: 'string', example: '' },
                sub8: { type: 'string', example: '' },
                sub9: { type: 'string', example: '' },
                sub10: { type: 'string', example: '' },
                form: { type: 'string', example: 'unCompleted' },
                geo: {
                    type: 'object',
                    properties: {
                        country: { type: 'string', example: 'US' },
                        region: { type: 'string', example: 'CA' },
                        city: { type: 'string', example: 'San Francisco' },
                        timezone: { type: 'string', example: 'America/Los_Angeles' },
                        lat: { type: 'number', example: 37.7749 },
                        lon: { type: 'number', example: -122.4194 },
                    },
                },
                message: { type: 'string', example: 'Tracking data saved successfully' },
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "track", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all tracking records',
        description: 'Retrieves all tracking records, sorted by creation date (newest first). Limited to 100 records.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of tracking records',
        schema: {
            type: 'object',
            properties: {
                trackings: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            _id: { type: 'string' },
                            userIp: { type: 'string' },
                            userAgent: { type: 'string' },
                            fullUrl: { type: 'string' },
                            form: { type: 'string' },
                            geo: { type: 'object' },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' },
                        },
                    },
                },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a specific tracking record',
        description: 'Retrieves a single tracking record by its ID.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tracking record found',
        schema: {
            type: 'object',
            properties: {
                tracking: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        userIp: { type: 'string' },
                        userAgent: { type: 'string' },
                        fullUrl: { type: 'string' },
                        form: { type: 'string' },
                        geo: { type: 'object' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Tracking record not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "findOne", null);
exports.TrackingController = TrackingController = __decorate([
    (0, swagger_1.ApiTags)('tracking'),
    (0, common_1.Controller)('api/tracking'),
    __metadata("design:paramtypes", [tracking_service_1.TrackingService])
], TrackingController);
