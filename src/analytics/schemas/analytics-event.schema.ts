import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class AnalyticsEvent extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  eventName: string; // e.g., 'outfit_scheduled', 'recommendation_accepted'

  @Prop({ type: Object })
  payload: any;
}

export const AnalyticsEventSchema = SchemaFactory.createForClass(AnalyticsEvent);
