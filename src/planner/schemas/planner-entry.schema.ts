import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class PlannerEntry extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'WardrobeItem' }] })
  outfitItems: Types.ObjectId[];

  @Prop()
  occasion: string;

  @Prop()
  weatherSource: string; // Captured forecast context

  @Prop({ default: false })
  isWorn: boolean; // Confirmed worn (for analytics)
}

export const PlannerEntrySchema = SchemaFactory.createForClass(PlannerEntry);
