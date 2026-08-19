import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WardrobeModule } from './wardrobe/wardrobe.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { ShopModule } from './commerce/shop.module';
import { SeederModule } from './database/seeder.module';
import { MediaModule } from './media/media.module';
import { CommunityModule } from './community/community.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: configService.get<string>('MONGODB_DB_NAME') || 'seven_sense_db',
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    WardrobeModule,
    RecommendationsModule,
    ShopModule,
    SeederModule,
    MediaModule,
    CommunityModule,
  ],
})
export class AppModule {}
