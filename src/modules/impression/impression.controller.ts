import { Controller, Get, Post, Patch, Param, HttpCode, HttpStatus, Req, Body, Query, NotFoundException } from '@nestjs/common';
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
      form: impression.form,
      hasFormData: impression.hasFormData,
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

  @Patch(':id/form')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update form data for an impression' })
  @ApiBody({
    description: 'Form data object - can contain any key-value pairs',
    schema: {
      type: 'object',
      additionalProperties: true,
      example: {
        date: '2025-11-30',
        formName: 'business-loan',
        step1Question: 'How much money do you need?',
        step1Answer: '10000',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Form data updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        form: {
          type: 'object',
          additionalProperties: true,
          example: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
          },
        },
        hasFormData: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Form data updated successfully' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Impression not found',
  })
  async updateForm(@Param('id') id: string, @Body() formData: Record<string, any>) {
    const impression = await this.impressionService.updateForm(id, formData);
    if (!impression) {
      throw new NotFoundException(`Impression record with ID ${id} not found`);
    }
    return {
      id: impression._id.toString(),
      form: impression.form,
      hasFormData: impression.hasFormData,
      message: 'Form data updated successfully',
    };
  }
}

