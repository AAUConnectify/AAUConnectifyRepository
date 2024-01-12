// File: announcement/announcement.service.ts

import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Announcement,  } from '../../schemas/announcement.schema';
import { User } from '../../schemas/user-auth.schema';
import { UserRole } from '../../schemas/user-role.enum';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectModel(Announcement.name) private announcementModel: Model<Announcement>,
    
    @InjectModel(User.name) private userModel: Model<User>
    
    )
  
  {}

  async createAnnouncement(user: User, title: string, content: string, annProfile: string): Promise<Announcement> {
    try {
      // Check if the user has the 'admin' role
      if (user.role === UserRole.Admin) {
        // Create the announcement with optional annProfile
        const announcement = await this.announcementModel.create({ title, content, annProfile });

        return announcement;
      } else {
        throw new UnauthorizedException('Insufficient permissions');
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw new Error('An error occurred while creating the announcement.');
    }
  }
  // File: announcement/announcement.service.ts

async readAnnouncements(user: User): Promise<Announcement[]> {
  try {
    // Check if the user has either 'admin' or 'user' role
    if (!user.role.includes(UserRole.Admin) && !user.role.includes(UserRole.User)) {
      throw new UnauthorizedException('Insufficient permissions');
    }

    // Retrieve announcements with all fields and sort by createdAt in descending order
    const announcements = await this.announcementModel.find({}, '-__v').sort({ createdAt: -1 });

    console.log('Announcements:', announcements); // Add this line for debugging

    return announcements;
  } catch (error) {
    console.error('Error reading announcements:', error);
    throw new Error('An error occurred while reading announcements.');
  }
}


  async getAnnouncementById(announcementId: string): Promise<Announcement> {
    try {
      const announcement = await this.announcementModel.findById(announcementId, '-__v');

      if (!announcement) {
        throw new NotFoundException('Announcement not found');
      }

      return announcement;
    } catch (error) {
      console.error('Error getting announcement by ID:', error);
      throw new Error('An error occurred while getting the announcement by ID.');
    }
  }
  async updateAnnouncement(user: User, announcementId: string, title: string, content: string, annProfile?: string): Promise<Announcement> {
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
      announcement.annProfile = annProfile;

      // Save the updated announcement
      await announcement.save();

      return announcement;
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw new Error('An error occurred while updating the announcement.');
    }
  }



  async deleteAnnouncement(user: User, announcementId: string): Promise<void> {
    try {
      // Check if the user has the 'admin' role
      if (user.role !== UserRole.Admin) {
        throw new UnauthorizedException('Insufficient permissions');
      }

      // Find the announcement by ID and delete it
      const result = await this.announcementModel.deleteOne({ _id: announcementId });

      if (result.deletedCount === 0) {
        throw new NotFoundException('Announcement not found');
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw new Error('An error occurred while deleting the announcement.');
    }
  }


  async likeAnnouncement(user: User, announcementId: string): Promise<{ message: string; announcement: Announcement }> {
    try {
      const announcement = await this.announcementModel.findById(announcementId);
  
      if (!announcement) {
        throw new NotFoundException('Announcement not found');
      }
  
      // Check if the user already liked the announcement
      if (announcement.likes && announcement.likes.includes(user._id)) {
        throw new BadRequestException('You already liked this announcement');
      }
  
      // Add user's ID to the likes array
      announcement.likes = [...(announcement.likes || []), user._id];
  
      await announcement.save();
  
      return { message: 'Announcement liked successfully', announcement };
    } catch (error) {
      console.error('Error liking announcement:', error);
      throw new Error('An error occurred while liking the announcement.');
    }
  }

  // get list of liked 
  async getLikedAnnouncements(user: User): Promise<Announcement[]> {
    try {
      // Retrieve announcements liked by the user
      const likedAnnouncements = await this.announcementModel.find({ likes: user._id });
      console.log('Liked Announcements:', likedAnnouncements);
      return likedAnnouncements;
    } catch (error) {
      console.error('Error retrieving liked announcements:', error);
      throw new Error('An error occurred while retrieving liked announcements.');
    }
  }
  


  
}
