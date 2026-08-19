export interface LLMPromptConfig {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json';
}

export interface LLMResponse {
  text: string;
  json?: any;
  usage?: { promptTokens: number; completionTokens: number; totalTokens: number };
  model: string;
}

export interface LLMProvider {
  generateCompletion(config: LLMPromptConfig): Promise<LLMResponse>;
}
