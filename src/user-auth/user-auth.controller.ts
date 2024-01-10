import { Controller, Post, Body, Get, UseGuards, BadRequestException } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { User } from './schemas/user-auth.schema';
import { AuthGuard } from './auth.guard';


@Controller('api/auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

@Post('register')
async registerUser(
  @Body() body: { studentId: string; username: string; schoolPassword: string; email: string, userpassword:string },
): Promise<{ message: string }> {
  const { studentId,  schoolPassword, email,userpassword } = body;

  // Validate email format 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new BadRequestException('Invalid email format');
  }

  // Call registerUser with correct parameter order
  await this.userAuthService.registerUser(studentId, schoolPassword, userpassword, email);
  return { message: 'User registered successfully' };
}

  @Post('login')
  async loginUser(@Body() body: {email: string; userpassword: string }): Promise<{ message: string; token: string }> {
    const { email, userpassword } = body;
    const token = await this.userAuthService.loginUser(email, userpassword);
    return { message: 'Login successful', token };
  }

  @Get('users')
  @UseGuards(AuthGuard)
  async getUsers(): Promise<User[]> {
    return this.userAuthService.getUsers();
  }

  
  
}