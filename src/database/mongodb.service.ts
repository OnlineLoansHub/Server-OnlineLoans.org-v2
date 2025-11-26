import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MongoDbService implements OnModuleInit, OnModuleDestroy {
  constructor(@InjectConnection() private connection: Connection) {}

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
}
