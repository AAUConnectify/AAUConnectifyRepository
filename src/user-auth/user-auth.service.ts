import { Injectable, NotFoundException, Logger, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user-auth.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Student } from './schemas/student.schema';
import * as nodemailer from 'nodemailer';

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
    private jwtService: JwtService,
  ) {}

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
  async registerUser(studentId: string, username: string, password: string, email: string): Promise<{ message: string }> {
    try {
      // Check if the studentId exists in the database
      const existingStudent = await this.studentModel.findOne({ studentId });
  
      if (!existingStudent) {
        throw new NotFoundException('Student not found');
      }
  
      // Compare raw passwords
      if (password !== existingStudent.password) {
        throw new UnauthorizedException('Invalid password');
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
   // Generate a random 4-digit number
   const verificationCode = Math.floor(1000 + Math.random() * 9000);

      // Hash the password
      const hash = await bcrypt.hash(password, 10);
  
      // Create a new user
      await this.userModel.create({ studentId, username, password: hash, email });
        // Send email with verification code
        await this.sendVerificationEmail(email, verificationCode)
  
      return { message: 'User registered successfully' };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException || error instanceof UnauthorizedException) {
        throw error; // Rethrow specific exceptions
      }
      throw new Error('An error occurred while registering the user.');
    }
  }
  
  
  async loginUser(username: string, password: string): Promise<string> {
    try {
      const user = await this.userModel.findOne({ username });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid login credentials');
      }
      const payload = { userId: user._id };
      const token = this.jwtService.sign(payload); 
      return token;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('An error occurred while logging in');
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
  private async sendVerificationEmail(email: string, verificationCode: number): Promise<void> {
    const mailOptions = {
      from: 'abrhamwube1@gmail.com',
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${verificationCode}`,
    };

    try {
      await this.emailTransporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending verification email:', error);
      // Handle the error as needed
    }
  }
}