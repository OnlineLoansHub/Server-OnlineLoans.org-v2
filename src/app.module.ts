import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MongoDbModule } from './database/mongodb.module';
import { ContactModule } from './modules/contact/contact.module';
import { PartnerModule } from './modules/partner/partner.module';
import { LoanApplicationModule } from './modules/loan-application/loan-application.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 20,
        },
      ],
    }),
    MongoDbModule,
    ContactModule,
    PartnerModule,
    LoanApplicationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
