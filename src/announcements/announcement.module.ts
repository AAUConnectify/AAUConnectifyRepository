// announcement.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
import { RolesGuard } from './roles.guard';
import {  AnnouncementSchema } from './announcement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Announcement', schema: AnnouncementSchema }]),
  ],
  controllers: [AnnouncementController],
  providers: [AnnouncementService, RolesGuard],
})
export class AnnouncementModule {}
