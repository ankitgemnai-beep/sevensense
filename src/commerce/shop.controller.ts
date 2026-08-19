import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ShopService } from './shop.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('seed')
  async seedProducts(@Body() body: any) {
    const products = body.products || [];
    return this.shopService.addProducts(products);
  }

  @Get('recommendations')
  @UseGuards(AuthGuard('jwt'))
  async getRecommendations(@Request() req: any) {
    const userId = req.user.userId;
    const items = await this.shopService.getShoppingIntelligence(userId);
    return {
      success: true,
      data: items,
    };
  }
}
