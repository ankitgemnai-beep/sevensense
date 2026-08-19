import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('AI_API_KEY') || process.env.AI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      this.logger.warn('AI_API_KEY is missing. AI generation will fail.');
    }
  }

  async generateResponse(prompt: string): Promise<string> {
    if (!this.genAI) {
      this.logger.error('Gemini API key not configured.');
      throw new Error('AI Service not configured');
    }
    
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      this.logger.error('Failed to generate response', error);
      throw error;
    }
  }
}
