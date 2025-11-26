"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongooseConfig = void 0;
const mongooseConfig = (configService) => ({
    uri: configService.get('MONGO_URI') || process.env.MONGO_URI || 'mongodb://localhost:27017/onlineloans',
});
exports.mongooseConfig = mongooseConfig;
