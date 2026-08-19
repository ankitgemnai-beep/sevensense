import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class FeatureFlag extends Document {
  @Prop({ required: true, unique: true })
  key: string; // e.g., 'AI_TRYON', 'AI_KILL_SWITCH'

  @Prop({ required: true, default: false })
  isEnabled: boolean;

  @Prop()
  description: string;

  // For phased rollouts (0 to 100)
  @Prop({ default: 100 })
  rolloutPercentage: number;
}

export const FeatureFlagSchema = SchemaFactory.createForClass(FeatureFlag);
