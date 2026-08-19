import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../schemas/post.schema';

@Injectable()
export class DiscoverFeedService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async getRankedFeed(userId: string): Promise<any> {
    // In production, this would fetch the user's Fashion DNA and use it to rank posts.
    // For MVP, we return a structured, mock editorial feed layout.

    const mockPosts = [
      { id: '1', type: 'outfit', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80', caption: 'Minimalist Layering', likes: 120 },
      { id: '2', type: 'outfit', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80', caption: 'City Essentials', likes: 89 },
      { id: '3', type: 'education', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80', title: '3 Ways to Style a Navy Blazer' }
    ];

    return {
      personalizedGreeting: 'Good evening.',
      reasons: ['Minimal', 'Modern Classic', 'Neutral Tones'],
      trendingLooks: mockPosts.filter(p => p.type === 'outfit'),
      education: mockPosts.filter(p => p.type === 'education'),
      todayChallenge: { title: 'Monochrome', participants: 432 },
    };
  }
}
