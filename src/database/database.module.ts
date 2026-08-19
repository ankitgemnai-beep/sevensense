import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('env.mongoUri');
        const dbName = configService.get<string>('env.mongoDbName');
        
        if (!uri) {
          throw new Error('MONGODB_URI is not defined in environment variables.');
        }

        return {
          uri,
          dbName,
          // Mongoose 6/7/8 use defaults for useNewUrlParser and useUnifiedTopology
          // connection retry behavior, pool size can be configured here
          maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10', 10),
          minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '2', 10),
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
