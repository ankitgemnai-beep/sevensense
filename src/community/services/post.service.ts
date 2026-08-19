import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../schemas/post.schema';
import { User } from '../../users/schemas/user.schema';
import { CloudinaryService } from '../../media/cloudinary.service';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
    private cloudinaryService: CloudinaryService
  ) {}

  async getFeed(userId: string): Promise<any[]> {
    const user = await this.userModel.findById(userId).lean().exec();
    const following = user?.following || [];

    // Include the user's own posts as well
    const targetUserIds = [...following, userId];

    const posts = await this.postModel.find({ userId: { $in: targetUserIds } })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('userId', 'username displayName profilePhotoUrl')
      .populate('wardrobeItemRefs', 'name imageUrl category')
      .lean()
      .exec();

    // Map to a friendlier frontend format
    return posts.map(post => ({
      _id: post._id,
      user: (post.userId as any)?.displayName || 'Unknown',
      handle: (post.userId as any)?.username || 'user',
      avatar: (post.userId as any)?.profilePhotoUrl || 'https://via.placeholder.com/150',
      description: post.caption,
      image: post.media?.[0] || 'https://via.placeholder.com/600',
      likes: post.likesCount,
      comments: post.commentsCount,
      saves: post.savesCount,
      createdAt: (post as any).createdAt,
      wardrobeItems: post.wardrobeItemRefs
    }));
  }

  async createPost(userId: string, data: any): Promise<Post> {
    const moderationStatus = this.mockAIModeration(data.caption);
    if (moderationStatus === 'removed') {
      throw new Error('Post violates community guidelines.');
    }

    let mediaUrls = [];
    if (data.base64Image) {
      const uploadResult = await this.cloudinaryService.uploadImage(data.base64Image);
      mediaUrls.push(uploadResult.secure_url);
    }

    return this.postModel.create({
      ...data,
      media: mediaUrls,
      userId,
      moderationStatus
    });
  }

  private mockAIModeration(caption: string = ''): string {
    const toxicKeywords = ['hate', 'spam', 'scam'];
    const isToxic = toxicKeywords.some(kw => caption.toLowerCase().includes(kw));
    return isToxic ? 'removed' : 'approved';
  }
}

