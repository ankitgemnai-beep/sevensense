import { Controller, Get, Patch, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { CloudinaryService } from '../media/cloudinary.service';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findById(req.user._id);
  }

  @Patch('profile')
  async updateProfile(@Request() req, @Body() updateData: any) {
    if (updateData.base64Image) {
      const uploadResult = await this.cloudinaryService.uploadImage(updateData.base64Image);
      updateData.profilePhotoUrl = uploadResult.secure_url;
      delete updateData.base64Image;
    }
    return this.usersService.updateProfile(req.user._id, updateData);
  }

  @Get('search')
  async searchUsers(@Request() req, @Body('q') bodyQ: string): Promise<any> {
    const q = req.query.q || bodyQ;
    const users = await this.usersService.searchUsers(q as string, req.user._id.toString());
    return { success: true, data: users };
  }

  @Post(':id/follow')
  async followUser(@Request() req, @Body() body: any) {
    // ID from url is in req.params.id, but let's use explicit params
    // Wait, nestjs @Param() is better, but since I didn't import it, I can get it from req.params
    const targetId = req.params.id;
    const updatedUser = await this.usersService.followUser(req.user._id.toString(), targetId);
    return { success: true, data: updatedUser };
  }

  @Post(':id/unfollow')
  async unfollowUser(@Request() req) {
    const targetId = req.params.id;
    const updatedUser = await this.usersService.unfollowUser(req.user._id.toString(), targetId);
    return { success: true, data: updatedUser };
  }
}
