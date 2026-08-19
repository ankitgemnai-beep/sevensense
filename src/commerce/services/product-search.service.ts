import { Injectable, Logger } from '@nestjs/common';
import { MarketplaceProvider, ProductSearchQuery } from '../providers/marketplace.interface';
import { ProductCompatibilityEngine, ScoredProduct } from './product-compatibility.engine';

@Injectable()
export class ProductSearchService {
  private readonly logger = new Logger(ProductSearchService.name);

  constructor(
    private marketplaceProvider: MarketplaceProvider,
    private compatibilityEngine: ProductCompatibilityEngine
  ) {}

  async searchAndRank(query: ProductSearchQuery, wardrobe: any[], userProfile: any): Promise<ScoredProduct[]> {
    this.logger.log(`Executing Search: ${query.queryType}`);
    
    // 1. Fetch raw results from provider
    const rawResults = await this.marketplaceProvider.searchProducts(query);
    
    // 2. Score them using Wardrobe-First Logic
    const scoredResults = rawResults.map(product => 
      this.compatibilityEngine.evaluateProduct(product, wardrobe, userProfile)
    );

    // 3. Sort by "Smart Purchase Score" (highest first)
    return scoredResults.sort((a, b) => b.score - a.score);
  }
}
