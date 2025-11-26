import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoanApplicationDocument = LoanApplication & Document;

@Schema({ timestamps: true })
export class LoanApplication {
  // Status and step tracking
  @Prop({ enum: ['unCompleted', 'completed'], default: 'unCompleted' })
  status: 'unCompleted' | 'completed';

  @Prop({ type: Number, default: 1 })
  step: number;

  @Prop({ type: Date, default: null })
  completedAt?: Date;

  // Original fields (kept for backward compatibility)
  @Prop({ enum: ['personal', 'business'] })
  loanType?: 'personal' | 'business';

  @Prop({ trim: true })
  amount?: string;

  @Prop({
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  })
  email?: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ type: Object, default: {} })
  additionalData?: Record<string, unknown>;

  // Flexible form data storage
  @Prop({ type: Object, default: {} })
  formData?: Record<string, unknown>;

  // Tracking fields
  @Prop({ type: String })
  userIp?: string;

  @Prop({ type: String })
  userAgent?: string;

  @Prop({ type: String })
  fullUrl?: string;

  @Prop({ enum: ['mobile', 'desktop', 'tablet'] })
  deviceType?: 'mobile' | 'desktop' | 'tablet';

  // Geo location data
  @Prop({
    type: {
      country: String,
      region: String,
      city: String,
      timezone: String,
      lat: Number,
      lon: Number,
    },
    _id: false,
  })
  geo?: {
    country?: string;
    region?: string;
    city?: string;
    timezone?: string;
    lat?: number;
    lon?: number;
  };

  // Sub parameters (sub1-sub10)
  @Prop({ type: String })
  sub1?: string;

  @Prop({ type: String })
  sub2?: string;

  @Prop({ type: String })
  sub3?: string;

  @Prop({ type: String })
  sub4?: string;

  @Prop({ type: String })
  sub5?: string;

  @Prop({ type: String })
  sub6?: string;

  @Prop({ type: String })
  sub7?: string;

  @Prop({ type: String })
  sub8?: string;

  @Prop({ type: String })
  sub9?: string;

  @Prop({ type: String })
  sub10?: string;

  // Metadata
  @Prop({
    type: {
      browser: String,
      os: String,
      referrer: String,
    },
    _id: false,
  })
  metadata?: {
    browser?: string;
    os?: string;
    referrer?: string;
  };
}

export const LoanApplicationSchema =
  SchemaFactory.createForClass(LoanApplication);

