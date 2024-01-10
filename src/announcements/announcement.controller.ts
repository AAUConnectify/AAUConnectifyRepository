// announcement.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { AnnouncementService } from './announcement.service';

@Controller('api/announcements')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  getAnnouncements() {
    return this.announcementService.getAnnouncements();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin') // Only allow admin to create announcements
  createAnnouncement(@Body() body: any) {
    const { title, content, announcementPicture } = body;
    return this.announcementService.createAnnouncement(title, content, announcementPicture);
  }

  @Get(':id')
  getAnnouncementById(@Param('id') id: string) {
    return this.announcementService.getAnnouncementById(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin') // Only allow admin to update announcements
  updateAnnouncement(@Param('id') id: string, @Body() body: any) {
    const { title, content, announcementPicture } = body;
    return this.announcementService.updateAnnouncement(id, title, content, announcementPicture);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin') // Only allow admin to delete announcements
  deleteAnnouncement(@Param('id') id: string) {
    return this.announcementService.deleteAnnouncement(id);
  }
}
