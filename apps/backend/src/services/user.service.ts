import { User } from '@prisma/client';
import { UserRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/errors/ApiError';
import { logger } from '../config/logger';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

export interface UserProfileUpdateData {
  username?: string;
  bio?: string;
  profileImage?: string;
}

export interface UserPublicProfile {
  id: string;
  username: string;
  bio: string | null;
  profileImage: string | null;
  rankPoints: number;
  currentRank: string;
  streakCount: number;
  createdAt: Date;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
}

export interface UserStatistics {
  totalProblems: number;
  solvedProblems: number;
  successRate: number;
  rankPoints: number;
  currentRank: string;
  streakCount: number;
  totalHints: number;
  favoriteCategory: string;
  averageAttempts: number;
  weeklyActivity: {
    date: string;
    problemsSolved: number;
  }[];
  rankHistory: {
    date: string;
    rank: string;
    points: number;
  }[];
}

export interface UserSearchQuery {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: 'username' | 'rankPoints' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface UserSearchResult {
  users: UserPublicProfile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Get user's own profile (includes private information)
   */
  async getUserProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Update last active timestamp
    await this.userRepository.updateLastActive(userId);

    return user;
  }

  /**
   * Get public profile of a user
   */
  async getPublicProfile(userId: string, currentUserId?: string): Promise<UserPublicProfile> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Get follower counts (placeholder - will implement when following system is ready)
    const followersCount = 0; // await this.getFollowersCount(userId);
    const followingCount = 0; // await this.getFollowingCount(userId);

    // Check if current user is following this user
    const isFollowing = false;
    if (currentUserId && currentUserId !== userId) {
      // isFollowing = await this.isFollowing(currentUserId, userId);
    }

    return {
      id: user.id,
      username: user.username,
      bio: user.bio,
      profileImage: user.profileImage,
      rankPoints: user.rankPoints,
      currentRank: user.currentRank,
      streakCount: user.streakCount,
      createdAt: user.createdAt,
      followersCount,
      followingCount,
      isFollowing,
    };
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updateData: UserProfileUpdateData): Promise<User> {
    // Check if user exists
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new ApiError(404, 'User not found');
    }

    // Check if username is being updated and if it's already taken
    if (updateData.username && updateData.username !== existingUser.username) {
      const usernameExists = await this.userRepository.usernameExists(updateData.username, userId);
      if (usernameExists) {
        throw new ApiError(400, 'Username is already taken');
      }
    }

    try {
      const updatedUser = await this.userRepository.updateUser(userId, updateData);
      logger.info(`User profile updated: ${userId}`);
      return updatedUser;
    } catch (error) {
      logger.error('Error updating user profile:', error);
      throw new ApiError(500, 'Failed to update profile');
    }
  }

  /**
   * Get user statistics
   */
  async getUserStatistics(userId: string): Promise<UserStatistics> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Placeholder statistics - will implement when problem system is ready
    return {
      totalProblems: 0,
      solvedProblems: 0,
      successRate: 0,
      rankPoints: user.rankPoints,
      currentRank: user.currentRank,
      streakCount: user.streakCount,
      totalHints: 0,
      favoriteCategory: 'Algebra',
      averageAttempts: 0,
      weeklyActivity: [],
      rankHistory: [
        {
          date: new Date().toISOString(),
          rank: user.currentRank,
          points: user.rankPoints,
        },
      ],
    };
  }

  /**
   * Follow a user
   */
  async followUser(followerId: string, followingId: string): Promise<void> {
    // Check if both users exist
    const [follower, following] = await Promise.all([
      this.userRepository.findById(followerId),
      this.userRepository.findById(followingId),
    ]);

    if (!follower) {
      throw new ApiError(404, 'Follower user not found');
    }

    if (!following) {
      throw new ApiError(404, 'User to follow not found');
    }

    // TODO: Implement following relationship in database
    // For now, just log the action
    logger.info(`User ${followerId} followed user ${followingId}`);

    // Placeholder - will implement when following system database schema is ready
    // await this.createFollowRelationship(followerId, followingId);
  }

  /**
   * Unfollow a user
   */
  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    // Check if follower exists
    const follower = await this.userRepository.findById(followerId);

    if (!follower) {
      throw new ApiError(404, 'User not found');
    }

    // TODO: Implement unfollowing relationship in database
    logger.info(`User ${followerId} unfollowed user ${followingId}`);

    // Placeholder - will implement when following system database schema is ready
    // await this.removeFollowRelationship(followerId, followingId);
  }

  /**
   * Get user followers
   */
  async getFollowers(userId: string, options: { page: number; limit: number }) {
    const { page = 1, limit = 20 } = options;
    // const skip = (page - 1) * limit;

    // Placeholder implementation - will implement when following system database schema is ready
    // For now, return empty results with proper structure
    return {
      users: [] as any[],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
  }

  /**
   * Get user following
   */
  async getFollowing(userId: string, options: { page: number; limit: number }) {
    const { page = 1, limit = 20 } = options;
    // const skip = (page - 1) * limit;

    // Placeholder implementation - will implement when following system database schema is ready
    // For now, return empty results with proper structure
    return {
      users: [] as any[],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
  }

  /**
   * Search users
   */
  async searchUsers(query: UserSearchQuery): Promise<UserSearchResult> {
    const { searchTerm, page = 1, limit = 20, sortBy = 'username', sortOrder = 'asc' } = query;

    const skip = (page - 1) * limit;

    const orderBy = { [sortBy]: sortOrder };

    try {
      const users = await this.userRepository.searchUsers({
        searchTerm,
        skip,
        take: limit,
        orderBy,
      });

      // Convert to public profiles
      const publicProfiles: UserPublicProfile[] = (users as any[]).map((user: any) => ({
        id: user.id,
        username: user.username,
        bio: user.bio,
        profileImage: user.profileImage,
        rankPoints: user.rankPoints,
        currentRank: user.currentRank,
        streakCount: user.streakCount,
        createdAt: user.createdAt,
        followersCount: 0, // Placeholder
        followingCount: 0, // Placeholder
      }));

      // Get total count for pagination
      const total = await this.userRepository.count();
      const totalPages = Math.ceil(total / limit);

      return {
        users: publicProfiles,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      logger.error('Error searching users:', error);
      throw new ApiError(500, 'Failed to search users');
    }
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(userId: string, file: Express.Multer.File): Promise<string> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    try {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'uploads', 'avatars');
      await fs.mkdir(uploadsDir, { recursive: true });

      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const fileName = `${userId}_${crypto.randomUUID()}${fileExtension}`;
      const filePath = path.join(uploadsDir, fileName);

      // Save file
      await fs.writeFile(filePath, file.buffer);

      // Create URL for the uploaded file
      const avatarUrl = `/uploads/avatars/${fileName}`;

      // Update user profile with new avatar URL
      await this.userRepository.updateUser(userId, {
        profileImage: avatarUrl,
      });

      // Clean up old avatar if exists
      if (user.profileImage && user.profileImage.startsWith('/uploads/')) {
        const oldFilePath = path.join(process.cwd(), user.profileImage);
        try {
          await fs.unlink(oldFilePath);
        } catch (error) {
          // Ignore errors when cleaning up old file
          logger.warn(`Failed to delete old avatar file: ${oldFilePath}`);
        }
      }

      logger.info(`Avatar uploaded for user ${userId}: ${avatarUrl}`);
      return avatarUrl;
    } catch (error) {
      logger.error('Error uploading avatar:', error);
      throw new ApiError(500, 'Failed to upload avatar');
    }
  }

  /**
   * Update user's rank points and potentially rank
   */
  async updateUserRankPoints(userId: string, points: number): Promise<User> {
    const updatedUser = await this.userRepository.incrementRankPoints(userId, points);

    // Update rank based on points (simple rank system)
    let newRank = updatedUser.currentRank;

    if (updatedUser?.rankPoints >= 10000) {
      newRank = 'Diamond';
    } else if (updatedUser?.rankPoints >= 5000) {
      newRank = 'Platinum';
    } else if (updatedUser?.rankPoints >= 2500) {
      newRank = 'Gold';
    } else if (updatedUser?.rankPoints >= 1000) {
      newRank = 'Silver';
    } else {
      newRank = 'Bronze';
    }

    if (newRank !== updatedUser.currentRank) {
      const finalUser = await this.userRepository.updateUser(userId, {
        currentRank: newRank,
      });

      logger.info(`User ${userId} rank updated from ${updatedUser.currentRank} to ${newRank}`);
      return finalUser;
    }

    return updatedUser;
  }

  /**
   * Update user streak count
   */
  async updateUserStreak(userId: string, count: number): Promise<User> {
    return await this.userRepository.updateStreakCount(userId, count);
  }
}
