import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LoanApplication,
  LoanApplicationDocument,
} from './loan-application.schema';
import { CreateLoanApplicationDto } from './dto/create-loan-application.dto';

@Injectable()
export class LoanApplicationService {
  constructor(
    @InjectModel(LoanApplication.name)
    private loanApplicationModel: Model<LoanApplicationDocument>,
  ) {}

  async create(
    createLoanApplicationDto: CreateLoanApplicationDto,
  ): Promise<LoanApplicationDocument> {
    const createdApplication = new this.loanApplicationModel(
      createLoanApplicationDto,
    );
    return createdApplication.save();
  }

  async findAll(): Promise<LoanApplication[]> {
    return this.loanApplicationModel
      .find()
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();
  }

  async findOne(id: string): Promise<LoanApplication> {
    return this.loanApplicationModel.findById(id).exec();
  }
}

