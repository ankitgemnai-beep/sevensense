import { Injectable, Logger } from '@nestjs/common';
import { WardrobeService } from '../wardrobe/wardrobe.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RecommendationsService {
  private readonly logger = new Logger(RecommendationsService.name);

  constructor(
    private wardrobeService: WardrobeService,
    private configService: ConfigService,
  ) {}

  async getTodaysLook(userId: string, weather: string = 'generally mild', occasion: string = 'Everyday') {
    const wardrobe = await this.wardrobeService.getUserWardrobe(userId);
    
    // Default fallback if AI fails or wardrobe is empty
    const fallbackResponse = this.getFallbackOutfit(wardrobe, weather, occasion);

    if (!wardrobe || wardrobe.length < 2) {
      return fallbackResponse;
    }

    const apiUrl = this.configService.get<string>('AI_API_URL');
    const apiKey = this.configService.get<string>('AI_API_KEY');

    if (!apiUrl || !apiKey) {
      this.logger.warn('AI API configuration missing, using fallback.');
      return fallbackResponse;
    }

    try {
      // Simplify the wardrobe payload to save tokens
      const simplifiedWardrobe = wardrobe.map(item => ({
        id: item._id.toString(),
        name: item.name,
        category: item.category,
        color: (item as any).colors || (item as any).color || 'unknown'
      }));

      const prompt = `
        You are a high-end personal fashion stylist AI. 
        Your task is to create an outfit from the user's provided wardrobe items.
        The current weather is ${weather} and the occasion is ${occasion}.
        
        User's Wardrobe JSON:
        ${JSON.stringify(simplifiedWardrobe)}
        
        Rules:
        1. Select 2 to 4 items from the wardrobe to form a cohesive, stylish outfit.
        2. Ensure you have a top and a bottom, or a one-piece (if available). 
        3. Do NOT make up items. ONLY use the provided item IDs.
        4. Return your response STRICTLY as a raw JSON object with the following schema, and no markdown formatting or backticks:
        {
          "styleName": "A catchy name for the aesthetic (e.g., 'Minimalist Core', 'Urban Edge')",
          "score": 96,
          "weatherSuitability": "Explanation of why this matches ${weather}",
          "occasion": "${occasion}",
          "explanation": "A 2-sentence summary of why you chose this look.",
          "reasons": ["Reason 1", "Reason 2", "Reason 3"],
          "itemIds": ["id1", "id2"]
        }
      `;

      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json',
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API responded with status: ${response.status}`);
      }

      const data = await response.json();
      let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!aiText) throw new Error('Invalid Gemini API response format');

      // Strip markdown block if accidentally included despite instructions
      if (aiText.startsWith('\`\`\`json')) {
        aiText = aiText.replace(/\`\`\`json\n?/, '').replace(/\`\`\`\n?$/, '');
      } else if (aiText.startsWith('\`\`\`')) {
        aiText = aiText.replace(/\`\`\`\n?/, '').replace(/\`\`\`\n?$/, '');
      }

      const aiOutfit = JSON.parse(aiText);

      // Map IDs back to full wardrobe items
      const selectedItems = (aiOutfit.itemIds || [])
        .map(id => wardrobe.find(w => w._id.toString() === id))
        .filter(item => item)
        .map(item => ({
          id: item._id.toString(),
          name: item.name,
          category: item.category,
          imageUrl: item.imageUrl,
        }));

      if (selectedItems.length === 0) {
        throw new Error('AI returned no valid matching items');
      }

      // Map aesthetic to a generic lifestyle photo for the hero banner (No Cloth Image in Look)
      let heroImage = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop';
      const styleNameLower = (aiOutfit.styleName || '').toLowerCase();
      
      if (styleNameLower.includes('street') || styleNameLower.includes('urban')) {
        heroImage = 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=600';
      } else if (styleNameLower.includes('formal') || styleNameLower.includes('elegant') || styleNameLower.includes('suit')) {
        heroImage = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600';
      } else if (styleNameLower.includes('casual') || styleNameLower.includes('minimal')) {
        heroImage = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600';
      } else if (styleNameLower.includes('sport') || styleNameLower.includes('active')) {
        heroImage = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600';
      }

      return {
        id: 'look-' + Date.now(),
        styleName: aiOutfit.styleName || 'Curated Look',
        score: aiOutfit.score || 95,
        weatherSuitability: aiOutfit.weatherSuitability || 'Mild, 20°C',
        occasion: aiOutfit.occasion || 'Everyday',
        explanation: aiOutfit.explanation || 'AI curated this specifically for you based on your wardrobe.',
        reasons: aiOutfit.reasons || ['Versatile base', 'Comfortable fit'],
        imageUrl: heroImage,
        items: selectedItems,
        alternatives: []
      };

    } catch (error) {
      this.logger.error(`Error generating AI recommendation: ${error.message}`);
      return fallbackResponse;
    }
  }

  private getFallbackOutfit(wardrobe: any[], weather: string, occasion: string) {
    const selectedItems = wardrobe.slice(0, 2).map(item => ({
      id: item._id.toString(),
      name: item.name,
      category: item.category,
      imageUrl: item.imageUrl,
    }));

    if (selectedItems.length === 0) {
      selectedItems.push({
        id: 'fallback-1',
        name: 'Classic White Tee',
        category: 'tops',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80',
      });
    }

    return {
      id: 'look-' + Date.now(),
      styleName: 'Minimalist Core',
      score: 96,
      weatherSuitability: `Perfect for ${weather}`,
      occasion: occasion,
      explanation: 'Our stylists selected this timeless combination from your collection to suit the climate and occasion perfectly.',
      reasons: ['Versatile base', `Appropriate for ${weather}`, `Fits a ${occasion} setting`],
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600', // Standard generic stock photo
      items: selectedItems,
      alternatives: []
    };
  }
}
