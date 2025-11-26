import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoanApplicationController } from './loan-application.controller';
import { LoanApplicationService } from './loan-application.service';
import {
  LoanApplication,
  LoanApplicationSchema,
} from './loan-application.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoanApplication.name, schema: LoanApplicationSchema },
    ]),
  ],
  controllers: [LoanApplicationController],
  providers: [LoanApplicationService],
})
export class LoanApplicationModule {}

