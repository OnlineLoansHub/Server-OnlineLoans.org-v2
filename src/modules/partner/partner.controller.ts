import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';

@ApiTags('partner')
@Controller('api/partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPartnerDto: CreatePartnerDto) {
    const partner = await this.partnerService.create(createPartnerDto);
    return {
      message: 'Partner form submitted successfully',
      id: partner._id,
    };
  }

  @Get()
  async findAll() {
    const partners = await this.partnerService.findAll();
    return { partners };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const partner = await this.partnerService.findOne(id);
    return { partner };
  }
}

