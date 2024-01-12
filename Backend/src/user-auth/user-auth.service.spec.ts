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

    // Add more test cases for different scenarios (e.g., invalid username, invalid password, etc.)
  });

  // ... (other test cases)

});
