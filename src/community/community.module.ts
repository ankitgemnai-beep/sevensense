import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommunityController } from './community.controller';
import { PostService } from './services/post.service';
import { Post, PostSchema } from './schemas/post.schema';
import { MediaModule } from '../media/media.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MediaModule,
    UsersModule
  ],
  controllers: [CommunityController],
  providers: [PostService],
})
export class CommunityModule {}
