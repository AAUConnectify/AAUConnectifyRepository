// File: announcement/announcement.service.ts

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Announcement,  } from '../../schemas/announcement.schema';
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


  async getAnnouncementById(announcementId: string): Promise<Announcement> {
    try {
      const announcement = await this.announcementModel.findById(announcementId);

      if (!announcement) {
        throw new NotFoundException('Announcement not found');
      }

      return announcement;
    } catch (error) {
      console.error('Error getting announcement by ID:', error);
      throw new Error('An error occurred while getting the announcement by ID.');
    }
  }

  async updateAnnouncement(user: User, announcementId: string, title: string, content: string): Promise<{ message: string }> {
    try {
      // Check if the user has the 'admin' role
      if (user.role !== UserRole.Admin) {
        throw new UnauthorizedException('Insufficient permissions');
      }

      // Find the announcement by ID
      const announcement = await this.announcementModel.findById(announcementId);

      if (!announcement) {
        throw new NotFoundException('Announcement not found');
      }

      // Update the announcement properties
      announcement.title = title;
      announcement.content = content;

      // Save the updated announcement
      await announcement.save();

      return { message: 'Announcement updated successfully' };
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw new Error('An error occurred while updating the announcement.');
    }
  }

  async deleteAnnouncement(user: User, announcementId: string): Promise<{ message: string }> {
    try {
      // Check if the user has the 'admin' role
      if (UserRole.Admin) {
        throw new UnauthorizedException('Insufficient permissions');
      }

      // Find the announcement by ID and delete it
      const result = await this.announcementModel.deleteOne({ _id: announcementId });

      if (result.deletedCount === 0) {
        throw new NotFoundException('Announcement not found');
      }

      return { message: 'Announcement deleted successfully' };
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw new Error('An error occurred while deleting the announcement.');
    }
  }
}
