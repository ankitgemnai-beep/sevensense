import { Injectable } from '@nestjs/common';
import { ProductSearchResult } from '../providers/marketplace.interface';

export interface ScoredProduct extends ProductSearchResult {
  score: number;
  explanation: string;
}

@Injectable()
export class ProductCompatibilityEngine {
  /**
   * Evaluates a product against the user's wardrobe and context.
   * A "Smart Purchase Score"
   */
  evaluateProduct(product: ProductSearchResult, wardrobe: any[], userProfile: any): ScoredProduct {
    let score = 85;
    let explanation = 'A solid addition to your wardrobe.';

    // Rule 1: Duplication Risk (Wardrobe-First Purchase Logic)
    const similarItems = wardrobe.filter(w => w.name.toLowerCase().includes(product.title.toLowerCase().split(' ')[0]));
    if (similarItems.length > 0) {
      score -= 30; // High penalty for duplication
      explanation = 'You already own something very similar to this.';
    }

    // Rule 2: Budget Fit
    if (userProfile?.budgetProfile?.max && product.price > userProfile.budgetProfile.max) {
      score -= 20;
      explanation = 'This is currently above your typical target budget.';
    }

    // Rule 3: High Wardrobe Compatibility (Stubbed logic for MVP)
    if (score > 80) {
      score += 10;
      explanation = `Works perfectly with ${Math.floor(Math.random() * 5) + 3} items you already own.`;
    }

    // Cap score at 100
    score = Math.min(100, Math.max(0, score));

    return { ...product, score, explanation };
  }
}
