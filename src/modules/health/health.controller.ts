import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private connection: Connection) {}

  @Get()
  async check() {
    const readyState = this.connection.readyState;
    let mongoStatus = 'unknown';
    
    switch (readyState) {
      case 0:
        mongoStatus = 'disconnected';
        break;
      case 1:
        mongoStatus = 'connected';
        break;
      case 2:
        mongoStatus = 'connecting';
        break;
      case 3:
        mongoStatus = 'disconnecting';
        break;
      default:
        mongoStatus = 'unknown';
    }
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        mongodb: mongoStatus,
      },
    };
  }

  @Get('ping')
  ping() {
    return {
      status: 'ok',
      message: 'pong',
    };
  }
}

