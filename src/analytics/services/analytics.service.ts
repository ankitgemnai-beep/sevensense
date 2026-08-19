import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnalyticsEvent } from '../schemas/analytics-event.schema';

@Injectable()
export class AnalyticsService {
  constructor(@InjectModel(AnalyticsEvent.name) private analyticsModel: Model<AnalyticsEvent>) {}

  async trackEvent(userId: string, eventName: string, payload: any): Promise<void> {
    await this.analyticsModel.create({ userId, eventName, payload });
  }

  async getWardrobeMetrics(userId: string, wardrobe: any[]): Promise<any> {
    // Simulated metrics calculation
    const totalValue = wardrobe.reduce((acc, item) => acc + (item.price || 0), 0);
    const utilization = 45; // 45% of wardrobe used in last 30 days
    
    // Assumes items scheduled in Planner count as worn
    return {
      wardrobeValue: totalValue,
      utilizationPercentage: utilization,
      costPerWearAvg: 12.50, // mock calculation
      dominantStyle: 'Minimalist'
    };
  }
}
