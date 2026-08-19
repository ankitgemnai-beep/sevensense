import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription } from '../schemas/subscription.schema';

@Injectable()
export class EntitlementService {
  private readonly logger = new Logger(EntitlementService.name);

  // In production, these limits are loaded from a ConfigurationService
  private readonly limits = {
    FREE: { aiGenerations: 10, tryOns: 2, premiumStylist: false },
    PLUS: { aiGenerations: 50, tryOns: 10, premiumStylist: true },
    PREMIUM: { aiGenerations: 9999, tryOns: 9999, premiumStylist: true }
  };

  constructor(@InjectModel(Subscription.name) private subscriptionModel: Model<Subscription>) {}

  async hasFeature(userId: string, featureId: keyof typeof this.limits.FREE): Promise<boolean> {
    const sub = await this.subscriptionModel.findOne({ userId });
    const plan = sub?.status === 'active' ? sub.planId : 'FREE';
    
    // Explicitly cast to unknown then boolean to bypass typescript strict index issues for mock
    return !!(this.limits[plan as keyof typeof this.limits] as any)[featureId];
  }

  async getLimit(userId: string, limitId: keyof typeof this.limits.FREE): Promise<number> {
    const sub = await this.subscriptionModel.findOne({ userId });
    const plan = sub?.status === 'active' ? sub.planId : 'FREE';
    
    return (this.limits[plan as keyof typeof this.limits] as any)[limitId] || 0;
  }
}
