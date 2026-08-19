import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [String], required: true })
  media: string[]; // Cloudinary URLs

  @Prop()
  caption: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'WardrobeItem' }] })
  wardrobeItemRefs: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
  productRefs: Types.ObjectId[];

  @Prop({ type: [String] })
  styleTags: string[];

  @Prop({ type: [String] })
  occasionTags: string[];

  @Prop({ type: [String] })
  seasonTags: string[];

  @Prop({ type: [String] })
  colorTags: string[];

  @Prop({ enum: ['public', 'followers', 'private'], default: 'public' })
  visibility: string;

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ default: 0 })
  commentsCount: number;

  @Prop({ default: 0 })
  savesCount: number;

  @Prop({ enum: ['pending', 'approved', 'flagged', 'removed'], default: 'approved' })
  moderationStatus: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
