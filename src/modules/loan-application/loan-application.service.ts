import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import {
  LoanApplication,
  LoanApplicationDocument,
} from './loan-application.schema';
import { CreateLoanApplicationDto } from './dto/create-loan-application.dto';
import { StartApplicationDto } from './dto/start-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { CompleteApplicationDto } from './dto/complete-application.dto';
import {
  extractIp,
  detectDeviceType,
  parseSubs,
  geoLookup,
  parseUserAgent,
  extractFullUrl,
} from './utils/tracking.utils';

@Injectable()
export class LoanApplicationService {
  constructor(
    @InjectModel(LoanApplication.name)
    private loanApplicationModel: Model<LoanApplicationDocument>,
  ) {}

  /**
   * Create a new application (backward compatibility)
   */
  async create(
    createLoanApplicationDto: CreateLoanApplicationDto,
  ): Promise<LoanApplicationDocument> {
    const createdApplication = new this.loanApplicationModel(
      createLoanApplicationDto,
    );
    return createdApplication.save();
  }

  /**
   * Start a new application (Step 1)
   * Creates document with tracking data and initial form data
   */
  async startApplication(
    startDto: StartApplicationDto,
    req: Request,
  ): Promise<LoanApplicationDocument> {
    const userIp = extractIp(req);
    const userAgent = req.headers['user-agent'] || '';
    const fullUrl = extractFullUrl(req);
    const deviceType = detectDeviceType(userAgent);
    const geo = geoLookup(userIp);
    const subs = parseSubs(fullUrl);
    const userAgentData = parseUserAgent(userAgent);

    // Merge form data
    const formData: Record<string, unknown> = {
      ...(startDto.loanType && { loanType: startDto.loanType }),
      ...(startDto.amount && { amount: startDto.amount }),
      ...(startDto.email && { email: startDto.email }),
      ...(startDto.phone && { phone: startDto.phone }),
      ...(startDto.formData || {}),
    };

    const applicationData = {
      status: 'unCompleted' as const,
      step: 1,
      // Store in both original fields and formData for backward compatibility
      loanType: startDto.loanType,
      amount: startDto.amount,
      email: startDto.email,
      phone: startDto.phone,
      formData,
      // Tracking data
      userIp,
      userAgent,
      fullUrl,
      deviceType,
      geo,
      ...subs,
      metadata: {
        browser: userAgentData.browser,
        os: userAgentData.os,
        referrer: req.headers.referer || undefined,
      },
    };

    const createdApplication = new this.loanApplicationModel(applicationData);
    return createdApplication.save();
  }

  /**
   * Update an existing application (Step 2, 3, 4...)
   * Partial update, never overwrites with undefined
   */
  async updateApplication(
    id: string,
    updateDto: UpdateApplicationDto,
    req: Request,
  ): Promise<LoanApplicationDocument> {
    const application = await this.loanApplicationModel.findById(id).exec();

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    // Prepare update object - never set undefined values
    const updateData: Partial<LoanApplication> = {};

    // Update step if provided, otherwise increment
    if (updateDto.step !== undefined) {
      updateData.step = updateDto.step;
    } else if (application.step !== undefined) {
      updateData.step = application.step + 1;
    } else {
      updateData.step = 2;
    }

    // Update original fields if provided
    if (updateDto.loanType !== undefined) {
      updateData.loanType = updateDto.loanType;
    }
    if (updateDto.amount !== undefined) {
      updateData.amount = updateDto.amount;
    }
    if (updateDto.email !== undefined) {
      updateData.email = updateDto.email;
    }
    if (updateDto.phone !== undefined) {
      updateData.phone = updateDto.phone;
    }

    // Merge formData - deep merge to preserve existing fields
    if (updateDto.formData !== undefined) {
      const existingFormData = application.formData || {};
      updateData.formData = {
        ...existingFormData,
        ...updateDto.formData,
        // Also update top-level fields in formData
        ...(updateDto.loanType && { loanType: updateDto.loanType }),
        ...(updateDto.amount && { amount: updateDto.amount }),
        ...(updateDto.email && { email: updateDto.email }),
        ...(updateDto.phone && { phone: updateDto.phone }),
      };
    } else {
      // Still update formData with top-level fields if provided
      const existingFormData = application.formData || {};
      updateData.formData = {
        ...existingFormData,
        ...(updateDto.loanType && { loanType: updateDto.loanType }),
        ...(updateDto.amount && { amount: updateDto.amount }),
        ...(updateDto.email && { email: updateDto.email }),
        ...(updateDto.phone && { phone: updateDto.phone }),
      };
    }

    // Update the document
    Object.assign(application, updateData);
    return application.save();
  }

  /**
   * Complete an application (Final step)
   * Full validation, set status to completed
   */
  async completeApplication(
    id: string,
    completeDto: CompleteApplicationDto,
    req: Request,
  ): Promise<LoanApplicationDocument> {
    const application = await this.loanApplicationModel.findById(id).exec();

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    // Prepare final update
    const finalFormData: Record<string, unknown> = {
      ...(application.formData || {}),
      loanType: completeDto.loanType,
      amount: completeDto.amount,
      email: completeDto.email,
      ...(completeDto.phone && { phone: completeDto.phone }),
      ...(completeDto.formData || {}),
    };

    // Update with final data
    application.status = 'completed';
    application.completedAt = new Date();
    application.step = (application.step || 1) + 1;
    application.loanType = completeDto.loanType;
    application.amount = completeDto.amount;
    application.email = completeDto.email;
    if (completeDto.phone !== undefined) {
      application.phone = completeDto.phone;
    }
    application.formData = finalFormData;

    return application.save();
  }

  async findAll(): Promise<LoanApplication[]> {
    return this.loanApplicationModel
      .find()
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();
  }

  async findOne(id: string): Promise<LoanApplicationDocument | null> {
    return this.loanApplicationModel.findById(id).exec();
  }
}

