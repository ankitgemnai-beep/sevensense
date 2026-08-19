import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { Product, ProductSchema } from './schemas/product.schema';
import { WishlistItem, WishlistItemSchema } from './schemas/wishlist-item.schema';
import { TryOnSession, TryOnSessionSchema } from './schemas/try-on-session.schema';

import { ProductSearchService } from './services/product-search.service';
import { ProductCompatibilityEngine } from './services/product-compatibility.engine';
import { WishlistService } from './services/wishlist.service';
import { ScreenshotAnalysisService } from './services/screenshot-analysis.service';

import { AmazonProvider } from './providers/amazon.provider';
import { MockTryOnProvider } from './providers/mock-try-on.provider';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: WishlistItem.name, schema: WishlistItemSchema },
      { name: TryOnSession.name, schema: TryOnSessionSchema },
    ]),
  ],
  providers: [
    ProductSearchService,
    ProductCompatibilityEngine,
    WishlistService,
    ScreenshotAnalysisService,
    {
      provide: 'MarketplaceProvider',
      useClass: AmazonProvider,
    },
    {
      provide: 'TryOnProvider',
      useClass: MockTryOnProvider,
    },
  ],
  exports: [ProductSearchService, WishlistService, ScreenshotAnalysisService],
})
export class CommerceModule {}
