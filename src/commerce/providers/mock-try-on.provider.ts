import { Injectable, Logger } from '@nestjs/common';
import { TryOnProvider, TryOnInput, TryOnJob } from './try-on.interface';

@Injectable()
export class MockTryOnProvider implements TryOnProvider {
  private readonly logger = new Logger(MockTryOnProvider.name);
  
  // In-memory store for mock jobs
  private jobs: Map<string, TryOnJob> = new Map();

  async createTryOnJob(input: TryOnInput): Promise<TryOnJob> {
    const jobId = 'tryon-' + Date.now();
    this.logger.log(`Queuing Try-On job: ${jobId}`);
    
    const job: TryOnJob = { jobId, status: 'queued' };
    this.jobs.set(jobId, job);
    
    // Simulate async processing
    setTimeout(() => {
      this.jobs.set(jobId, { 
        jobId, 
        status: 'completed', 
        resultImageUrl: input.sourceImageUrl // Returning the source as a mock result
      });
    }, 3000);

    return job;
  }

  async getTryOnStatus(jobId: string): Promise<TryOnJob> {
    return this.jobs.get(jobId) || { jobId, status: 'failed' };
  }
}
