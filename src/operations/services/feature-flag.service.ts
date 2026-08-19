import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeatureFlag } from '../schemas/feature-flag.schema';

@Injectable()
export class FeatureFlagService {
  private readonly logger = new Logger(FeatureFlagService.name);

  constructor(@InjectModel(FeatureFlag.name) private featureFlagModel: Model<FeatureFlag>) {}

  async isEnabled(key: string, userId?: string): Promise<boolean> {
    const flag = await this.featureFlagModel.findOne({ key });
    
    // Emergency Kill Switch Logic
    if (key === 'AI_KILL_SWITCH' && flag?.isEnabled) {
      this.logger.warn('AI KILL SWITCH IS ACTIVE! Aborting AI operation.');
      return true;
    }

    if (!flag) return false;
    if (!flag.isEnabled) return false;

    // Phased rollout logic
    if (flag.rolloutPercentage < 100 && userId) {
      // Deterministic check based on user ID and rollout percentage
      const userHash = this.hashString(userId);
      return (userHash % 100) < flag.rolloutPercentage;
    }

    return true;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; 
    }
    return Math.abs(hash);
  }
}
