import { Controller, Get, Post, Param, HttpCode, HttpStatus, Req, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TrackingService } from './tracking.service';

@ApiTags('tracking')
@Controller('api/tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Track visitor data',
    description: 'Captures visitor tracking data including IP, user agent, full URL, and geo location. No request body required.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tracking data saved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        userIp: { type: 'string', example: '192.168.1.1' },
        userAgent: { type: 'string', example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        referrer: { type: 'string', example: 'https://onlineloans.org?sub1=abc&sub2=123' },
        deviceType: { type: 'string', enum: ['mobile', 'desktop', 'tablet'], example: 'desktop' },
        sub1: { type: 'string', example: 'abc' },
        sub2: { type: 'string', example: '123' },
        sub3: { type: 'string', example: '' },
        sub4: { type: 'string', example: '' },
        sub5: { type: 'string', example: '' },
        sub6: { type: 'string', example: '' },
        sub7: { type: 'string', example: '' },
        sub8: { type: 'string', example: '' },
        sub9: { type: 'string', example: '' },
        sub10: { type: 'string', example: '' },
        form: { type: 'string', example: 'unCompleted' },
        geo: {
          type: 'object',
          properties: {
            country: { type: 'string', example: 'US' },
            region: { type: 'string', example: 'CA' },
            city: { type: 'string', example: 'San Francisco' },
            timezone: { type: 'string', example: 'America/Los_Angeles' },
            lat: { type: 'number', example: 37.7749 },
            lon: { type: 'number', example: -122.4194 },
          },
        },
        message: { type: 'string', example: 'Tracking data saved successfully' },
      },
    },
  })
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
      form: tracking.form,
      geo: tracking.geo,
      message: 'Tracking data saved successfully',
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all tracking records',
    description: 'Retrieves all tracking records, sorted by creation date (newest first). Limited to 100 records.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of tracking records',
    schema: {
      type: 'object',
      properties: {
        trackings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              userIp: { type: 'string' },
              userAgent: { type: 'string' },
              fullUrl: { type: 'string' },
              form: { type: 'string' },
              geo: { type: 'object' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  })
  async findAll() {
    const trackings = await this.trackingService.findAll();
    return { trackings };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific tracking record',
    description: 'Retrieves a single tracking record by its ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tracking record found',
    schema: {
      type: 'object',
      properties: {
        tracking: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userIp: { type: 'string' },
            userAgent: { type: 'string' },
            fullUrl: { type: 'string' },
            form: { type: 'string' },
            geo: { type: 'object' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Tracking record not found',
  })
  async findOne(@Param('id') id: string) {
    const tracking = await this.trackingService.findOne(id);
    if (!tracking) {
      throw new NotFoundException(`Tracking record with ID ${id} not found`);
    }
    return { tracking };
  }
}

