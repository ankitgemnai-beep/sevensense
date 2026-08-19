import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PostService } from './services/post.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('community')
export class CommunityController {
  constructor(private readonly postService: PostService) {}

  @Get('feed')
  async getFeed(@Request() req) {
    const feed = await this.postService.getFeed(req.user._id.toString());
    return { success: true, data: feed };
  }

  @Post('post')
  async createPost(@Request() req, @Body() data: any) {
    const post = await this.postService.createPost(req.user._id.toString(), data);
    return { success: true, data: post };
  }
}
