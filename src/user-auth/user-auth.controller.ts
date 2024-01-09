import { Controller, Post, Body, Get, UseGuards, BadRequestException } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { User } from './schemas/user-auth.schema';
import { AuthGuard } from './auth.guard';

@Controller('api/auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Post('register')
  async registerUser(
    @Body() body: { studentId: string; username: string; password: string; email: string },
  ): Promise<{ message: string }> {
    const { studentId, username, password, email } = body;

    // Validate email format (you might want to use a validation library)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    await this.userAuthService.registerUser(studentId, username, password, email);
    return { message: 'User registered successfully' };
  }


  @Post('login')
  async loginUser(@Body() body: { username: string; password: string }): Promise<{ message: string; token: string }> {
    const { username, password } = body;
    const token = await this.userAuthService.loginUser(username, password);
    return { message: 'Login successful', token };
  }

  @Get('users')
  @UseGuards(AuthGuard)
  async getUsers(): Promise<User[]> {
    return this.userAuthService.getUsers();
  }
}