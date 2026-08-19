import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Subscription extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ['FREE', 'PLUS', 'PREMIUM'], default: 'FREE' })
  planId: string;

  @Prop({ enum: ['apple', 'google', 'stripe', 'none'], default: 'none' })
  provider: string;

  @Prop()
  externalSubscriptionId: string;

  @Prop({ enum: ['trial', 'active', 'past_due', 'paused', 'cancelled', 'expired'], default: 'active' })
  status: string;

  @Prop()
  currentPeriodStart: Date;

  @Prop()
  currentPeriodEnd: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
