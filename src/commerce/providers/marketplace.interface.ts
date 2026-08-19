export interface ProductSearchQuery {
  queryType: string;
  category?: string;
  occasion?: string;
  budget?: { max: number; min?: number };
  style?: string[];
  color?: string;
  keyword?: string;
}

export interface ProductSearchResult {
  externalId: string;
  title: string;
  price: number;
  imageUrl: string;
  affiliateUrl: string;
  brand?: string;
}

export interface MarketplaceProvider {
  searchProducts(query: ProductSearchQuery): Promise<ProductSearchResult[]>;
  getProduct(productId: string): Promise<any>;
  getPrice(productId: string): Promise<{ price: number; discount: number }>;
  getAvailability(productId: string): Promise<boolean>;
  createAffiliateUrl(productId: string): Promise<string>;
}
