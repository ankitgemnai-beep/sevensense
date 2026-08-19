import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { FileStorageService } from './file-storage.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private fileStorageService: FileStorageService
  ) {}

  async findByEmail(email: string): Promise<any> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<any> {
    const user = await this.userModel.findById(id).select('-password').lean().exec();
    if (!user) return null;
    
    const fileData = await this.fileStorageService.readUserProfile(id);
    if (fileData) {
      return { ...user, ...fileData };
    }
    return user;
  }

  async create(userData: any): Promise<any> {
    if (!userData.username && userData.email) {
      userData.username = userData.email.split('@')[0] + Math.floor(Math.random() * 10000);
    }
    const createdUser = new this.userModel(userData);
    const savedUser = await createdUser.save();
    
    await this.fileStorageService.writeUserProfile(savedUser._id.toString(), {
      email: savedUser.email,
      displayName: savedUser.displayName,
      profileCreated: new Date().toISOString()
    });
    
    return savedUser;
  }

  async updateProfile(id: string, updateData: any): Promise<any> {
    await this.fileStorageService.writeUserProfile(id, updateData);
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).select('-password').lean().exec();
  }

  async searchUsers(query: string, currentUserId: string): Promise<any[]> {
    if (!query) return [];
    const users = await this.userModel.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { displayName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ],
      _id: { $ne: currentUserId }
    }).select('username displayName profilePhotoUrl followers').lean().exec();
    
    return users.map(u => ({
      ...u,
      isFollowing: u.followers?.includes(currentUserId) || false
    }));
  }

  async followUser(currentUserId: string, targetId: string) {
    if (currentUserId === targetId) throw new Error('Cannot follow yourself');
    
    // Add to target's followers
    await this.userModel.findByIdAndUpdate(targetId, {
      $addToSet: { followers: currentUserId }
    });
    
    // Add to current user's following
    return this.userModel.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: targetId }
    }, { new: true }).select('-password').lean().exec();
  }

  async unfollowUser(currentUserId: string, targetId: string) {
    // Remove from target's followers
    await this.userModel.findByIdAndUpdate(targetId, {
      $pull: { followers: currentUserId }
    });
    
    // Remove from current user's following
    return this.userModel.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetId }
    }, { new: true }).select('-password').lean().exec();
  }
}

