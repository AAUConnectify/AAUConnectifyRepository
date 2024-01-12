import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcements.service';
import { AuthGuard } from '../guard/auth.guard';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import mongoose from 'mongoose';

describe('AnnouncementController', () => {
  let controller: AnnouncementController;
  let announcementService: AnnouncementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnnouncementController],
      providers: [AnnouncementService],
    })
    .overrideGuard(AuthGuard) // Override the AuthGuard for testing purposes
    .useValue({
      canActivate: jest.fn().mockReturnValue(true),
    })
    .compile();

    controller = module.get<AnnouncementController>(AnnouncementController);
    announcementService = module.get<AnnouncementService>(AnnouncementService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('likeAnnouncement', () => {
    it('should like an announcement for the authenticated user', async () => {
      // Arrange
      const mockRequest = {
        user: { id: 'userId', username: 'john_doe' },
      };

      jest.spyOn(announcementService, 'likeAnnouncement').mockResolvedValue({
        message: 'Liked successfully',
        announcement: {
          
          title: 'Test Announcement',
          content: 'This is a test announcement.',
          annProfile :'img/hello.png'
          
        },
      });

      // Act
      const result = await controller.likeAnnouncement('announcementId', mockRequest as any);

      // Assert
      expect(announcementService.likeAnnouncement).toHaveBeenCalledWith(mockRequest.user, 'announcementId');
      expect(result).toEqual({
        message: 'Liked successfully',
        announcement: {
          id: 'announcementId',
          title: 'Test Announcement',
          content: 'This is a test announcement.',
          likes: ['userId'],
        },
      });
    });

    it('should handle like announcement error and throw BadRequestException', async () => {
      // Arrange
      const mockRequest = {
        user: { id: 'userId', username: 'john_doe' },
      };

      jest.spyOn(announcementService, 'likeAnnouncement').mockRejectedValueOnce(new Error('Like failed'));

      // Act & Assert
      await expect(controller.likeAnnouncement('announcementId', mockRequest as any)).rejects.toThrowError(BadRequestException);
    });
  });

 
  describe('createAnnouncement', () => {
    it('should create an announcement for the authenticated user', async () => {
      // Arrange
      const mockRequest = {
        user: { id: 'userId', username: 'john_doe' },
      };

      const mockAnnouncementData = {
        title: 'Test Announcement',
        content: 'This is a test announcement.',
        annProfile: 'profile.jpg',
      };

      jest.spyOn(announcementService, 'createAnnouncement').mockResolvedValue({
      
        ...mockAnnouncementData,
       
        
      });

      // Act
      const result = await controller.createAnnouncement(mockAnnouncementData, mockRequest as any);

      // Assert
      expect(announcementService.createAnnouncement).toHaveBeenCalledWith(
        mockRequest.user,
        mockAnnouncementData.title,
        mockAnnouncementData.content,
        mockAnnouncementData.annProfile,
      );
      expect(result).toEqual({
        id: 'announcementId',
        ...mockAnnouncementData,
        createdBy: 'userId',
        createdAt: expect.any(Date),
      });
    });

    it('should handle create announcement error and throw BadRequestException', async () => {
      // Arrange
      const mockRequest = {
        user: { id: 'userId', username: 'john_doe' },
      };

      const mockAnnouncementData = {
        title: 'Test Announcement',
        content: 'This is a test announcement.',
        annProfile: 'profile.jpg',
      };

      jest.spyOn(announcementService, 'createAnnouncement').mockRejectedValueOnce(new Error('Create announcement failed'));

      // Act & Assert
      await expect(controller.createAnnouncement(mockAnnouncementData, mockRequest as any)).rejects.toThrowError(BadRequestException);
    });
  });


  describe('getAnnouncements', () => {
    it('should get a list of announcements for the authenticated user', async () => {
      // Arrange
      const mockRequest = {
        user: { id: 'userId', username: 'john_doe' },
      };

      const mockAnnouncements = [
        {
          id: 'announcementId1',
          title: 'Announcement 1',
          content: 'Content 1',
          createdAt: new Date(),
          createdBy: 'userId',
        },
        {
          id: 'announcementId2',
          title: 'Announcement 2',
          content: 'Content 2',
          createdAt: new Date(),
          createdBy: 'userId',
        },
      ];

      jest.spyOn(announcementService, 'readAnnouncements')

      // Act
      const result = await controller.getAnnouncements(mockRequest as any);

      // Assert
      expect(announcementService.readAnnouncements).toHaveBeenCalledWith(mockRequest.user);
      expect(result).toEqual(mockAnnouncements);
    });

    it('should handle get announcements error and throw UnauthorizedException', async () => {
      // Arrange
      const mockRequest = {
        user: { id: 'userId', username: 'john_doe' },
      };

      jest.spyOn(announcementService, 'readAnnouncements').mockRejectedValueOnce(new Error('Get announcements failed'));

      // Act & Assert
      await expect(controller.getAnnouncements(mockRequest as any)).rejects.toThrowError(UnauthorizedException);
    });
  });


  describe('updateAnnouncement', () => {
    it('should update an announcement for the authenticated user', async () => {
      // Arrange
      const mockRequest = {
        user: { id: 'userId', username: 'john_doe' },
      };

      const mockAnnouncementData = {
        title: 'Updated Announcement',
        content: 'Updated content',
        annProfile: 'updated_profile.jpg',
      };

      jest.spyOn(announcementService, 'updateAnnouncement').mockResolvedValue({
      
        ...mockAnnouncementData,
       
      });

      // Act
      const result = await controller.updateAnnouncement('announcementId', mockAnnouncementData, mockRequest as any);

      // Assert
      expect(announcementService.updateAnnouncement).toHaveBeenCalledWith(
        mockRequest.user,
        'announcementId',
        mockAnnouncementData.title,
        mockAnnouncementData.content,
        mockAnnouncementData.annProfile,
      );
      expect(result).toEqual({
        id: 'announcementId',
        ...mockAnnouncementData,
        createdBy: 'userId',
        createdAt: expect.any(Date),
      });
    });

    it('should handle update announcement error and throw BadRequestException', async () => {
      // Arrange
      const mockRequest = {
        user: { id: 'userId', username: 'john_doe' },
      };

      const mockAnnouncementData = {
        title: 'Updated Announcement',
        content: 'Updated content',
        annProfile: 'updated_profile.jpg',
      };

      jest.spyOn(announcementService, 'updateAnnouncement').mockRejectedValueOnce(new Error('Update announcement failed'));

      // Act & Assert
      await expect(controller.updateAnnouncement('announcementId', mockAnnouncementData, mockRequest as any)).rejects.toThrowError(BadRequestException);
    });
  });


  describe('deleteAnnouncement', () => {
    it('should delete an announcement for the authenticated user', async () => {
      // Arrange
      const mockRequest = {
        user: { id: 'userId', username: 'john_doe' },
      };

      jest.spyOn(announcementService, 'deleteAnnouncement').mockResolvedValue();

      // Act
      const result = await controller.deleteAnnouncement('announcementId', mockRequest as any);

      // Assert
      expect(announcementService.deleteAnnouncement).toHaveBeenCalledWith(mockRequest.user, 'announcementId');
      expect(result).toEqual({ message: 'Announcement deleted successfully' });
    });

    it('should handle delete announcement error and throw BadRequestException', async () => {
      // Arrange
      const mockRequest = {
        user: { id: 'userId', username: 'john_doe' },
      };

      jest.spyOn(announcementService, 'deleteAnnouncement').mockRejectedValueOnce(new Error('Delete announcement failed'));

      // Act & Assert
      await expect(controller.deleteAnnouncement('announcementId', mockRequest as any)).rejects.toThrowError(BadRequestException);
    });
  });
});
