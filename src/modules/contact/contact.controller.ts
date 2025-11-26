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
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@ApiTags('contact')
@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createContactDto: CreateContactDto) {
    const contact = await this.contactService.create(createContactDto);
    return {
      message: 'Contact form submitted successfully',
      id: contact._id,
    };
  }

  @Get()
  async findAll() {
    const contacts = await this.contactService.findAll();
    return { contacts };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const contact = await this.contactService.findOne(id);
    return { contact };
  }
}

