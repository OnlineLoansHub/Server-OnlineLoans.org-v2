import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from './modules/contact/contact.module';
import { PartnerModule } from './modules/partner/partner.module';
import { LoanApplicationModule } from './modules/loan-application/loan-application.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/onlineloans',
    ),
    ContactModule,
    PartnerModule,
    LoanApplicationModule,
  ],
})
export class AppModule {}
