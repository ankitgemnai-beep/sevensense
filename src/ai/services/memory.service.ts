import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AIMemory } from '../schemas/ai-memory.schema';

@Injectable()
export class MemoryService {
  constructor(@InjectModel(AIMemory.name) private memoryModel: Model<AIMemory>) {}

  async recordFeedback(userId: string, targetId: string, feedbackType: string, direction: 'positive' | 'negative'): Promise<void> {
    // Basic implementation of AI Memory rule #26 & #53
    // E.g., if user rejects an outfit because of "too bright color", we record it.
    
    // In MVP, we just create a new memory entry.
    // In production, we would update existing confidences based on frequency.
    
    await this.memoryModel.create({
      userId,
      preferenceType: feedbackType,
      value: targetId,
      confidence: 0.5, // Initial confidence
      source: 'behavioral',
      isActive: true,
    });
  }

  async getUserMemories(userId: string): Promise<AIMemory[]> {
    return this.memoryModel.find({ userId, isActive: true }).lean().exec() as any;
  }
}
