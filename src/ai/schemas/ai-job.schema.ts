import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

@Schema({ timestamps: true })
export class AIJob extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  jobType: string; // e.g., 'wardrobe_analysis', 'virtual_tryon'

  @Prop({ type: Object })
  payload: any;

  @Prop({ required: true, enum: ['queued', 'processing', 'completed', 'failed', 'cancelled'], default: 'queued' })
  status: JobStatus;

  @Prop()
  result: any;

  @Prop()
  errorMessage: string;

  @Prop()
  startedAt: Date;

  @Prop()
  completedAt: Date;
}

export const AIJobSchema = SchemaFactory.createForClass(AIJob);
