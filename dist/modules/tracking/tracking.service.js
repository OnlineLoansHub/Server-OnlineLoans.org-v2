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
exports.TrackingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tracking_schema_1 = require("./tracking.schema");
const tracking_utils_1 = require("./utils/tracking.utils");
let TrackingService = class TrackingService {
    constructor(trackingModel) {
        this.trackingModel = trackingModel;
    }
    async createTracking(req) {
        const userIp = (0, tracking_utils_1.extractIp)(req) || '';
        const userAgent = req.headers['user-agent'] || '';
        const referrer = (0, tracking_utils_1.extractReferrer)(req) || '';
        const deviceType = (0, tracking_utils_1.detectDeviceType)(userAgent);
        const geo = (0, tracking_utils_1.geoLookup)(userIp);
        const subs = (0, tracking_utils_1.parseSubsFromReferrer)(referrer);
        // Ensure all fields are always present, even if empty
        const trackingData = {
            userIp: userIp || '',
            userAgent: userAgent || '',
            referrer: referrer || '',
            deviceType,
            sub1: subs.sub1 || '',
            sub2: subs.sub2 || '',
            sub3: subs.sub3 || '',
            sub4: subs.sub4 || '',
            sub5: subs.sub5 || '',
            sub6: subs.sub6 || '',
            sub7: subs.sub7 || '',
            sub8: subs.sub8 || '',
            sub9: subs.sub9 || '',
            sub10: subs.sub10 || '',
            form: 'unCompleted',
            geo: {
                country: geo?.country || '',
                region: geo?.region || '',
                city: geo?.city || '',
                timezone: geo?.timezone || '',
                lat: geo?.lat || null,
                lon: geo?.lon || null,
            },
        };
        const tracking = new this.trackingModel(trackingData);
        return tracking.save();
    }
    async findAll() {
        return this.trackingModel.find().sort({ createdAt: -1 }).limit(100).exec();
    }
    async findOne(id) {
        return this.trackingModel.findById(id).exec();
    }
};
exports.TrackingService = TrackingService;
exports.TrackingService = TrackingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tracking_schema_1.Tracking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TrackingService);
