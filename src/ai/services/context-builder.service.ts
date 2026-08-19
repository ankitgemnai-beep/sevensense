import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';
import { WardrobeItem } from '../../wardrobe/schemas/wardrobe-item.schema';
import { WeatherData } from '../providers/weather.provider.interface';

export interface FashionContext {
  userProfile: Partial<User>;
  wardrobe: WardrobeItem[];
  weather: WeatherData;
  occasion: string;
}

@Injectable()
export class ContextBuilderService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(WardrobeItem.name) private wardrobeModel: Model<WardrobeItem>,
  ) {}

  async buildContext(userId: string, weatherData: WeatherData, occasion: string): Promise<FashionContext> {
    const user = await this.userModel.findById(userId).lean().exec();
    
    // Only retrieve active items, exclude strictly out-of-season items if metadata supports it.
    // In this MVP, we pull all items but the CandidateGenerator will filter them.
    const wardrobe = await this.wardrobeModel.find({ userId }).lean().exec();

    // Strip sensitive fields before passing to AI Context
    const safeUser = {
      fashionDNA: user.fashionDNA,
      fitPreference: user.fitPreference,
      lifestyle: user.lifestyle,
      stylePreferences: user.stylePreferences,
      budgetProfile: user.budgetProfile,
    };

    return {
      userProfile: safeUser,
      wardrobe: wardrobe as any,
      weather: weatherData,
      occasion,
    };
  }
}
