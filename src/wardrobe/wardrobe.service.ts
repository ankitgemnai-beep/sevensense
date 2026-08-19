import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WardrobeItem } from './schemas/wardrobe-item.schema';
import { CloudinaryService } from '../media/cloudinary.service';

@Injectable()
export class WardrobeService {
  constructor(
    @InjectModel(WardrobeItem.name) private wardrobeModel: Model<WardrobeItem>,
    private cloudinaryService: CloudinaryService
  ) {}

  async getUserWardrobe(userId: string) {
    return this.wardrobeModel.find({ userId }).lean().exec();
  }

  async getWardrobeSnapshot(userId: string) {
    const items = await this.wardrobeModel.find({ userId }).limit(10).lean().exec();
    return items.map(item => ({
      id: item._id,
      name: item.name,
      category: item.category,
      image: item.imageUrl,
    }));
  }

  async createWardrobeItem(userId: string, data: any) {
    let imageUrl = data.imageUrl;
    
    if (data.base64Image) {
      const uploadResult = await this.cloudinaryService.uploadImage(data.base64Image);
      imageUrl = uploadResult.secure_url;
    }

    const newItem = new this.wardrobeModel({
      userId,
      name: data.name || 'New Item',
      category: data.category || 'misc',
      imageUrl: imageUrl,
    });
    return newItem.save();
  }
}
