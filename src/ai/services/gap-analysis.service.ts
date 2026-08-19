import { Injectable } from '@nestjs/common';

@Injectable()
export class GapAnalysisService {
  /**
   * Evaluates the wardrobe and identifies high-value missing items based on priority and usage.
   */
  analyzeGaps(wardrobe: any[], lifestyle: string): any[] {
    const categories = wardrobe.map(i => i.category.toLowerCase());
    const gaps = [];

    // Basic rule-based gap analysis (can be augmented with LLM later)
    if (!categories.includes('outerwear') && lifestyle === 'professional') {
      gaps.push({
        item: 'Structured Blazer',
        priority: 'High',
        reason: 'Essential for a professional lifestyle to elevate everyday looks.',
      });
    }

    if (!categories.includes('sneakers')) {
      gaps.push({
        item: 'Minimalist White Sneakers',
        priority: 'Medium',
        reason: 'Highly versatile base layer for casual and smart-casual outfits.',
      });
    }

    return gaps;
  }
}
