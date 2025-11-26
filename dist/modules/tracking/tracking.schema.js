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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingSchema = exports.Tracking = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Tracking = class Tracking {
};
exports.Tracking = Tracking;
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Tracking.prototype, "userIp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Tracking.prototype, "userAgent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Tracking.prototype, "referrer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['mobile', 'desktop', 'tablet'], default: 'desktop' }),
    __metadata("design:type", String)
], Tracking.prototype, "deviceType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Tracking.prototype, "sub1", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Tracking.prototype, "sub2", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Tracking.prototype, "sub3", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Tracking.prototype, "sub4", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Tracking.prototype, "sub5", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Tracking.prototype, "sub6", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Tracking.prototype, "sub7", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Tracking.prototype, "sub8", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Tracking.prototype, "sub9", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Tracking.prototype, "sub10", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: 'unCompleted' }),
    __metadata("design:type", String)
], Tracking.prototype, "form", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            country: { type: String, default: '' },
            region: { type: String, default: '' },
            city: { type: String, default: '' },
            timezone: { type: String, default: '' },
            lat: { type: Number, default: null },
            lon: { type: Number, default: null },
        },
        _id: false,
        default: {},
    }),
    __metadata("design:type", Object)
], Tracking.prototype, "geo", void 0);
exports.Tracking = Tracking = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Tracking);
exports.TrackingSchema = mongoose_1.SchemaFactory.createForClass(Tracking);
