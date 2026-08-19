import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class WardrobeItem extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  subcategory: string;

  @Prop({ type: [String], default: [] })
  colors: string[];

  @Prop()
  fit: string;

  @Prop()
  material: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ default: 0 })
  wearCount: number;

  @Prop()
  lastWornAt: Date;

  @Prop({ default: false })
  isFavorite: boolean;

  @Prop({ default: 0 })
  aiConfidence: number;
}

export const WardrobeItemSchema = SchemaFactory.createForClass(WardrobeItem);
