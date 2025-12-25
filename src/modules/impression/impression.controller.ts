import { Controller, Get, Post, Delete, Param, HttpCode, HttpStatus, Req, Body, Query, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ImpressionService } from './impression.service';

@ApiTags('impression')
@Controller('api/impression')
export class ImpressionController {
  constructor(private readonly impressionService: ImpressionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async track(@Req() req: Request) {
    const impression = await this.impressionService.createImpression(req);
    return {
      id: impression._id.toString(),
      userIp: impression.userIp,
      userAgent: impression.userAgent,
      referrer: impression.referrer,
      deviceType: impression.deviceType,
      sub1: impression.sub1,
      sub2: impression.sub2,
      sub3: impression.sub3,
      sub4: impression.sub4,
      sub5: impression.sub5,
      sub6: impression.sub6,
      sub7: impression.sub7,
      sub8: impression.sub8,
      sub9: impression.sub9,
      sub10: impression.sub10,
      geo: impression.geo,
      hasLpClick: impression.hasLpClick,
      lpClicks: impression.lpClicks,
      message: 'Impression data saved successfully',
    };
  }

  @Get()
  async findAll(@Query() query: Record<string, any>) {
    const impressions = await this.impressionService.findByFilter(query);
    return { impressions };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const impression = await this.impressionService.findOne(id);
    if (!impression) {
      throw new NotFoundException(`Impression record with ID ${id} not found`);
    }
    return { impression };
  }

  @Post('lp-clicks')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update LP clicks data for an impression' })
  @ApiBody({
    description: 'LP clicks data with impression ID in body',
    schema: {
      type: 'object',
      required: ['impressionId'],
      properties: {
        impressionId: { type: 'string', example: '507f1f77bcf86cd799439011' },
      },
      additionalProperties: true,
      example: {
        impressionId: '507f1f77bcf86cd799439011',
        clickType: 'button',
        elementId: 'apply-now',
        timestamp: '2025-12-17T10:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'LP clicks data updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        lpClicks: {
          type: 'object',
          additionalProperties: true,
          example: {
            clickType: 'button',
            elementId: 'apply-now',
            timestamp: '2025-12-17T10:30:00Z',
          },
        },
        hasLpClick: { type: 'boolean', example: true },
        message: { type: 'string', example: 'LP clicks data updated successfully' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Impression not found',
  })
  async updateLpClicks(@Body() body: { impressionId: string; [key: string]: any }) {
    const { impressionId, ...lpClicksData } = body;
    const impression = await this.impressionService.updateLpClicks(impressionId, lpClicksData);
    if (!impression) {
      throw new NotFoundException(`Impression record with ID ${impressionId} not found`);
    }
    return {
      id: impression._id.toString(),
      lpClicks: impression.lpClicks,
      hasLpClick: impression.hasLpClick,
      message: 'LP clicks data updated successfully',
    };
  }

  @Delete('cleanup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Delete filtered impressions',
    description: 'Deletes all impressions matching: geo.city = "Shoresh", referrer contains "localhost", or referrer contains "10.0.0.7"'
  })
  @ApiResponse({
    status: 200,
    description: 'Impressions deleted successfully',
    schema: {
      type: 'object',
      properties: {
        deletedCount: { type: 'number', example: 15 },
        totalRemaining: { type: 'number', example: 1234 },
        message: { type: 'string', example: 'Successfully deleted 15 impression(s). Total remaining: 1234' },
      },
    },
  })
  async deleteFilteredImpressions() {
    const result = await this.impressionService.deleteFilteredImpressions();
    return {
      deletedCount: result.deletedCount,
      totalRemaining: result.totalRemaining,
      message: `Successfully deleted ${result.deletedCount} impression(s). Total remaining: ${result.totalRemaining}`,
    };
  }
}

