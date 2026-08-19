import { Injectable } from '@nestjs/common';

@Injectable()
export class ColorHarmonyEngine {
  /**
   * Evaluates how well a set of colors work together.
   * A real implementation would use color theory (analogous, complementary, monochromatic).
   */
  evaluatePalette(colors: string[]): number {
    if (!colors || colors.length === 0) return 100;
    
    let score = 100;
    const uniqueColors = new Set(colors.map(c => c.toLowerCase()));
    
    // Penalize too many clashing dominant colors
    if (uniqueColors.size > 4) {
      score -= 20; // Too busy
    }

    // Reward neutral palettes
    const neutrals = ['black', 'white', 'gray', 'navy', 'beige', 'khaki'];
    let neutralCount = 0;
    uniqueColors.forEach(c => {
      if (neutrals.includes(c)) neutralCount++;
    });

    if (neutralCount >= 2) {
      score = Math.min(100, score + 10);
    }

    return score;
  }
}
