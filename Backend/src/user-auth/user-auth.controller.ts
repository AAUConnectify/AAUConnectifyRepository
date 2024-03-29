import { Controller, Post, Body, Get, UseGuards, BadRequestException, Req } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { User } from '../../schemas/user-auth.schema';
import { AuthGuard } from '../guard/auth.guard';


@Controller('api/auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

@Post('register')
@Post('register')
async register(
  @Body() body: {
    studentId: string;
    schoolPassword: string;
    userpassword: string;
    username: string;
    securityQuestion: string;
    fullName: string;
    fieldOfStudy: string;
    profilePic: string;
  },
): Promise<{ token: string; user: User }> {
  const {
    studentId,
    schoolPassword,
    userpassword,
    username,
    securityQuestion,
    fullName,
    fieldOfStudy,
    profilePic,
  } = body;

  try {
    const result = await this.userAuthService.registerUser(
      studentId,
      schoolPassword,
      userpassword,
      username,
      securityQuestion,
      fullName,
      fieldOfStudy,
      profilePic,
    );

    return { token: result.token, user: result.user };
  } catch (error) {
    console.error('Error in register controller:', error);
    throw new BadRequestException('An error occurred while registering the user.');
  }
}

 // UserAuthController

@Post('login')
async loginUser(@Body() body: { username: string; userpassword: string }): Promise<{ message: string; token: string; user: User }> {
  const { username, userpassword } = body;
  try {
    const result = await this.userAuthService.loginUser(username, userpassword);
    return { message: 'Login successful', token: result.token, user: result.user };
  } catch (error) {
    console.error('Error in login controller:', error);
    throw new BadRequestException('An error occurred while logging in.');
  }
}


  @Post('reset-password')
async resetPassword(
  @Body() body: { username: string; securityQuestionAnswer: string; newPassword: string },
): Promise<{ message: string }> {
  const { username, securityQuestionAnswer, newPassword } = body;
  await this.userAuthService.resetPassword(username, securityQuestionAnswer, newPassword);
  return { message: 'Password reset successful' };
}

@Post('update-profile')
  @UseGuards(AuthGuard)
  async updateUserProfile(
    @Body() body: {
      username: string;
      fullName: string;
      fieldOfStudy: string;
      profilePic: string;
    },
  ): Promise<User> {
    const { username, fullName, fieldOfStudy, profilePic } = body;

    try {
      const updatedUser = await this.userAuthService.updateUserProfile(
        username,
        fullName,
        fieldOfStudy,
        profilePic,
      );

      return updatedUser;
    } catch (error) {
      console.error('Error in update profile controller:', error);
      throw new BadRequestException('An error occurred while updating the user profile.');
    }
  }
  @Get('users')
  @UseGuards(AuthGuard)
  async getUsers(): Promise<User[]> {
    return this.userAuthService.getUsers();
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() request): Promise<{ message: string }> {
    const token = this.extractTokenFromHeader(request);
    this.userAuthService.logout(token);
    return { message: 'Logout successful' };
  }

  private extractTokenFromHeader(request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  
}