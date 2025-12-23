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
    // ─────────────────────────────────────────────
    // 🔥 HOT PATH — minimal work, fastest return
    // ─────────────────────────────────────────────
  
    const userIp = extractIp(req) || '';
    const userAgent = req.headers['user-agent'] || '';
    const referrer = extractReferrer(req) || '';
  
    const impression = await this.impressionModel.create({
      userIp,
      userAgent,
      referrer,
      hasLpClick: false,
      lpClicks: {},
      geo: {
        country: '',
        region: '',
        city: '',
        timezone: '',
        lat: null,
        lon: null,
      },
    });
  
    // ─────────────────────────────────────────────
    // 🧊 COLD PATH — enrichment after response
    // ─────────────────────────────────────────────
    setImmediate(async () => {
      try {
        // Enrichment
        const deviceType = detectDeviceType(userAgent);
        const geo = geoLookup(userIp);
        const subs = parseSubsFromReferrer(referrer);
  
        const city = (geo?.city || '').toLowerCase();
  
        // Update impression with enriched data
        await this.impressionModel.updateOne(
          { _id: impression._id },
          {
            $set: {
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
                lat: geo?.lat ?? null,
                lon: geo?.lon ?? null,
              },
            },
          }
        );
  
        // Telegram notification (optional, non-blocking)
        const botToken = this.configService.get<string>('TG_IMP_BOT_ID');
        const groupId = this.configService.get<string>('TG_IMP_GROUP_ID');
  
        if (botToken && groupId && city !== 'shoresh') {
          const impressionObj = impression.toObject() as any;
          const telegramPayload = {
            _id: impression._id.toString(),
            userIp,
            deviceType,
            userAgent,
            referrer,
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
              lat: geo?.lat ?? null,
              lon: geo?.lon ?? null,
            },
            createdAt: impressionObj.createdAt || new Date(),
          };

          await this.telegramService.notifyNewImpression(
            botToken,
            groupId,
            telegramPayload
          );
        }
      } catch (error) {
        // Never affect request lifecycle
        console.error('Async impression enrichment failed:', error);
      }
    });
  
    // 🚀 RETURN ASAP
    return impression;
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

    // Handle hasLpClick boolean filter
    if (typeof filters.hasLpClick !== 'undefined') {
      const value = String(filters.hasLpClick).toLowerCase();
      if (value === 'true' || value === 'false') {
        filter.hasLpClick = value === 'true';
      }
    }

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
    const limit = filters.limit ? parseInt(filters.limit, 10) : 500;
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

  async updateLpClicks(id: string, lpClicksData: Record<string, any>): Promise<ImpressionDocument | null> {
    const impression = await this.impressionModel.findById(id).exec();
    if (!impression) {
      return null;
    }

    // Merge the new lpClicks data with existing lpClicks data
    const updatedLpClicks = {
      ...(impression.lpClicks || {}),
      ...lpClicksData,
    };

    // Check if lpClicks has any data (has at least one key with a non-empty value)
    const hasLpClick = Object.keys(updatedLpClicks).length > 0 && 
      Object.values(updatedLpClicks).some(value => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string' && value.trim() === '') return false;
        if (typeof value === 'object' && Object.keys(value).length === 0) return false;
        return true;
      });

    // Update both lpClicks and hasLpClick fields
    const updated = await this.impressionModel.findByIdAndUpdate(
      id,
      { $set: { lpClicks: updatedLpClicks, hasLpClick } },
      { new: true, runValidators: true },
    ).exec();

    return updated;
  }

  async deleteFilteredImpressions(): Promise<{ deletedCount: number; totalRemaining: number }> {
    // Build query for documents to delete
    const deleteQuery = {
      $or: [
        { 'geo.city': 'Shoresh' },
        { referrer: { $regex: /localhost/i } },
        { referrer: { $regex: /10\.0\.0\.7/i } },
      ],
    };

    // Delete documents
    const result = await this.impressionModel.deleteMany(deleteQuery);

    // Count remaining documents
    const totalRemaining = await this.impressionModel.countDocuments({});

    return {
      deletedCount: result.deletedCount,
      totalRemaining,
    };
  }
}

