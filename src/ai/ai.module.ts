import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AIService } from './ai.service';
import { OrchestratorService } from './services/orchestrator.service';
import { DailyStylistService } from './services/daily-stylist.service';
import { ContextBuilderService } from './services/context-builder.service';
import { CandidateGeneratorService } from './services/candidate-generator.service';
import { CompatibilityEngine } from './services/compatibility.engine';
import { ColorHarmonyEngine } from './services/color-harmony.engine';
import { GapAnalysisService } from './services/gap-analysis.service';
import { MemoryService } from './services/memory.service';

import { OpenAIProvider } from './providers/openai.provider';
import { MockWeatherProvider } from './providers/mock-weather.provider';

import { AIMemory, AIMemorySchema } from './schemas/ai-memory.schema';
import { GeneratedOutfit, GeneratedOutfitSchema } from './schemas/generated-outfit.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { WardrobeItem, WardrobeItemSchema } from '../wardrobe/schemas/wardrobe-item.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: AIMemory.name, schema: AIMemorySchema },
      { name: GeneratedOutfit.name, schema: GeneratedOutfitSchema },
      { name: User.name, schema: UserSchema },
      { name: WardrobeItem.name, schema: WardrobeItemSchema },
    ]),
  ],
  providers: [
    AIService,
    OrchestratorService,
    DailyStylistService,
    ContextBuilderService,
    CandidateGeneratorService,
    CompatibilityEngine,
    ColorHarmonyEngine,
    GapAnalysisService,
    MemoryService,
    {
      provide: 'LLMProvider',
      useClass: OpenAIProvider,
    },
    {
      provide: 'WeatherProvider',
      useClass: MockWeatherProvider,
    },
  ],
  exports: [OrchestratorService, MemoryService, AIService],
})
export class AIModule {}
