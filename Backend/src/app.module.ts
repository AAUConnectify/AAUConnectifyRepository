import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

import { UserAuthModule } from './user-auth/user-auth.module';


import { ConfigModule } from '@nestjs/config';
import { AnnouncementModule } from './announcement/announcement.module';

@Module({
  imports: [ 
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/aau-connectivity'),
     UserAuthModule ,
     AnnouncementModule
     
  ],
  controllers: [AppController],
  providers: [AppService],
  
  
})
export class AppModule {}
