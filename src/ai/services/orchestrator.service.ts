import { Injectable } from '@nestjs/common';
import { DailyStylistService } from './daily-stylist.service';

@Injectable()
export class OrchestratorService {
  constructor(private dailyStylist: DailyStylistService) {}

  /**
   * Routes the AI intent to the correct underlying service.
   */
  async processIntent(userId: string, intent: 'daily_style' | 'semantic_search' | 'wardrobe_gap', payload: any) {
    switch (intent) {
      case 'daily_style':
        return this.dailyStylist.generateDailyRecommendation(userId, payload.lat || 0, payload.lon || 0);
      
      case 'semantic_search':
        // Future: route to semantic search engine
        return { message: 'Semantic search not yet implemented.' };
        
      case 'wardrobe_gap':
        // Future: route to GapAnalysisService
        return { message: 'Gap analysis not yet implemented.' };
        
      default:
        throw new Error('Unknown AI Intent');
    }
  }
}
