import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class FashionDNA {
  @Prop({ type: [String], default: [] })
  styleIdentity: string[];

  @Prop({ type: [String], default: [] })
  colorDNA: string[];

  @Prop({ type: [String], default: [] })
  fitDNA: string[];

  @Prop({ type: [String], default: [] })
  lifestyleDNA: string[];
  
  @Prop({ default: 0 })
  aiConfidence: number;
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  password?: string;

  @Prop()
  displayName: string;

  @Prop({ unique: true, sparse: true })
  username: string;

  @Prop({ type: [{ type: String }], default: [] })
  followers: string[]; // Storing user IDs as strings

  @Prop({ type: [{ type: String }], default: [] })
  following: string[]; // Storing user IDs as strings

  @Prop({ type: [{ type: String }], default: [] })
  followRequests: string[]; // Storing user IDs as strings

  @Prop()
  profilePhotoUrl: string;

  @Prop({ type: [String], default: [] })
  fashionGoals: string[];

  @Prop({ type: [String], default: [] })
  stylePreferences: string[];

  @Prop()
  fitPreference: string;

  @Prop({ type: [String], default: [] })
  fabricPreferences: string[];

  @Prop()
  lifestyle: string;

  @Prop({ type: [String], default: [] })
  occasionPreferences: string[];

  @Prop({ type: Object })
  budgetProfile: any;

  @Prop({ type: Object })
  colorProfile: any;

  @Prop({ type: Object })
  bodyProfile: any;

  @Prop({ type: FashionDNA })
  fashionDNA: FashionDNA;
  
  @Prop({ default: false })
  profileCompleted: boolean;
  
  @Prop({ default: false })
  onboardingCompleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
