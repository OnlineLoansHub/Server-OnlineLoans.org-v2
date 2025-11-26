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
exports.MongoDbService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let MongoDbService = class MongoDbService {
    constructor(connection) {
        this.connection = connection;
    }
    onModuleInit() {
        if (this.connection.readyState === 1) {
            console.log('✅ MongoDB connected successfully');
        }
        this.connection.on('connected', () => {
            console.log('✅ MongoDB connected successfully');
        });
        this.connection.on('connecting', () => {
            console.log('🔄 MongoDB connecting...');
        });
        this.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err.message);
            if (err.message.includes('ECONNREFUSED')) {
                console.error('💡 MongoDB is not running. Please:');
                console.error('   1. Start MongoDB: brew services start mongodb-community');
                console.error('   2. Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas');
                console.error('   3. Or set MONGO_URI in your .env file to a valid MongoDB connection string');
            }
        });
        this.connection.on('disconnected', () => {
            console.log('⚠️  MongoDB disconnected');
        });
    }
    onModuleDestroy() {
        if (this.connection.readyState === 1) {
            this.connection.close();
        }
    }
};
exports.MongoDbService = MongoDbService;
exports.MongoDbService = MongoDbService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Connection])
], MongoDbService);
