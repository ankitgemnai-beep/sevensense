import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true, enum: ['ai_stylist', 'wardrobe', 'shopping', 'planner', 'community', 'security'] })
  category: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: Object })
  metadata: any; // Links or contexts for navigation
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
