import { Controller, Post, Body, Get, UseGuards, BadRequestException } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { User } from './schemas/user-auth.schema';
import { AuthGuard } from './auth.guard';


@Controller('api/auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

@Post('register')
async registerUser(
  @Body() body: { studentId: string; username: string; schoolPassword: string; userpassword:string,securityQuestion:string },
): Promise<{ message: string }> {
  const { studentId,  schoolPassword, userpassword, username,securityQuestion } = body;

  

  // Call registerUser with correct parameter order
  await this.userAuthService.registerUser(studentId, schoolPassword, userpassword,username,securityQuestion);
  return { message: 'User registered successfully' };
}

  @Post('login')
  async loginUser(@Body() body: {username: string; userpassword: string }): Promise<{ message: string; token: string }> {
    const { username, userpassword } = body;
    const token = await this.userAuthService.loginUser(username, userpassword);
    return { message: 'Login successful', token };
  }

  @Post('reset-password')
async resetPassword(
  @Body() body: { username: string; securityQuestionAnswer: string; newPassword: string },
): Promise<{ message: string }> {
  const { username, securityQuestionAnswer, newPassword } = body;
  await this.userAuthService.resetPassword(username, securityQuestionAnswer, newPassword);
  return { message: 'Password reset successful' };
}


  @Get('users')
  @UseGuards(AuthGuard)
  async getUsers(): Promise<User[]> {
    return this.userAuthService.getUsers();
  }

  
  
}