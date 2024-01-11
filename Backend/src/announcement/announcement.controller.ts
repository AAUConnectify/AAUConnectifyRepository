// File: announcement/announcement.controller.ts

import { Controller, Post, Get, UseGuards, BadRequestException, Req, UnauthorizedException, Param, Put, Delete, Body } from '@nestjs/common';
import { AnnouncementService } from './announcements.service';
import { User } from '../../schemas/user-auth.schema';
import { AuthGuard } from '../guard/auth.guard';
import { Announcement } from '../../schemas/announcement.schema';

@Controller('api/announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async createAnnouncement(
    @Body() body: { title: string; content: string; imageUrl?: string }, // Include imageUrl in the request body
    @Req() request: Request,
  ): Promise<Announcement> {
    const { title, content, imageUrl } = body;

    try {
      // The authenticated user is attached to the request by the AuthGuard
      const currentUser: User = request['user'];

      // Call the service method to create the announcement and return the announcement body
      const createdAnnouncement = await this.announcementService.createAnnouncement(currentUser, title, content, imageUrl);

      return createdAnnouncement;
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw new BadRequestException('An error occurred while creating the announcement.');
    }
  }
  @Get('list')
  @UseGuards(AuthGuard)
  async getAnnouncements(@Req() request: Request): Promise<Announcement[]> {
    try {
      const currentUser: User = request['user'];

      // Call the service method to retrieve announcements based on the user's role
      return await this.announcementService.readAnnouncements(currentUser);
    } catch (error) {
      console.error('Error retrieving announcements:', error);
      throw new UnauthorizedException('An error occurred while retrieving announcements.');
    }
  }

  // Other announcement-related controllers can be added here
  @Get('list/:id')
  async getAnnouncementById(@Param('id') id: string): Promise<Announcement> {
    return await this.announcementService.getAnnouncementById(id);
  }

  
  @Put('update/:id')
  async updateAnnouncement(@Param('id') id: string, @Body() body: { title: string; content: string; imageUrl?: string }, @Req() request: Request): Promise<Announcement> {
    const { title, content, imageUrl } = body;
    const currentUser: User = request['user'];
    return await this.announcementService.updateAnnouncement(currentUser, id, title, content, imageUrl);
  }
  @Delete('delete/:id')
  async deleteAnnouncement(@Param('id') id: string, @Req() request: Request): Promise<{ message: string }> {
    const currentUser: User = request['user'];
    return await this.announcementService.deleteAnnouncement(currentUser, id);
  }
}
