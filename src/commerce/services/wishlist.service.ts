import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WishlistItem } from '../schemas/wishlist-item.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(WishlistItem.name) private wishlistModel: Model<WishlistItem>
  ) {}

  async addItem(userId: string, productId: string, currentPrice: number, collectionId: string = 'General'): Promise<WishlistItem> {
    return this.wishlistModel.create({
      userId,
      productReference: productId,
      savedPrice: currentPrice,
      currentPrice,
      collectionId,
    });
  }

  async getUserWishlist(userId: string): Promise<WishlistItem[]> {
    return this.wishlistModel.find({ userId }).populate('productReference').lean().exec() as any;
  }

  async trackPriceDrops(): Promise<void> {
    // In production, a CRON job would iterate through WishlistItems,
    // fetch the latest price via MarketplaceProvider.getPrice(),
    // and trigger notifications if the price drops.
  }
}
