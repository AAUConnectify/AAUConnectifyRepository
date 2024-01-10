import { Controller, Post, Body, Get, UseGuards, BadRequestException, Req, UnauthorizedException, NotFoundException, Param, Put, Delete } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { User } from './schemas/user-auth.schema';
import { AuthGuard } from './auth.guard';
import { Announcement } from './schemas/announcement.schema';

@Controller('api/auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}
// In your UserAuthController
@Post('register')
async registerUser(
  @Body() body: { studentId: string; username: string; schoolPassword: string; email: string, userpassword:string },
): Promise<{ message: string }> {
  const { studentId,  schoolPassword, email,userpassword } = body;

  // Validate email format (you might want to use a validation library)
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

  @Post('create-announcement')
  @UseGuards(AuthGuard)
  async createAnnouncement(
    @Body() body: { title: string; content: string },
    @Req() request: Request,
  ): Promise<{ message: string }> {
    const { title, content } = body;

    try {
      // The authenticated user is attached to the request by the AuthGuard
      const currentUser: User = request['user'];

      // Call the service method to create the announcement
      await this.userAuthService.createAnnouncement(currentUser, title, content);

      return { message: 'Announcement created successfully' };
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw new BadRequestException('An error occurred while creating the announcement.');
    }
  }

  @Get('announcements')
  @UseGuards(AuthGuard)
  async getAnnouncements(@Req() request: Request): Promise<Announcement[]> {
    try {
      const currentUser: User = request['user'];

      // Call the service method to retrieve announcements based on the user's role
      return await this.userAuthService.readAnnouncements(currentUser);
    } catch (error) {
      console.error('Error retrieving announcements:', error);
      throw new UnauthorizedException('An error occurred while retrieving announcements.');
    }
  }

  //details controller

  @Get('announcements/:id')
  @UseGuards(AuthGuard)
  async getAnnouncementById(@Param('id') id: string): Promise<Announcement> {
    try {
   
      return await this.userAuthService.getAnnouncementById(id);
    } catch (error) {
      console.error('Error getting announcement by ID:', error);
      throw new NotFoundException('An error occurred while getting the announcement by ID.');
    }
  }

  // update announcement controller

  @Put('announcements/:id')
  @UseGuards(AuthGuard)
  async updateAnnouncement(
    @Param('id') id: string,
    @Body() body: { title: string; content: string },
    @Req() request: Request,
  ): Promise<{ message: string }> {
    try {
      const { title, content } = body;

      // The authenticated user is attached to the request by the AuthGuard
      const currentUser: User = request['user'];

      // Call the service method to update the announcement
      return await this.userAuthService.updateAnnouncement(currentUser, id, title, content);
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw new NotFoundException('An error occurred while updating the announcement.');
    }
  }
  //  delete announcement 

  @Delete('announcements/:id')
  @UseGuards(AuthGuard)
  async deleteAnnouncementById(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    try {
      // The authenticated user is attached to the request by the AuthGuard
      const currentUser: User = request['user'];

      // Call the service method to delete the announcement by ID
      return await this.userAuthService.deleteAnnouncement(currentUser, id);
    } catch (error) {
      console.error('Error deleting announcement by ID:', error);
      throw new NotFoundException('An error occurred while deleting the announcement by ID.');
    }
  }
  
}