import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { mongooseConfig } from './mongoose.config';
import { MongoDbService } from './mongodb.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => mongooseConfig(configService),
    }),
  ],
  providers: [MongoDbService],
})
export class MongoDbModule {}
