import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class AIMemory extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  preferenceType: string; // e.g., 'dislikes_fabric', 'prefers_color'

  @Prop({ required: true })
  value: string; // e.g., 'linen', 'monochrome'

  @Prop({ required: true })
  confidence: number; // 0 to 1

  @Prop({ enum: ['explicit', 'behavioral', 'contextual'], default: 'behavioral' })
  source: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const AIMemorySchema = SchemaFactory.createForClass(AIMemory);
