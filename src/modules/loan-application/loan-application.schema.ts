import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoanApplicationDocument = LoanApplication & Document;

@Schema({ timestamps: true })
export class LoanApplication {
  @Prop({ required: true, enum: ['personal', 'business'] })
  loanType: 'personal' | 'business';

  @Prop({ required: true, trim: true })
  amount: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  })
  email: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ type: Object, default: {} })
  additionalData?: Record<string, unknown>;
}

export const LoanApplicationSchema =
  SchemaFactory.createForClass(LoanApplication);

