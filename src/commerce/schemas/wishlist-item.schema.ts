import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class WishlistItem extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productReference: Types.ObjectId;

  @Prop()
  savedPrice: number;

  @Prop()
  currentPrice: number;

  @Prop()
  targetPrice: number;

  @Prop({ enum: ['high', 'medium', 'low'], default: 'medium' })
  priority: string;

  @Prop()
  notes: string;

  @Prop()
  collectionId: string; // e.g., 'Wedding', 'Sneakers'
}

export const WishlistItemSchema = SchemaFactory.createForClass(WishlistItem);
