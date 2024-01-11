import { Controller, Post, Body, Get, UseGuards, BadRequestException } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { User } from './schemas/user-auth.schema';
import { AuthGuard } from './auth.guard';


@Controller('api/auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

@Post('register')
async registerUser(
  @Body() body: { studentId: string; username: string; schoolPassword: string; userpassword:string },
): Promise<{ message: string }> {
  const { studentId,  schoolPassword, userpassword, username } = body;

  

  // Call registerUser with correct parameter order
  await this.userAuthService.registerUser(studentId, schoolPassword, userpassword,username);
  return { message: 'User registered successfully' };
}

  @Post('login')
  async loginUser(@Body() body: {username: string; userpassword: string }): Promise<{ message: string; token: string }> {
    const { username, userpassword } = body;
    const token = await this.userAuthService.loginUser(username, userpassword);
    return { message: 'Login successful', token };
  }

  @Get('users')
  @UseGuards(AuthGuard)
  async getUsers(): Promise<User[]> {
    return this.userAuthService.getUsers();
  }

  
  
}