import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ResponseUtil } from '../utils/response.util';
import { AuthenticatedRequest } from '../types/api.types';
import { ApiError } from '../utils/errors/ApiError';
import { logger } from '../config/logger';
import {
  userProfileUpdateSchema,
  userSearchSchema,
  followUserSchema,
} from '../utils/validators/user.validators';

export class UserController {
  private static userService = new UserService();

  /**
   * Get current user profile
   */
  static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const profile = await UserController.userService.getUserProfile(userId);

      ResponseUtil.success(res, {
        message: 'Profile retrieved successfully',
        data: profile,
      });
    } catch (error) {
      logger.error('Error fetching user profile:', error);

      if (error instanceof ApiError) {
        ResponseUtil.error(res, error.message, error.statusCode);
        return;
      }

      ResponseUtil.error(res, 'Failed to fetch profile', 500);
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const validatedData = userProfileUpdateSchema.parse(req.body);

      const updatedProfile = await UserController.userService.updateUserProfile(
        userId,
        validatedData
      );

      ResponseUtil.success(res, {
        message: 'Profile updated successfully',
        data: updatedProfile,
      });
    } catch (error) {
      logger.error('Error updating user profile:', error);

      if (error instanceof ApiError) {
        ResponseUtil.error(res, error.message, error.statusCode);
        return;
      }

      ResponseUtil.error(res, 'Failed to update profile', 500);
    }
  }

  /**
   * Get user by ID (public profile)
   */
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        ResponseUtil.error(res, 'User ID is required', 400);
        return;
      }

      const user = await UserController.userService.getPublicProfile(id);

      ResponseUtil.success(res, {
        message: 'User profile retrieved successfully',
        data: user,
      });
    } catch (error) {
      logger.error('Error fetching user by ID:', error);

      if (error instanceof ApiError) {
        ResponseUtil.error(res, error.message, error.statusCode);
        return;
      }

      ResponseUtil.error(res, 'Failed to fetch user profile', 500);
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStats(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        ResponseUtil.error(res, 'User ID is required', 400);
        return;
      }

      const stats = await UserController.userService.getUserStatistics(id);

      ResponseUtil.success(res, {
        message: 'User statistics retrieved successfully',
        data: stats,
      });
    } catch (error) {
      logger.error('Error fetching user statistics:', error);

      if (error instanceof ApiError) {
        ResponseUtil.error(res, error.message, error.statusCode);
        return;
      }

      ResponseUtil.error(res, 'Failed to fetch user statistics', 500);
    }
  }

  /**
   * Follow a user
   */
  static async followUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const followerId = req.user!.userId;
      const validatedData = followUserSchema.parse(req.params);
      const { id: followingId } = validatedData;

      if (followerId === followingId) {
        ResponseUtil.error(res, 'Cannot follow yourself', 400);
        return;
      }

      await UserController.userService.followUser(followerId, followingId);

      ResponseUtil.success(res, {
        message: 'User followed successfully',
      });
    } catch (error) {
      logger.error('Error following user:', error);

      if (error instanceof ApiError) {
        ResponseUtil.error(res, error.message, error.statusCode);
        return;
      }

      ResponseUtil.error(res, 'Failed to follow user', 500);
    }
  }

  /**
   * Unfollow a user
   */
  static async unfollowUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const followerId = req.user!.userId;
      const validatedData = followUserSchema.parse(req.params);
      const { id: followingId } = validatedData;

      await UserController.userService.unfollowUser(followerId, followingId);

      ResponseUtil.success(res, {
        message: 'User unfollowed successfully',
      });
    } catch (error) {
      logger.error('Error unfollowing user:', error);

      if (error instanceof ApiError) {
        ResponseUtil.error(res, error.message, error.statusCode);
        return;
      }

      ResponseUtil.error(res, 'Failed to unfollow user', 500);
    }
  }

  /**
   * Get user followers
   */
  static async getFollowers(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const followers = await UserController.userService.getFollowers(id, { page, limit });

      ResponseUtil.success(res, {
        message: 'Followers retrieved successfully',
        data: followers,
      });
    } catch (error) {
      logger.error('Error getting followers:', error);

      if (error instanceof ApiError) {
        ResponseUtil.error(res, error.message, error.statusCode);
        return;
      }

      ResponseUtil.error(res, 'Failed to get followers', 500);
    }
  }

  /**
   * Get user following
   */
  static async getFollowing(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const following = await UserController.userService.getFollowing(id, { page, limit });

      ResponseUtil.success(res, {
        message: 'Following retrieved successfully',
        data: following,
      });
    } catch (error) {
      logger.error('Error getting following:', error);

      if (error instanceof ApiError) {
        ResponseUtil.error(res, error.message, error.statusCode);
        return;
      }

      ResponseUtil.error(res, 'Failed to get following', 500);
    }
  }

  /**
   * Search users
   */
  static async searchUsers(req: Request, res: Response): Promise<void> {
    try {
      const validatedQuery = userSearchSchema.parse(req.query);
      const results = await UserController.userService.searchUsers(validatedQuery);

      ResponseUtil.success(res, {
        message: 'Users retrieved successfully',
        data: results,
      });
    } catch (error) {
      logger.error('Error searching users:', error);

      if (error instanceof ApiError) {
        ResponseUtil.error(res, error.message, error.statusCode);
        return;
      }

      ResponseUtil.error(res, 'Failed to search users', 500);
    }
  }

  /**
   * Upload avatar
   */
  static async uploadAvatar(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;

      if (!req.file) {
        ResponseUtil.error(res, 'No file uploaded', 400);
        return;
      }

      const avatarUrl = await UserController.userService.uploadAvatar(userId, req.file);

      ResponseUtil.success(res, {
        message: 'Avatar uploaded successfully',
        data: { avatarUrl },
      });
    } catch (error) {
      logger.error('Error uploading avatar:', error);

      if (error instanceof ApiError) {
        ResponseUtil.error(res, error.message, error.statusCode);
        return;
      }

      ResponseUtil.error(res, 'Failed to upload avatar', 500);
    }
  }
}
