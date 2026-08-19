import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../schemas/notification.schema';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(@InjectModel(Notification.name) private notificationModel: Model<Notification>) {}

  async sendIntelligentNotification(userId: string, category: string, title: string, body: string, metadata: any = {}): Promise<void> {
    // 1. Deduplication check (e.g. don't send 5 price alerts in an hour)
    const recent = await this.notificationModel.findOne({
      userId,
      category,
      createdAt: { $gte: new Date(Date.now() - 3600000) } // Last 1 hour
    });

    if (recent && category !== 'security') {
      this.logger.log(`Skipping notification to avoid spamming user ${userId}`);
      return;
    }

    // 2. Create notification
    await this.notificationModel.create({ userId, category, title, body, metadata });
    
    // 3. (Production) Push to APNS/FCM via external provider
  }
}
