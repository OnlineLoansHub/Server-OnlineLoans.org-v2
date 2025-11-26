import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Partner, PartnerDocument } from './partner.schema';
import { CreatePartnerDto } from './dto/create-partner.dto';

@Injectable()
export class PartnerService {
  constructor(
    @InjectModel(Partner.name) private partnerModel: Model<PartnerDocument>,
  ) {}

  async create(createPartnerDto: CreatePartnerDto): Promise<PartnerDocument> {
    const createdPartner = new this.partnerModel(createPartnerDto);
    return createdPartner.save();
  }

  async findAll(): Promise<Partner[]> {
    return this.partnerModel.find().sort({ createdAt: -1 }).limit(100).exec();
  }

  async findOne(id: string): Promise<Partner> {
    return this.partnerModel.findById(id).exec();
  }
}

