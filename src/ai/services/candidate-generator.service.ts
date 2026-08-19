import { Injectable } from '@nestjs/common';
import { FashionContext } from './context-builder.service';
import { WardrobeItem } from '../../wardrobe/schemas/wardrobe-item.schema';

export interface OutfitCandidate {
  id: string;
  items: WardrobeItem[];
}

@Injectable()
export class CandidateGeneratorService {
  /**
   * Generates a list of possible outfit combinations based on the context.
   * This reduces the search space for the LLM or compatibility engine.
   */
  generateCandidates(context: FashionContext): OutfitCandidate[] {
    const { wardrobe, weather, occasion } = context;
    
    // 1. Group wardrobe by category
    const tops = wardrobe.filter(i => i.category.toLowerCase() === 'tops');
    const bottoms = wardrobe.filter(i => i.category.toLowerCase() === 'bottoms');
    const outerwear = wardrobe.filter(i => i.category.toLowerCase() === 'outerwear');
    const shoes = wardrobe.filter(i => i.category.toLowerCase() === 'shoes');

    // 2. Initial weather filtering (e.g., remove heavy coats if hot)
    const isHot = weather.temperatureC > 25;
    const isCold = weather.temperatureC < 15;

    let validTops = tops;
    let validOuterwear = outerwear;

    if (isHot) {
      validOuterwear = []; // No heavy layers
    }

    // 3. Build combinatorics (Max 10 for performance)
    const candidates: OutfitCandidate[] = [];
    
    for (const top of validTops) {
      for (const bottom of bottoms) {
        for (const shoe of shoes) {
          const candidateItems = [top, bottom, shoe];
          
          if (!isHot && validOuterwear.length > 0) {
            candidateItems.push(validOuterwear[Math.floor(Math.random() * validOuterwear.length)]);
          }

          candidates.push({
            id: `cand-${candidates.length + 1}`,
            items: candidateItems,
          });

          if (candidates.length >= 5) break; // Limit for memory/speed in MVP
        }
        if (candidates.length >= 5) break;
      }
      if (candidates.length >= 5) break;
    }

    // Fallback if no combinations possible
    if (candidates.length === 0) {
      candidates.push({ id: 'fallback', items: wardrobe.slice(0, 3) });
    }

    return candidates;
  }
}
