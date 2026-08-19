import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WardrobeItem } from '../wardrobe/schemas/wardrobe-item.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectModel(WardrobeItem.name) private wardrobeModel: Model<WardrobeItem>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Running seeder check...');
    
    // Find users
    const users = await this.userModel.find();
    if (users.length === 0) return;

    for (const user of users) {
      const itemCount = await this.wardrobeModel.countDocuments({ userId: user._id });
      if (itemCount === 0) {
        this.logger.log(`Seeding wardrobe items for user ${user.email}`);
        
        const seedItems = [
          {
            name: 'Silk Blazer',
            category: 'outerwear',
            imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80',
            userId: user._id,
          },
          {
            name: 'Pleated Trousers',
            category: 'bottoms',
            imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80',
            userId: user._id,
          },
          {
            name: 'Cashmere Knit',
            category: 'tops',
            imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80',
            userId: user._id,
          }
        ];

        await this.wardrobeModel.insertMany(seedItems);
      }
    }
  }
}
