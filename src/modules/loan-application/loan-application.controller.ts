import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Req,
  UsePipes,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoanApplicationService } from './loan-application.service';
import { CreateLoanApplicationDto } from './dto/create-loan-application.dto';
import { StartApplicationDto } from './dto/start-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { CompleteApplicationDto } from './dto/complete-application.dto';
import { ZodValidationPipe } from './pipes/zod-validation.pipe';
import {
  applicationPartialSchema,
  applicationFullSchema,
} from './schemas/application.schemas';

@ApiTags('loan-application')
@Controller('api')
export class LoanApplicationController {
  constructor(
    private readonly loanApplicationService: LoanApplicationService,
  ) {}

  /**
   * Legacy endpoint - kept for backward compatibility
   */
  @Post('loan-application')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create loan application (legacy)' })
  async create(@Body() createLoanApplicationDto: CreateLoanApplicationDto) {
    const application = await this.loanApplicationService.create(
      createLoanApplicationDto,
    );
    return {
      message: 'Loan application submitted successfully',
      id: application._id,
    };
  }

  /**
   * Start a new application (Step 1)
   */
  @Post('applications/start')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(applicationPartialSchema))
  @ApiOperation({ summary: 'Start a new loan application' })
  @ApiResponse({
    status: 201,
    description: 'Application started successfully',
    schema: {
      type: 'object',
      properties: {
        applicationId: { type: 'string' },
        step: { type: 'number' },
        status: { type: 'string', enum: ['unCompleted'] },
        message: { type: 'string' },
      },
    },
  })
  async start(
    @Body() startDto: StartApplicationDto,
    @Req() req: Request,
  ) {
    const application = await this.loanApplicationService.startApplication(
      startDto,
      req,
    );
    return {
      applicationId: application._id.toString(),
      step: application.step,
      status: application.status,
      message: 'Application started successfully',
    };
  }

  /**
   * Update an existing application (Step 2, 3, 4...)
   */
  @Patch('applications/:id/update')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(applicationPartialSchema))
  @ApiOperation({ summary: 'Update application progress' })
  @ApiResponse({
    status: 200,
    description: 'Application updated successfully',
    schema: {
      type: 'object',
      properties: {
        applicationId: { type: 'string' },
        step: { type: 'number' },
        status: { type: 'string', enum: ['unCompleted', 'completed'] },
        updatedFields: { type: 'array', items: { type: 'string' } },
        message: { type: 'string' },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateApplicationDto,
    @Req() req: Request,
  ) {
    const application = await this.loanApplicationService.updateApplication(
      id,
      updateDto,
      req,
    );

    // Determine which fields were updated
    const updatedFields: string[] = [];
    if (updateDto.loanType !== undefined) updatedFields.push('loanType');
    if (updateDto.amount !== undefined) updatedFields.push('amount');
    if (updateDto.email !== undefined) updatedFields.push('email');
    if (updateDto.phone !== undefined) updatedFields.push('phone');
    if (updateDto.formData !== undefined) updatedFields.push('formData');
    if (updateDto.step !== undefined) updatedFields.push('step');

    return {
      applicationId: application._id.toString(),
      step: application.step,
      status: application.status,
      updatedFields,
      message: 'Application updated successfully',
    };
  }

  /**
   * Complete an application (Final step)
   */
  @Post('applications/:id/complete')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(applicationFullSchema))
  @ApiOperation({ summary: 'Complete loan application' })
  @ApiResponse({
    status: 200,
    description: 'Application completed successfully',
    schema: {
      type: 'object',
      properties: {
        applicationId: { type: 'string' },
        status: { type: 'string', enum: ['completed'] },
        completedAt: { type: 'string', format: 'date-time' },
        message: { type: 'string' },
      },
    },
  })
  async complete(
    @Param('id') id: string,
    @Body() completeDto: CompleteApplicationDto,
    @Req() req: Request,
  ) {
    const application = await this.loanApplicationService.completeApplication(
      id,
      completeDto,
      req,
    );

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    return {
      applicationId: application._id.toString(),
      status: application.status,
      completedAt: application.completedAt,
      message: 'Application completed successfully',
    };
  }

  @Get('loan-application')
  @ApiOperation({ summary: 'Get all loan applications' })
  async findAll() {
    const applications = await this.loanApplicationService.findAll();
    return { applications };
  }

  @Get('loan-application/:id')
  @ApiOperation({ summary: 'Get a specific loan application' })
  async findOne(@Param('id') id: string) {
    const application = await this.loanApplicationService.findOne(id);
    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
    return { application };
  }
}

