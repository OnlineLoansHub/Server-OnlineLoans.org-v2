import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { Impression, ImpressionDocument } from './impression.schema';
import {
  extractIp,
  extractReferrer,
  detectDeviceType,
  parseSubsFromReferrer,
  geoLookup,
} from './utils/impression.utils';

@Injectable()
export class ImpressionService {
  constructor(
    @InjectModel(Impression.name)
    private impressionModel: Model<ImpressionDocument>,
  ) {}

  async createImpression(req: Request): Promise<ImpressionDocument> {
    const userIp = extractIp(req) || '';
    const userAgent = req.headers['user-agent'] || '';
    const referrer = extractReferrer(req) || '';
    const deviceType = detectDeviceType(userAgent);
    const geo = geoLookup(userIp);
    const subs = parseSubsFromReferrer(referrer);

    // Ensure all fields are always present, even if empty
    const impressionData = {
      userIp: userIp || '',
      userAgent: userAgent || '',
      referrer: referrer || '',
      deviceType,
      sub1: subs.sub1 || '',
      sub2: subs.sub2 || '',
      sub3: subs.sub3 || '',
      sub4: subs.sub4 || '',
      sub5: subs.sub5 || '',
      sub6: subs.sub6 || '',
      sub7: subs.sub7 || '',
      sub8: subs.sub8 || '',
      sub9: subs.sub9 || '',
      sub10: subs.sub10 || '',
      geo: {
        country: geo?.country || '',
        region: geo?.region || '',
        city: geo?.city || '',
        timezone: geo?.timezone || '',
        lat: geo?.lat || null,
        lon: geo?.lon || null,
      },
    };

    const impression = new this.impressionModel(impressionData);
    return impression.save();
  }

  async findAll(): Promise<Impression[]> {
    return this.impressionModel.find().sort({ createdAt: -1 }).limit(100).exec();
  }

  async findOne(id: string): Promise<ImpressionDocument | null> {
    return this.impressionModel.findById(id).exec();
  }
}

