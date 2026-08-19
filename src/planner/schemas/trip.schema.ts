import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Trip extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  destination: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: [String] })
  activities: string[];

  @Prop()
  weatherAssumption: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'WardrobeItem' }] })
  packingList: Types.ObjectId[];
}

export const TripSchema = SchemaFactory.createForClass(Trip);
