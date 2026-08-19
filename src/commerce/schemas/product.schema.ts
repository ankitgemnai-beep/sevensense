import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  provider: string; // e.g., 'amazon', 'flipkart'

  @Prop({ required: true, index: true })
  externalId: string;

  @Prop()
  brand: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  subcategory: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  colors: string[];

  @Prop({ type: [String], default: [] })
  materials: string[];

  @Prop({ type: [String], default: [] })
  sizes: string[];

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: 'USD' })
  currency: string;

  @Prop()
  discount: number;

  @Prop()
  rating: number;

  @Prop()
  seller: string;

  @Prop({ default: true })
  availability: boolean;

  @Prop({ required: true })
  affiliateUrl: string;

  @Prop()
  productUrl: string;

  @Prop({ type: [String], default: [] })
  styleTags: string[];

  @Prop()
  embeddingId: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
