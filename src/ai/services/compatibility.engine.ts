import { Injectable } from '@nestjs/common';
import { OutfitCandidate } from './candidate-generator.service';
import { FashionContext } from './context-builder.service';
import { ColorHarmonyEngine } from './color-harmony.engine';

export interface ScoredCandidate extends OutfitCandidate {
  score: number;
  breakdown: {
    weather: number;
    occasion: number;
    color: number;
    rotation: number;
  };
}

@Injectable()
export class CompatibilityEngine {
  constructor(private colorHarmony: ColorHarmonyEngine) {}

  scoreCandidates(candidates: OutfitCandidate[], context: FashionContext): ScoredCandidate[] {
    return candidates.map(candidate => {
      // 1. Weather Fit (0-100)
      let weatherScore = 100;
      if (context.weather.temperatureC > 25 && candidate.items.some(i => ['outerwear', 'sweater'].includes(i.category.toLowerCase()))) {
        weatherScore = 40; // Penalize heavy layers in heat
      }

      // 2. Occasion Fit (0-100)
      let occasionScore = 100;
      const formalOccasions = ['business_meeting', 'wedding', 'formal_dinner'];
      const hasFormalItem = candidate.items.some(i => ['blazer', 'trousers', 'oxfords'].includes(i.subcategory?.toLowerCase()));
      if (formalOccasions.includes(context.occasion) && !hasFormalItem) {
        occasionScore = 50; // Penalize casual for formal
      }

      // 3. Color Harmony (0-100)
      const colors = candidate.items.flatMap(i => i.colors || []);
      const colorScore = this.colorHarmony.evaluatePalette(colors);

      // 4. Rotation (0-100)
      let rotationScore = 100;
      candidate.items.forEach(i => {
        if (i.wearCount > 10) rotationScore -= 5; // Slight penalization for over-worn items
      });

      const overallScore = Math.round((weatherScore * 0.3) + (occasionScore * 0.4) + (colorScore * 0.2) + (rotationScore * 0.1));

      return {
        ...candidate,
        score: overallScore,
        breakdown: { weather: weatherScore, occasion: occasionScore, color: colorScore, rotation: rotationScore }
      };
    }).sort((a, b) => b.score - a.score); // Sort by highest score first
  }
}
