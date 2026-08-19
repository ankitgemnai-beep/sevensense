import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class GeneratedOutfit extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop()
  occasion: string;

  @Prop({ type: Object })
  weather: any;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'WardrobeItem' }] })
  items: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  accessories: string[];

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  confidence: number;

  @Prop({ type: [String], default: [] })
  reasons: string[];

  @Prop({ type: [Object], default: [] })
  alternatives: any[];

  @Prop({ default: 'daily_stylist' })
  source: string;
}

export const GeneratedOutfitSchema = SchemaFactory.createForClass(GeneratedOutfit);
