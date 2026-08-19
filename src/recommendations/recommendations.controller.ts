import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('recommendations')
@UseGuards(AuthGuard('jwt'))
export class RecommendationsController {
  
  constructor(private recommendationsService: RecommendationsService) {}

  @Get('today')
  async getTodaysLook(@Request() req: any, @Query('weather') weather?: string, @Query('occasion') occasion?: string) {
    const userId = req.user.userId;
    const data = await this.recommendationsService.getTodaysLook(userId, weather, occasion);
    
    return {
      success: true,
      data,
    };
  }
}
