import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../../schemas/user-auth.schema';
import { secretKey } from '../../config/config'; 
import { StudentSchema } from '../../schemas/student.schema';
import { PassportModule } from '@nestjs/passport'; 
import { RolesGuard } from '../guard/roles.guard';
import { AnnouncementModule } from '../announcement/announcement.module';



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Student', schema: StudentSchema },
     
    ]),
    JwtModule.register({
      secret: secretKey.secret,
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UserAuthController],
  providers: [UserAuthService,RolesGuard,AnnouncementModule],
})
export class UserAuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    
  }
}

