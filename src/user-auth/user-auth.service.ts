import { Injectable, NotFoundException, Logger, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user-auth.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Student } from './schemas/student.schema';



@Injectable()
export class UserAuthService {
  private readonly logger = new Logger(UserAuthService.name);
  

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
  
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

  
  async registerUser(studentId: string, schoolPassword: string, userpassword: string, username: string): Promise<{ message: string }> {
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
      const existingUserByEmail = await this.userModel.findOne({ username });
  
      if (existingUserByEmail) {
        throw new ConflictException('Username is already registered for another student');
      }
  
      // Check if the user is already registered with the same student ID
      const existingUserByStudentId = await this.userModel.findOne({ studentId });
  
      if (existingUserByStudentId) {
        throw new ConflictException('Student has already been registered');
      }
  
      // Hash the user password
      const hash = await bcrypt.hash(userpassword, 10);
  
      // Create a new user with the hashed user password
      await this.userModel.create({ studentId, userpassword: hash, username });
  
      return { message: 'User registered successfully' };
    } catch (error) {
    console.error('Error in registerUser:', error);
    if (error instanceof NotFoundException || error instanceof UnauthorizedException || error instanceof ConflictException) {
      throw error; // Return specific exception
    }
    throw new Error(`An error occurred while registering the user: ${error.message}`);
  }
  }
  
  
  async loginUser(username: string, userpassword: string): Promise<string> {
    try {
      const user = await this.userModel.findOne({ username});
  
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
      if (error instanceof NotFoundException || error instanceof UnauthorizedException || error instanceof ConflictException) {
        throw error; // Return specific exception
      }
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
  
  
}