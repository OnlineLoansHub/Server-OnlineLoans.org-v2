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
import { LoanApplicationService } from './loan-application.service';
import { CreateLoanApplicationDto } from './dto/create-loan-application.dto';

@ApiTags('loan-application')
@Controller('api/loan-application')
export class LoanApplicationController {
  constructor(
    private readonly loanApplicationService: LoanApplicationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLoanApplicationDto: CreateLoanApplicationDto) {
    const application = await this.loanApplicationService.create(
      createLoanApplicationDto,
    );
    return {
      message: 'Loan application submitted successfully',
      id: application._id,
    };
  }

  @Get()
  async findAll() {
    const applications = await this.loanApplicationService.findAll();
    return { applications };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const application = await this.loanApplicationService.findOne(id);
    return { application };
  }
}

