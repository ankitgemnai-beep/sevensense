import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class TryOnSession extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  sourceImage: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
  garmentIds: Types.ObjectId[];

  @Prop({ required: true })
  provider: string;

  @Prop({ required: true, enum: ['queued', 'processing', 'completed', 'failed'] })
  status: string;

  @Prop()
  resultImage: string;
}

export const TryOnSessionSchema = SchemaFactory.createForClass(TryOnSession);
