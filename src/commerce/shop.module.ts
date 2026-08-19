import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { AIModule } from '../ai/ai.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    AIModule,
    UsersModule,
  ],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule {}
