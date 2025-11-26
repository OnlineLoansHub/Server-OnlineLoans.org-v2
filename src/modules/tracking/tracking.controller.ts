import { Controller, Get, Post, Param, HttpCode, HttpStatus, Req, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { TrackingService } from './tracking.service';

@ApiTags('tracking')
@Controller('api/tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async track(@Req() req: Request) {
    const tracking = await this.trackingService.createTracking(req);
    return {
      id: tracking._id.toString(),
      userIp: tracking.userIp,
      userAgent: tracking.userAgent,
      referrer: tracking.referrer,
      deviceType: tracking.deviceType,
      sub1: tracking.sub1,
      sub2: tracking.sub2,
      sub3: tracking.sub3,
      sub4: tracking.sub4,
      sub5: tracking.sub5,
      sub6: tracking.sub6,
      sub7: tracking.sub7,
      sub8: tracking.sub8,
      sub9: tracking.sub9,
      sub10: tracking.sub10,
      formStatus: tracking.formStatus,
      geo: tracking.geo,
      message: 'Tracking data saved successfully',
    };
  }

  @Get()
  async findAll() {
    const trackings = await this.trackingService.findAll();
    return { trackings };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const tracking = await this.trackingService.findOne(id);
    if (!tracking) {
      throw new NotFoundException(`Tracking record with ID ${id} not found`);
    }
    return { tracking };
  }
}

