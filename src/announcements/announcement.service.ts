// announcement.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Announcement } from './announcement.schema';

@Injectable()
export class AnnouncementService {
  constructor(@InjectModel('Announcement') private readonly announcementModel: Model<Announcement>) {}

  async createAnnouncement(title: string, content: string, announcementPicture?: string): Promise<Announcement> {
    const announcement = new this.announcementModel({ title, content, announcementPicture });
    return await announcement.save();
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return await this.announcementModel.find().exec();
  }

  async getAnnouncementById(id: string): Promise<Announcement> {
    const announcement = await this.announcementModel.findById(id).exec();
    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }
    return announcement;
  }

  async updateAnnouncement(id: string, title: string, content: string, announcementPicture?: string): Promise<Announcement> {
    const announcement = await this.getAnnouncementById(id);
    announcement.title = title;
    announcement.content = content;
    announcement.announcementPicture = announcementPicture;
    return await announcement.save();
  }

  async deleteAnnouncement(id: string): Promise<Announcement> {
    const announcement = await this.getAnnouncementById(id);
    await this.announcementModel.deleteOne({ _id: id }).exec();
    return announcement;
  }
  
}
