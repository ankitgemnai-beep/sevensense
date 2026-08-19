import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TravelPlannerService {
  private readonly logger = new Logger(TravelPlannerService.name);

  /**
   * Evaluates a trip and generates an optimized packing list.
   * Maximizes combinations, minimizes items.
   */
  generateCapsule(destination: string, days: number, wardrobe: any[]): any {
    this.logger.log(`Generating travel capsule for ${days} days in ${destination}`);
    
    // Simulate Weather context
    const isHot = true; 

    // Filter Wardrobe (Mock logic)
    const tops = wardrobe.filter(w => w.category === 'tops').slice(0, Math.min(3, days));
    const bottoms = wardrobe.filter(w => w.category === 'bottoms').slice(0, 2);
    const shoes = wardrobe.filter(w => w.category === 'shoes').slice(0, 2);
    
    const packingList = [...tops, ...bottoms, ...shoes];
    const combinations = tops.length * bottoms.length * shoes.length;

    return {
      destination,
      days,
      weather: 'Hot, Occasional Rain',
      packingList,
      metrics: {
        totalItems: packingList.length,
        possibleCombinations: combinations
      },
      missingEssentials: [
        { item: 'Lightweight Overshirt', reason: 'For cooler evenings' }
      ]
    };
  }
}
