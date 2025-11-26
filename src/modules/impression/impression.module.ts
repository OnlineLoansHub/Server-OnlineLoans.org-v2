import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImpressionController } from './impression.controller';
import { ImpressionService } from './impression.service';
import { Impression, ImpressionSchema } from './impression.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Impression.name, schema: ImpressionSchema },
    ]),
  ],
  controllers: [ImpressionController],
  providers: [ImpressionService],
})
export class ImpressionModule {}

