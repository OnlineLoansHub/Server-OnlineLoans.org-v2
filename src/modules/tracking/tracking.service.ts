import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { Tracking, TrackingDocument } from './tracking.schema';
import {
  extractIp,
  extractReferrer,
  detectDeviceType,
  parseSubsFromReferrer,
  geoLookup,
} from './utils/tracking.utils';

@Injectable()
export class TrackingService {
  constructor(
    @InjectModel(Tracking.name)
    private trackingModel: Model<TrackingDocument>,
  ) {}

  async createTracking(req: Request): Promise<TrackingDocument> {
    const userIp = extractIp(req) || '';
    const userAgent = req.headers['user-agent'] || '';
    const referrer = extractReferrer(req) || '';
    const deviceType = detectDeviceType(userAgent);
    const geo = geoLookup(userIp);
    const subs = parseSubsFromReferrer(referrer);

    // Ensure all fields are always present, even if empty
    const trackingData = {
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
      formStatus: 'unCompleted',
      geo: {
        country: geo?.country || '',
        region: geo?.region || '',
        city: geo?.city || '',
        timezone: geo?.timezone || '',
        lat: geo?.lat || null,
        lon: geo?.lon || null,
      },
    };

    const tracking = new this.trackingModel(trackingData);
    return tracking.save();
  }

  async findAll(): Promise<Tracking[]> {
    return this.trackingModel.find().sort({ createdAt: -1 }).limit(100).exec();
  }

  async findOne(id: string): Promise<TrackingDocument | null> {
    return this.trackingModel.findById(id).exec();
  }
}

