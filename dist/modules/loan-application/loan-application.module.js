"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanApplicationModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const loan_application_controller_1 = require("./loan-application.controller");
const loan_application_service_1 = require("./loan-application.service");
const loan_application_schema_1 = require("./loan-application.schema");
let LoanApplicationModule = class LoanApplicationModule {
};
exports.LoanApplicationModule = LoanApplicationModule;
exports.LoanApplicationModule = LoanApplicationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: loan_application_schema_1.LoanApplication.name, schema: loan_application_schema_1.LoanApplicationSchema },
            ]),
        ],
        controllers: [loan_application_controller_1.LoanApplicationController],
        providers: [loan_application_service_1.LoanApplicationService],
    })
], LoanApplicationModule);
