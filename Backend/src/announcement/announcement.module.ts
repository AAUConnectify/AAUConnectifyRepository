// File: announcement/announcement.module.ts

import { Module } from '@nestjs/common';
import { AnnouncementController } from './announcement.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Announcement, AnnouncementSchema } from '../../schemas/announcement.schema';
import { AnnouncementService } from './announcements.service';

import { JwtModule } from '@nestjs/jwt';
import {PassportModule } from '@nestjs/passport';
import { secretKey } from '../../config/config'; 
import { User, UserSchema } from '../../schemas/user-auth.schema';
import { AuthGuard } from '../guard/auth.guard';


@Module({
  imports: [MongooseModule.forFeature([
    { name: Announcement.name, schema: AnnouncementSchema },
    { name: User.name, schema: UserSchema }
  
  ])

,JwtModule.register({
    secret: secretKey.secret,
    
  }),
  PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AnnouncementController],
  providers: [AnnouncementService],
})
export class AnnouncementModule {}
