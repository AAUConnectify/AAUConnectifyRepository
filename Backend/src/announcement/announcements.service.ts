// File: announcement/announcement.service.ts

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Announcement,  } from './announcement.schema';
import { User } from '../../schemas/user-auth.schema';
import { UserRole } from '../../schemas/user-role.enum';

@Injectable()
export class AnnouncementService {
  constructor(@InjectModel(Announcement.name) private announcementModel: Model<Announcement>) {}

  async createAnnouncement(user: User, title: string, content: string): Promise<{ message: string }> {
    try {
      // Check if the user has the 'admin' role
      if (user.role === UserRole.Admin) {
        // Create the announcement
        await this.announcementModel.create({ title, content });

        return { message: 'Announcement created successfully' };
      } else {
        throw new UnauthorizedException('Insufficient permissions');
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw new Error('An error occurred while creating the announcement.');
    }
  }

  async readAnnouncements(user: User): Promise<Announcement[]> {
    try {
      // Check if the user has either 'admin' or 'user' role
      if (!user.role.includes(UserRole.Admin) && !user.role.includes(UserRole.User)) {
        throw new UnauthorizedException('Insufficient permissions');
      }

      // Retrieve announcements
      const announcements = await this.announcementModel.find({});
      return announcements;
    } catch (error) {
      console.error('Error reading announcements:', error);
      throw new Error('An error occurred while reading announcements.');
    }
  }

  // Other announcement-related methods can be added here
}
