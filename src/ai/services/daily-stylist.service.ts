import { Injectable, Logger, Inject } from '@nestjs/common';
import { ContextBuilderService } from './context-builder.service';
import { CandidateGeneratorService } from './candidate-generator.service';
import { CompatibilityEngine } from './compatibility.engine';
import { WeatherProvider } from '../providers/weather.provider.interface';
import { LLMProvider } from '../providers/llm.provider.interface';

@Injectable()
export class DailyStylistService {
  private readonly logger = new Logger(DailyStylistService.name);

  constructor(
    private contextBuilder: ContextBuilderService,
    private candidateGenerator: CandidateGeneratorService,
    private compatibilityEngine: CompatibilityEngine,
    @Inject('WeatherProvider') private weatherProvider: WeatherProvider,
    @Inject('LLMProvider') private llmProvider: LLMProvider,
  ) {}

  async generateDailyRecommendation(userId: string, lat: number, lon: number) {
    try {
      // 1. Context Gathering
      const weather = await this.weatherProvider.getCurrentWeather(lat, lon);
      const occasion = 'casual_work'; // Default for MVP, ideally passed from client/calendar
      const context = await this.contextBuilder.buildContext(userId, weather, occasion);

      // 2. Candidate Generation & Filtering
      const candidates = this.candidateGenerator.generateCandidates(context);

      // 3. Scoring Engine
      const scoredCandidates = this.compatibilityEngine.scoreCandidates(candidates, context);
      
      const primaryCandidate = scoredCandidates[0];
      const alternatives = scoredCandidates.slice(1, 3);

      // 4. Explainable AI via LLM
      const itemNames = primaryCandidate.items.map(i => i.name).join(', ');
      
      const promptConfig = {
        systemPrompt: 'You are an elite AI personal fashion stylist. Explain briefly why this outfit works for the user.',
        userPrompt: `Weather: ${weather.temperatureC}°C, ${weather.condition}. Occasion: ${occasion}. Outfit: ${itemNames}. Give 3 concise reasons why this works.`,
        responseFormat: 'json' as const,
      };

      const explanationResponse = await this.llmProvider.generateCompletion(promptConfig);
      
      let reasons = ["Matches today's context perfectly.", "Uses high-rotation versatile pieces."];
      if (explanationResponse.json && explanationResponse.json.reasons) {
        reasons = explanationResponse.json.reasons;
      }

      // 5. Structure Final Output
      return {
        id: 'outfit-' + Date.now(),
        styleName: 'AI Contextual Pick',
        score: primaryCandidate.score,
        weatherSuitability: `${weather.condition}, ${weather.temperatureC}°C`,
        occasion: occasion,
        explanation: 'Expertly selected by the Seven Sense Engine.',
        reasons: reasons,
        imageUrl: primaryCandidate.items[0]?.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80',
        items: primaryCandidate.items,
        alternatives: alternatives.map(alt => ({ id: alt.id, score: alt.score })),
      };

    } catch (error) {
      this.logger.error('Failed to generate daily recommendation', error);
      throw error;
    }
  }
}
