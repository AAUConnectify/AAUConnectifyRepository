import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

import { UserAuthModule } from './user-auth/user-auth.module';

@Module({
  imports: [ 
    MongooseModule.forRoot('mongodb+srv://abrhamwube:mikiwube29@abrhamwube.6darlxm.mongodb.net/?retryWrites=true&w=majority'), UserAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  
  
})
export class AppModule {}
