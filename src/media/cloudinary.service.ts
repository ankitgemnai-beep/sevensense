import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService implements OnModuleInit {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      this.logger.warn('Cloudinary credentials missing. Media uploads will fail.');
      return;
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    
    this.logger.log('Cloudinary successfully configured.');
  }

  // Example upload method (implementation will be flushed out later)
  async uploadImage(filePath: string, folder?: string) {
    const defaultFolder = this.configService.get<string>('CLOUDINARY_FOLDER');
    return cloudinary.uploader.upload(filePath, {
      folder: folder || defaultFolder || 'seven-sense',
    });
  }
}
