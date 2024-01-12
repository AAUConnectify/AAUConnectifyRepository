import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { BadRequestException } from '@nestjs/common';

describe('UserAuthController', () => {
  let controller: UserAuthController;
  let authService: UserAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAuthController],
      providers: [UserAuthService],
    }).compile();

    controller = module.get<UserAuthController>(UserAuthController);
    authService = module.get<UserAuthService>(UserAuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
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

      jest.spyOn(authService, 'registerUser').mockResolvedValueOnce({
        token: 'generatedToken',
        user: { ...registerData, id: 'generatedId', password: 'hashedPassword', role: 'user' },
      });

      const result = await controller.register(registerData);

      expect(result.token).toEqual('generatedToken');
      expect(result.user).toEqual({ ...registerData, id: 'generatedId' });
    });

    it('should handle registration error and throw BadRequestException', async () => {
      jest.spyOn(authService, 'registerUser').mockRejectedValueOnce(new Error('Registration failed'));

      await expect(controller.register({} as any)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginData = {
        username: 'john_doe',
        userpassword: 'userPass',
      };

      jest.spyOn(authService, 'loginUser').mockResolvedValueOnce({
        token: 'generatedToken',
        user: { id: 'userId', username: 'john_doe', fullName: 'John Doe' },
      });

      const result = await controller.loginUser(loginData);

      expect(result.message).toEqual('Login successful');
      expect(result.token).toEqual('generatedToken');
      expect(result.user).toEqual({ id: 'userId', username: 'john_doe', fullName: 'John Doe' });
    });

    it('should handle login error and throw BadRequestException', async () => {
      jest.spyOn(authService, 'loginUser').mockRejectedValueOnce(new Error('Login failed'));

      await expect(controller.loginUser({} as any)).rejects.toThrowError(BadRequestException);
    });
  });
});
