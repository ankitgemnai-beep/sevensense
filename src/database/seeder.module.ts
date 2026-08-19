import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeederService } from './seeder.service';
import { WardrobeItem, WardrobeItemSchema } from '../wardrobe/schemas/wardrobe-item.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WardrobeItem.name, schema: WardrobeItemSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  providers: [SeederService],
})
export class SeederModule {}
