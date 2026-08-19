import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { FileStorageService } from './file-storage.service';
import { UsersController } from './users.controller';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MediaModule
  ],
  controllers: [UsersController],
  providers: [UsersService, FileStorageService],
  exports: [UsersService, MongooseModule]
})
export class UsersModule {}
