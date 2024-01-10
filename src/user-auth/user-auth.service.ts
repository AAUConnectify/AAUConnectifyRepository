import { Injectable, NotFoundException, Logger, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user-auth.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Student } from './schemas/student.schema';
import * as nodemailer from 'nodemailer';
import { UserRole } from './schemas/user-role.enum';
import { Announcement, AnnouncementSchema } from './schemas/announcement.schema';
@Injectable()
export class UserAuthService {
  private readonly logger = new Logger(UserAuthService.name);
  private readonly emailTransporter = nodemailer.createTransport({
    service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
    auth: {
      user: 'abrhamwube1@gmail.com', 
      pass: 'pjfe xlff qtog tikg', 
    },
  });

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Announcement.name) private announcementModel: Model<Announcement>, // Inject the Announcement model
    private jwtService: JwtService,
  ) 
  {}

  

  async userExists(studentId: string): Promise<boolean> {
    try {
      const existingStudent = await this.studentModel.findOne({ studentId });
      console.log('Existing Student:', existingStudent);
      return !!existingStudent;
    } catch (error) {
      console.error('Error checking existing student:', error.message);
      throw error;
    }
  }

  
  async registerUser(studentId: string, schoolPassword: string, userpassword: string, email: string): Promise<{ message: string }> {
    try {
      // Check if the studentId exists in the database
      const existingStudent = await this.studentModel.findOne({ studentId });
  
      if (!existingStudent) {
        throw new NotFoundException('Student not found');
      }
  
      // Compare raw passwords (school password)
      if (existingStudent.password !== schoolPassword) {
        console.log(existingStudent.password)
        console.log(schoolPassword)
        throw new UnauthorizedException('Invalid school password');
      }
  
      // Check if the user is already registered with the same email
      const existingUserByEmail = await this.userModel.findOne({ email });
  
      if (existingUserByEmail) {
        throw new ConflictException('Email is already registered for another student');
      }
  
      // Check if the user is already registered with the same student ID
      const existingUserByStudentId = await this.userModel.findOne({ studentId });
  
      if (existingUserByStudentId) {
        throw new ConflictException('Student has already been registered');
      }
  
      // Hash the user password
      const hash = await bcrypt.hash(userpassword, 10);
  
      // Create a new user with the hashed user password
      await this.userModel.create({ studentId, userpassword: hash, email });
  
      return { message: 'User registered successfully' };
    } catch (error) {
    console.error('Error in registerUser:', error);
    throw new Error(`An error occurred while registering the user: ${error.message}`);
  }
  }
  
  
  async loginUser(email: string, userpassword: string): Promise<string> {
    try {
      const user = await this.userModel.findOne({ email });
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      // Compare the provided userpassword with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(userpassword, user.userpassword);
  
      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid login credentials');
      }
  
      const payload = { userId: user._id, role: user.role };
      const token = this.jwtService.sign(payload);
  
      return token;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  

  async getUsers(): Promise<User[]> {
    try {
      const users = await this.userModel.find({});
      return users;
    } catch (error) {
      this.logger.error(`An error occurred while retrieving users: ${error.message}`);
      throw new Error('An error occurred while retrieving users');
    }
  }

  generateJwtToken(user: UserDocument): string {
    const payload = { sub: user._id, role: user.role };
    return this.jwtService.sign(payload);
  }
  
  // Add a method to create announcements
  async createAnnouncement(user: User, title: string, content: string): Promise<{ message: string }> {
    try {
    
      // Check if the user has the 'admin' role
      if (user.role==UserRole.Admin) {
         // Create the announcement
      await this.announcementModel.create({ title, content });

      return { message: 'Announcement created successfully' };
       
      }
      else{
        throw new UnauthorizedException('Insufficient permissions');
      }

     
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw new Error('An error occurred while creating the announcement.');
    }
  }

  // Add a method to read announcements
  async readAnnouncements(user: User): Promise<Announcement[]> {
    try {
      // Check if the user has either 'admin' or 'user' role
      if (!user.role.includes(UserRole.Admin) && !user.role.includes(UserRole.User)) {
        throw new UnauthorizedException('Insufficient permissions');
      }

      // Retrieve announcements
      const announcements = await this.announcementModel.find({});
      return announcements;
    } catch (error) {
      console.error('Error reading announcements:', error);
      throw new Error('An error occurred while reading announcements.');
    }
  }


  //get  details

  async getAnnouncementById(announcementId: string): Promise<Announcement> {
    try {
      const announcement = await this.announcementModel.findById(announcementId);
      
      if (!announcement) {
        throw new NotFoundException('Announcement not found');
      }

      return announcement;
    } catch (error) {
      console.error('Error getting announcement by ID:', error);
      throw new Error('An error occurred while getting the announcement by ID.');
    }
  }

  // update  announcement

  async updateAnnouncement(user: User, announcementId: string, title: string, content: string): Promise<{ message: string }> {
    try {
      // Check if the user has the 'admin' role
      if (user.role === UserRole.Admin) {
        // Find the announcement by ID
        const announcement = await this.announcementModel.findById(announcementId);

        if (!announcement) {
          throw new NotFoundException('Announcement not found');
        }

        // Update the announcement properties
        announcement.title = title;
        announcement.content = content;

        // Save the updated announcement
        await announcement.save();

        return { message: 'Announcement updated successfully' };
      } else {
        throw new UnauthorizedException('Insufficient permissions');
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw new Error('An error occurred while updating the announcement.');
    }
  }

  async deleteAnnouncement(user: User, announcementId: string): Promise<{ message: string }> {
    try {
      // Check if the user has the 'admin' role
      if (user.role === UserRole.Admin) {
        // Find the announcement by ID and delete it
        const result = await this.announcementModel.deleteOne({ _id: announcementId });

        if (result.deletedCount === 0) {
          throw new NotFoundException('Announcement not found');
        }

        return { message: 'Announcement deleted successfully' };
      } else {
        throw new UnauthorizedException('Insufficient permissions');
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw new Error('An error occurred while deleting the announcement.');
    }
  }
}