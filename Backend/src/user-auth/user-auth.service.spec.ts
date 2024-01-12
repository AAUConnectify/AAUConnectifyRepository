import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserAuthService } from './user-auth.service';
import { NotFoundException, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserAuthService', () => {
  let service: UserAuthService;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  const mockStudentModel = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAuthService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken('Student'),
          useValue: mockStudentModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UserAuthService>(UserAuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('should log in a user with valid credentials', async () => {
      // Arrange
      const mockUser = {
        username: 'testuser',
        userpassword: 'hashedPassword',
      };

      mockUserModel.findOne.mockResolvedValue(mockUser);
      
      // Mock the bcrypt compare function with a resolved value of true
      jest.spyOn(bcrypt, 'compare')
      mockJwtService.sign.mockReturnValue('mockToken');

      // Act
      const result = await service.loginUser('testuser', 'userpassword');

      // Assert
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(bcrypt.compare).toHaveBeenCalledWith('userpassword', 'hashedPassword');
      expect(mockJwtService.sign).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ token: 'mockToken', user: mockUser });
    });

  
  });

  // ... (other test cases)
  describe('registerUser', () => {
    it('should register a new user with valid credentials', async () => {
      // Arrange
      const registerData = {
        studentId: '123456',
        schoolPassword: 'schoolPass',
        userpassword: 'userPass',
        username: 'john_doe',
        securityQuestion: 'What is your favorite color?',
        fullName: 'John Doe',
        fieldOfStudy: 'Computer Science',
        profilePic: 'profile.jpg',
      };

      const mockExistingStudent = {
        studentId: '123456',
        password: 'schoolPass',
      };

      jest.spyOn(service, 'userExists').mockResolvedValue(true);
      jest.spyOn(mockStudentModel, 'findOne').mockResolvedValue(mockExistingStudent);
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash')
      jest.spyOn(mockUserModel, 'create').mockResolvedValue({
        _id: 'generatedId',
        ...registerData,
        password: 'hashedPassword',
        role: 'user',
      });

      // Act
      const result = await service.registerUser(
        registerData.studentId,
        registerData.schoolPassword,
        registerData.userpassword,
        registerData.username,
        registerData.securityQuestion,
        registerData.fullName,
        registerData.fieldOfStudy,
        registerData.profilePic,
      );

      // Assert
      expect(service.userExists).toHaveBeenCalledWith(registerData.studentId);
      expect(mockStudentModel.findOne).toHaveBeenCalledWith({ studentId: registerData.studentId });
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username: registerData.username });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerData.userpassword, 10);
      expect(mockUserModel.create).toHaveBeenCalledWith({
        studentId: registerData.studentId,
        password: 'hashedPassword',
        username: registerData.username,
        securityQuestion: registerData.securityQuestion,
        userpassword: 'hashedPassword',
        fullName: registerData.fullName,
        fieldOfStudy: registerData.fieldOfStudy,
        profilePic: registerData.profilePic,
      });
      expect(result).toEqual({
        token: expect.any(String),
        user: {
          id: 'generatedId',
          ...registerData,
        },
      });
    });

   
  });


  describe('UserAuthService', () => {
    // ... (previous imports and setup)
  
    describe('resetPassword', () => {
      it('should reset the password for a user with valid credentials', async () => {
        // Arrange
        const username = 'john_doe';
        const securityQuestionAnswer = 'Blue';
        const newPassword = 'newPassword';
  
        const mockUser = {
          _id: 'userId',
          username,
          securityQuestion: 'What is your favorite color?',
          userpassword: 'hashedPassword',
        };
  
        jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(mockUser);
        jest.spyOn(bcrypt, 'hash');
        jest.spyOn(mockUserModel, 'findByIdAndUpdate').mockResolvedValue({} as any);
  
        // Act
        const result = await service.resetPassword(username, securityQuestionAnswer, newPassword);
  
        // Assert
        expect(mockUserModel.findOne).toHaveBeenCalledWith({ username });
        expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
        expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith('userId', { userpassword: 'newHashedPassword' });
        expect(result).toEqual({ message: 'Password reset successful' });
      });
  
     
    });
  
    describe('logout', () => {
      it('should add a token to the blacklisted tokens set', () => {
        // Arrange
        const mockToken = 'mockToken';
  
        // Act
        service.logout(mockToken);
  
        // Assert
        expect(service.isTokenBlacklisted(mockToken)).toBeTruthy();
      });
  
      it('should not add a token to the blacklisted tokens set if already blacklisted', () => {
        // Arrange
        const mockToken = 'alreadyBlacklistedToken';
        service.logout(mockToken);
  
        // Act
        service.logout(mockToken);
  
        // Assert
        expect(service.isTokenBlacklisted(mockToken)).toBeTruthy();
      });
  
     
    });
  


  });
  
});
