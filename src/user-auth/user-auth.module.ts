import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user-auth.schema';
import { secretKey } from './config'; 
import { StudentSchema } from './schemas/student.schema';



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
  ],
  controllers: [UserAuthController],
  providers: [UserAuthService],
})
export class UserAuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // You can add middleware configuration here if needed
  }
}

