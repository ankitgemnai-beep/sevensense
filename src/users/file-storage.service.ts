import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileStorageService implements OnModuleInit {
  private readonly logger = new Logger(FileStorageService.name);
  private readonly storageDir = path.join(process.cwd(), 'storage', 'users');

  onModuleInit() {
    this.ensureStorageDirectory();
  }

  private ensureStorageDirectory() {
    if (!fs.existsSync(this.storageDir)) {
      try {
        fs.mkdirSync(this.storageDir, { recursive: true });
        this.logger.log(`Created user file storage directory at ${this.storageDir}`);
      } catch (error) {
        this.logger.error(`Failed to create storage directory: ${error.message}`);
      }
    }
  }

  private getUserFilePath(userId: string): string {
    return path.join(this.storageDir, `${userId}.json`);
  }

  async readUserProfile(userId: string): Promise<any> {
    const filePath = this.getUserFilePath(userId);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    try {
      const fileData = await fs.promises.readFile(filePath, 'utf-8');
      return JSON.parse(fileData);
    } catch (error) {
      this.logger.error(`Failed to read user file for ${userId}: ${error.message}`);
      return null;
    }
  }

  async writeUserProfile(userId: string, data: any): Promise<boolean> {
    const filePath = this.getUserFilePath(userId);
    try {
      // Merge existing data with new data if it exists
      let existingData = {};
      if (fs.existsSync(filePath)) {
        const fileData = await fs.promises.readFile(filePath, 'utf-8');
        existingData = JSON.parse(fileData);
      }
      
      const mergedData = { ...existingData, ...data };
      await fs.promises.writeFile(filePath, JSON.stringify(mergedData, null, 2), 'utf-8');
      return true;
    } catch (error) {
      this.logger.error(`Failed to write user file for ${userId}: ${error.message}`);
      return false;
    }
  }
}
