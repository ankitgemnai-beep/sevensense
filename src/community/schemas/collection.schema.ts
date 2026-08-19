import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Collection extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Post' }] })
  postRefs: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
  productRefs: Types.ObjectId[];

  @Prop({ enum: ['public', 'private'], default: 'private' })
  visibility: string;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
