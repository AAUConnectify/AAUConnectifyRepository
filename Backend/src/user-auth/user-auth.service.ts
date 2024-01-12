
import { Injectable, NotFoundException, Logger, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user-auth.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Student } from '../../schemas/student.schema';



@Injectable()
export class UserAuthService {
  private readonly logger = new Logger(UserAuthService.name);
  // Maintain a set of blacklisted tokens
  private readonly blacklistedTokens = new Set<string>();
  

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
  
    private jwtService: JwtService,
  ) 
  {}
  async onModuleInit(): Promise<void> {
    await this.seedStudentData();
  }

  // Method to seed student data when the app starts
async seedStudentData(): Promise<void> {
  const studentData = [
    { studentId: 'UGR/1649/32', password: '1234' },
    { studentId: 'UGR/1649/33', password: '5678' },
    { studentId: 'UGR/1649/34', password: 'abcd' },
    { studentId: 'UGR/1649/35', password: 'efgh' },
    { studentId: 'UGR/1649/36', password: 'ijkl' },
    { studentId: 'UGR/1649/37', password: 'mnop' },
    { studentId: 'UGR/1649/38', password: 'qrst' },
    { studentId: 'UGR/1649/39', password: 'uvwx' },
    { studentId: 'UGR/1649/40', password: 'yz12' },
    { studentId: 'UGR/1649/41', password: '3456' },
    { studentId: 'UGR/1649/42', password: '7890' },
    { studentId: 'UGR/1649/43', password: 'mnop' },
    { studentId: 'UGR/1649/44', password: 'qrst' },
    { studentId: 'UGR/1649/45', password: 'uvwx' },
    { studentId: 'UGR/1649/46', password: 'yz12' },
    { studentId: 'UGR/1649/47', password: '3456' },
    { studentId: 'UGR/1649/48', password: '7890' },
    { studentId: 'UGR/1649/49', password: 'mnop' },
    { studentId: 'UGR/1649/50', password: 'qrst' },
    { studentId: 'UGR/1649/51', password: 'uvwx' },
    
    
  ];

  try {
    // Iterate through the studentData array and add each student to the database
    for (const data of studentData) {
      const existingStudent = await this.studentModel.findOne({ studentId: data.studentId });

      // Only add the student if it doesn't already exist
      if (!existingStudent) {
        // Create and save the new student without hashing the password
        const newStudent = new this.studentModel({
          studentId: data.studentId,
          password: data.password,
        });

        await newStudent.save();
      }
    }

    console.log('Student data seeding complete.');
  } catch (error) {
    console.error('Error seeding student data:', error.message);
  }
}
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

  
  
  async registerUser(
    studentId: string,
    schoolPassword: string,
    userpassword: string,
    username: string,
    securityQuestion: string,
    fullName: string,
    fieldOfStudy: string,
    profilePic: string,
  ): Promise<{ token: string; user: UserDocument }> {
    try {
      // Check if the studentId exists in the database
      const existingStudent = await this.studentModel.findOne({ studentId });

      if (!existingStudent) {
        throw new NotFoundException('Student not found');
      }
      console.log('schoolPassword:', schoolPassword);
      console.log('existingStudent.password:', existingStudent.password);
      
      // Compare raw passwords (school password)
      if (existingStudent.password !== schoolPassword) {
        throw new UnauthorizedException('Invalid school password');
      }
      
      // Compare raw passwords (school password)
      if (existingStudent.password !== schoolPassword) {
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

      // Create a new user with the hashed user password and additional fields
      const newUser = await this.userModel.create({
        studentId,
        password: hash,
        username,
        securityQuestion,
        userpassword: hash,
        fullName,
        fieldOfStudy,
        profilePic,
      });

      // Generate a JWT token for the newly registered user
      const token = this.generateJwtToken(newUser);

      return { token, user: newUser };
    } catch (error) {
      console.error('Error in registerUser:', error);
      if (error instanceof NotFoundException || error instanceof UnauthorizedException || error instanceof ConflictException) {
        throw error; // Return specific exception
      }
      throw new Error(`An error occurred while registering the user: ${error.message}`);
    }
  }
  
  
  async loginUser(username: string, userpassword: string): Promise<{ token: string; user: UserDocument }> {
    try {
      const user = await this.userModel.findOne({ username });
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      // Compare the provided userpassword with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(userpassword, user.userpassword);
  
      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid login credentials');
      }
  
      // Generate a JWT token for the logged-in user
      const token = this.generateJwtToken(user);
  
      return { token, user };
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

  async resetPassword(username: string, securityQuestionAnswer: string, newPassword: string): Promise<{ message: string }> {
    try {
      const user = await this.userModel.findOne({ username });
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      // Verify the provided security question answer
      if (user.securityQuestion !== securityQuestionAnswer) {
        throw new UnauthorizedException('Incorrect security question answer');
      }
  
      // Ensure newPassword is not undefined or empty
      if (!newPassword) {
        throw new BadRequestException('New password is required');
      }
  
      // Hash the new password
      const hash = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password
      await this.userModel.findByIdAndUpdate(user._id, { userpassword: hash });
  
      return { message: 'Password reset successful' };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException || error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`An error occurred during password reset: ${error.message}`);
    }
  }

  async updateUserProfile(
    username: string,
    fullName: string,
    fieldOfStudy: string,
    profilePic: string,
  ): Promise<UserDocument> {
    try {
      const updatedUser = await this.userModel.findOneAndUpdate(
        { username },
        { fullName, fieldOfStudy, profilePic },
        { new: true }
      );
  
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
  
      return updatedUser;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`An error occurred while updating the user profile: ${error.message}`);
    }
  }
  
  

  generateJwtToken(user: UserDocument): string {
    const payload = { sub: user._id, role: user.role };
    return this.jwtService.sign(payload);
  }
  
  
  logout(token: string): void {
    this.blacklistedTokens.add(token);
  }

  // Check if a token is blacklisted (logged out)
  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
  
}
