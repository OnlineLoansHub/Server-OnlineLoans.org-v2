import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Impression, ImpressionDocument } from './impression.schema';
import { TelegramService } from '../../services/telegram/telegram.service';
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
    private telegramService: TelegramService,
    private configService: ConfigService,
  ) {}

  async createImpression(req: Request): Promise<ImpressionDocument> {
    const userIp = extractIp(req) || '';
    const userAgent = req.headers['user-agent'] || '';
    const xReferrer = extractReferrer(req) || '';
    const deviceType = detectDeviceType(userAgent);
    const geo = geoLookup(userIp);
    const subs = parseSubsFromReferrer(xReferrer);

    // Ensure all fields are always present, even if empty
    const impressionData = {
      userIp: userIp || '',
      userAgent: userAgent || '',
      referrer: xReferrer || '',
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
      form: {},
      hasFormData: false,
    };

    const impression = new this.impressionModel(impressionData);
    const savedImpression = await impression.save();

    // Send Telegram notification
    const botToken = this.configService.get<string>('TG_IMP_BOT_ID');
    const groupId = this.configService.get<string>('TG_IMP_GROUP_ID');
    
    if (botToken && groupId) {
      // Convert to plain object to include all fields
      const impressionData = savedImpression.toObject();
      this.telegramService
        .notifyNewImpression(botToken, groupId, impressionData)
        .catch((error) => {
          // Log error but don't fail the impression creation
          console.error('Failed to send Telegram notification:', error);
        });
    }

    return savedImpression;
  }

  async findAll(): Promise<Impression[]> {
    return this.impressionModel.find().sort({ createdAt: -1 }).limit(100).exec();
  }

  async findByFilter(filters: Record<string, any>): Promise<Impression[]> {
    const filter: any = {};

    // Handle string fields
    if (filters.userIp) filter.userIp = filters.userIp;
    if (filters.userAgent) filter.userAgent = { $regex: filters.userAgent, $options: 'i' };
    if (filters.referrer) filter.referrer = { $regex: filters.referrer, $options: 'i' };
    if (filters.deviceType) filter.deviceType = filters.deviceType;
    
    // Handle sub parameters
    for (let i = 1; i <= 10; i++) {
      const subKey = `sub${i}`;
      if (filters[subKey]) {
        filter[subKey] = filters[subKey];
      }
    }

    // Handle geo fields
    if (filters['geo.country']) filter['geo.country'] = filters['geo.country'];
    if (filters['geo.region']) filter['geo.region'] = filters['geo.region'];
    if (filters['geo.city']) filter['geo.city'] = { $regex: filters['geo.city'], $options: 'i' };
    if (filters['geo.timezone']) filter['geo.timezone'] = filters['geo.timezone'];

    // Handle date range filters
    if (filters.createdAfter || filters.createdBefore) {
      filter.createdAt = {};
      if (filters.createdAfter) {
        filter.createdAt.$gte = new Date(filters.createdAfter);
      }
      if (filters.createdBefore) {
        filter.createdAt.$lte = new Date(filters.createdBefore);
      }
    }

    // Default limit and sorting
    const limit = filters.limit ? parseInt(filters.limit, 10) : 100;
    const sort: any = filters.sort === 'asc' ? { createdAt: 1 } : { createdAt: -1 };

    return this.impressionModel
      .find(filter)
      .sort(sort)
      .limit(limit)
      .exec();
  }

  async findOne(id: string): Promise<ImpressionDocument | null> {
    return this.impressionModel.findById(id).exec();
  }

  async updateForm(id: string, formData: Record<string, any>): Promise<ImpressionDocument | null> {
    const impression = await this.impressionModel.findById(id).exec();
    if (!impression) {
      return null;
    }

    // Merge the new form data with existing form data
    const updatedForm = {
      ...(impression.form || {}),
      ...formData,
    };

    // Check if form has any data (has at least one key with a non-empty value)
    const hasFormData = Object.keys(updatedForm).length > 0 && 
      Object.values(updatedForm).some(value => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string' && value.trim() === '') return false;
        if (typeof value === 'object' && Object.keys(value).length === 0) return false;
        return true;
      });

    // Update both form and hasFormData fields
    const updated = await this.impressionModel.findByIdAndUpdate(
      id,
      { $set: { form: updatedForm, hasFormData } },
      { new: true, runValidators: true },
    ).exec();

    return updated;
  }
}

