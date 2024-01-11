// src/announcements/announcements.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Announcement, AnnouncementDocument } from './schemas/announcement.schema';

@Injectable()
export class AnnouncementsService {
  constructor(@InjectModel(Announcement.name) private announcementModel: Model<AnnouncementDocument>) {}

  async createAnnouncement(title: string, content: string): Promise<Announcement> {
    const announcement = new this.announcementModel({ title, content });
    return announcement.save();
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return this.announcementModel.find().exec();
  }

  // Implement update and delete methods as needed
}
