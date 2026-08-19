import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WardrobeController } from './wardrobe.controller';
import { WardrobeService } from './wardrobe.service';
import { WardrobeItem, WardrobeItemSchema } from './schemas/wardrobe-item.schema';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WardrobeItem.name, schema: WardrobeItemSchema }]),
    MediaModule
  ],
  controllers: [WardrobeController],
  providers: [WardrobeService],
  exports: [WardrobeService, MongooseModule]
})
export class WardrobeModule {}
