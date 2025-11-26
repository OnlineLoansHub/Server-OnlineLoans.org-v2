import { MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export const mongooseConfig = (configService: ConfigService): MongooseModuleOptions => ({
  uri: configService.get<string>('MONGO_URI') || process.env.MONGO_URI,
});
