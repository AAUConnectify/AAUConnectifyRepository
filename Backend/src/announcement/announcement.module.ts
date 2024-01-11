// File: announcement/announcement.module.ts

import { Module } from '@nestjs/common';
import { AnnouncementController } from './announcement.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Announcement, AnnouncementSchema } from './announcement.schema';
import { AnnouncementService } from './announcements.service';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { secretKey } from '../../config/config'; 

@Module({
  imports: [MongooseModule.forFeature([{ name: Announcement.name, schema: AnnouncementSchema }])

,JwtModule.register({
    secret: secretKey.secret,
    signOptions: { expiresIn: '1h' },
  }),
  PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AnnouncementController],
  providers: [AnnouncementService],
})
export class AnnouncementModule {}
