export interface TryOnInput {
  userId: string;
  sourceImageUrl: string;
  garmentImageUrl: string;
}

export interface TryOnJob {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  resultImageUrl?: string;
}

export interface TryOnProvider {
  createTryOnJob(input: TryOnInput): Promise<TryOnJob>;
  getTryOnStatus(jobId: string): Promise<TryOnJob>;
}
