import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImpressionDocument = Impression & Document;

@Schema({ timestamps: true, collection: 'impression-v2', minimize: false })
export class Impression {
  @Prop({ type: String, default: '' })
  userIp: string;

  @Prop({ type: String, default: '' })
  userAgent: string;

  @Prop({ type: String, default: '' })
  referrer: string;

  @Prop({ enum: ['mobile', 'desktop', 'tablet'], default: 'desktop' })
  deviceType: 'mobile' | 'desktop' | 'tablet';

  @Prop({ type: String, default: '' })
  sub1: string;

  @Prop({ type: String, default: '' })
  sub2: string;

  @Prop({ type: String, default: '' })
  sub3: string;

  @Prop({ type: String, default: '' })
  sub4: string;

  @Prop({ type: String, default: '' })
  sub5: string;

  @Prop({ type: String, default: '' })
  sub6: string;

  @Prop({ type: String, default: '' })
  sub7: string;

  @Prop({ type: String, default: '' })
  sub8: string;

  @Prop({ type: String, default: '' })
  sub9: string;

  @Prop({ type: String, default: '' })
  sub10: string;

  @Prop({
    type: {
      country: { type: String, default: '' },
      region: { type: String, default: '' },
      city: { type: String, default: '' },
      timezone: { type: String, default: '' },
      lat: { type: Number, default: null },
      lon: { type: Number, default: null },
    },
    _id: false,
    default: {},
  })
  geo: {
    country: string;
    region: string;
    city: string;
    timezone: string;
    lat: number | null;
    lon: number | null;
  };

  @Prop({ type: Object, default: () => ({}), required: true })
  homepageClicks: Record<string, any>;

  @Prop({ type: Boolean, default: false })
  hasHomepageClicks: boolean;
}

export const ImpressionSchema = SchemaFactory.createForClass(Impression);

