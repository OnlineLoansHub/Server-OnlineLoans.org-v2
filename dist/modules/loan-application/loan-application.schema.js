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
exports.LoanApplicationSchema = exports.LoanApplication = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let LoanApplication = class LoanApplication {
};
exports.LoanApplication = LoanApplication;
__decorate([
    (0, mongoose_1.Prop)({ enum: ['unCompleted', 'completed'], default: 'unCompleted' }),
    __metadata("design:type", String)
], LoanApplication.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 1 }),
    __metadata("design:type", Number)
], LoanApplication.prototype, "step", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Date)
], LoanApplication.prototype, "completedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['personal', 'business'] }),
    __metadata("design:type", String)
], LoanApplication.prototype, "loanType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], LoanApplication.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    }),
    __metadata("design:type", String)
], LoanApplication.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], LoanApplication.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], LoanApplication.prototype, "additionalData", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], LoanApplication.prototype, "formData", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], LoanApplication.prototype, "userIp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], LoanApplication.prototype, "userAgent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], LoanApplication.prototype, "fullUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['mobile', 'desktop', 'tablet'] }),
    __metadata("design:type", String)
], LoanApplication.prototype, "deviceType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            country: String,
            region: String,
            city: String,
            timezone: String,
            lat: Number,
            lon: Number,
        },
        _id: false,
    }),
    __metadata("design:type", Object)
], LoanApplication.prototype, "geo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], LoanApplication.prototype, "sub1", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], LoanApplication.prototype, "sub2", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], LoanApplication.prototype, "sub3", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], LoanApplication.prototype, "sub4", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], LoanApplication.prototype, "sub5", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], LoanApplication.prototype, "sub6", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], LoanApplication.prototype, "sub7", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], LoanApplication.prototype, "sub8", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], LoanApplication.prototype, "sub9", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], LoanApplication.prototype, "sub10", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            browser: String,
            os: String,
            referrer: String,
        },
        _id: false,
    }),
    __metadata("design:type", Object)
], LoanApplication.prototype, "metadata", void 0);
exports.LoanApplication = LoanApplication = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], LoanApplication);
exports.LoanApplicationSchema = mongoose_1.SchemaFactory.createForClass(LoanApplication);
