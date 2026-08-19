import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LLMProvider, LLMPromptConfig, LLMResponse } from './llm.provider.interface';
import axios from 'axios';

@Injectable()
export class OpenAIProvider implements LLMProvider {
  private readonly logger = new Logger(OpenAIProvider.name);
  private apiKey: string;
  private defaultModel = 'gpt-4o-mini';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
    if (!this.apiKey) {
      this.logger.warn('OPENAI_API_KEY is not set. OpenAI calls will fail.');
    }
  }

  async generateCompletion(config: LLMPromptConfig): Promise<LLMResponse> {
    if (!this.apiKey) {
      // Stub response for development if no key is provided
      this.logger.warn('Returning stubbed LLM response due to missing API key.');
      return {
        text: 'Stubbed response',
        json: config.responseFormat === 'json' ? {} : undefined,
        model: 'stub',
      };
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.defaultModel,
          messages: [
            { role: 'system', content: config.systemPrompt },
            { role: 'user', content: config.userPrompt }
          ],
          temperature: config.temperature ?? 0.7,
          max_tokens: config.maxTokens,
          response_format: config.responseFormat === 'json' ? { type: 'json_object' } : undefined,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const message = response.data.choices[0].message.content;
      let jsonPayload = undefined;

      if (config.responseFormat === 'json') {
        try {
          jsonPayload = JSON.parse(message);
        } catch (e) {
          this.logger.error('Failed to parse JSON from LLM', e);
        }
      }

      return {
        text: message,
        json: jsonPayload,
        usage: response.data.usage,
        model: response.data.model,
      };
    } catch (error) {
      this.logger.error('LLM API Error', error);
      throw new Error('Failed to generate completion from OpenAI');
    }
  }
}
