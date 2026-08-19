import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WardrobeService } from './wardrobe.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('wardrobe')
@UseGuards(AuthGuard('jwt'))
export class WardrobeController {
  constructor(private readonly wardrobeService: WardrobeService) {}

  @Get('snapshot')
  async getSnapshot(@Request() req: any) {
    const userId = req.user._id;
    const items = await this.wardrobeService.getWardrobeSnapshot(userId);
    return {
      success: true,
      data: items,
    };
  }

  @Get()
  async getFullWardrobe(@Request() req: any) {
    const userId = req.user._id;
    const items = await this.wardrobeService.getUserWardrobe(userId);
    return {
      success: true,
      data: items,
    };
  }

  @Post()
  async addItem(@Request() req: any, @Body() data: any) {
    const userId = req.user._id;
    const item = await this.wardrobeService.createWardrobeItem(userId, data);
    return {
      success: true,
      data: item,
    };
  }
}
