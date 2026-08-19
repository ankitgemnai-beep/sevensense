import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { AIService } from '../ai/ai.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private aiService: AIService,
    private usersService: UsersService,
  ) {}

  async addProducts(products: any[]) {
    // Upsert products to avoid duplicates by externalId
    const bulkOps = products.map((p) => ({
      updateOne: {
        filter: { externalId: p.externalId || p.url },
        update: { $set: { ...p, externalId: p.externalId || p.url, productUrl: p.url } },
        upsert: true,
      },
    }));
    if (bulkOps.length > 0) {
      await this.productModel.bulkWrite(bulkOps);
    }
    return { success: true, count: products.length };
  }

  async getShoppingIntelligence(userId: string) {
    // 1. Fetch user profile
    const user = await this.usersService.findById(userId);
    const styleDNA = user?.fashionDNA?.styleIdentity?.join(', ') || 'casual, versatile';
    const budget = user?.budgetProfile?.range || 'any';

    // 2. Fetch all available products from DB (limit 50 for performance), newest first
    const availableProducts = await this.productModel.find().sort({ _id: -1 }).limit(50).exec();
    
    if (availableProducts.length === 0) {
      // Fallback if DB is empty
      return [
        { brand: 'System', name: 'No products in database', price: '₹0', tag: 'EMPTY', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea', url: '#' }
      ];
    }

    // 3. Ask AI to curate and rank the top 6 products based on user profile
    const prompt = `
You are an expert AI fashion stylist.
User Style DNA: ${styleDNA}
User Budget: ${budget}

Here are the available products in the shop:
${availableProducts.map(p => `ID: ${p.externalId} | Brand: ${p.brand} | Name: ${p.title || (p as any).name} | Price: ${p.price || (p as any).price}`).join('\n')}

Select the top 6 products that best fit this user. Return ONLY a JSON array of objects. Each object must have:
- brand (string)
- name (string)
- price (string, including currency)
- tag (string, e.g. "WARDROBE GAP", "TRENDING", "PERFECT MATCH")
- image (string, the exact image URL from the product)
- url (string, the productUrl)

Return the JSON array without markdown formatting.
`;

    try {
      const aiResponse = await this.aiService.generateResponse(prompt);
      
      // Parse JSON from AI response
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        let curated = JSON.parse(jsonMatch[0]);
        
        // Map the curated items back to their real images/urls from the DB just to be safe
        curated = curated.map((c: any) => {
          const dbItem = availableProducts.find((p: any) => 
            p.externalId === c.externalId || 
            (p.title || p.name) === c.name || 
            p.brand === c.brand
          );
          if (dbItem) {
            c.image = (dbItem as any).image || dbItem.images?.[0] || c.image;
            c.url = dbItem.productUrl || (dbItem as any).url || c.url;
          }
          return c;
        });
        
        return curated;
      }
    } catch (e) {
      console.error('AI Curating failed, returning raw products', e);
    }

    // Fallback: return raw products formatted for the frontend
    return availableProducts.slice(0, 8).map((p: any) => {
      return {
        brand: p.brand || 'Brand',
        name: p.title || p.name,
        price: p.price ? "₹" + p.price : '₹...',
        tag: p.tag || (p.styleTags && p.styleTags[0]) || 'CURATED',
        image: p.image || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
        url: p.productUrl || p.url,
      };
    });
  }
}
