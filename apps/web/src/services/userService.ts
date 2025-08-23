import api from '@/lib/api';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  bio?: string;
  profileImage?: string;
  rankPoints: number;
  currentRank: string;
  streakCount: number;
  createdAt: string;
  lastActiveAt?: string;
}

export interface UserPublicProfile {
  id: string;
  username: string;
  bio: string | null;
  profileImage: string | null;
  rankPoints: number;
  currentRank: string;
  streakCount: number;
  createdAt: string;
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

export interface UserSearchResult {
  users: UserPublicProfile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserUpdateData {
  username?: string;
  bio?: string;
  profileImage?: string;
}

export interface FollowersFollowingResult {
  users: UserPublicProfile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class UserService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await api.get('/users/profile/me');
    return response.data.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(updateData: UserUpdateData): Promise<UserProfile> {
    const response = await api.put('/users/profile/me', updateData);
    return response.data.data;
  }

  /**
   * Get user by ID (public profile)
   */
  async getUserById(id: string): Promise<UserPublicProfile> {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  }

  /**
   * Get user statistics
   */
  async getUserStats(id: string): Promise<UserStatistics> {
    const response = await api.get(`/users/${id}/stats`);
    return response.data.data;
  }

  /**
   * Follow a user
   */
  async followUser(id: string): Promise<void> {
    await api.post(`/users/${id}/follow`);
  }

  /**
   * Unfollow a user
   */
  async unfollowUser(id: string): Promise<void> {
    await api.delete(`/users/${id}/follow`);
  }

  /**
   * Search users
   */
  async searchUsers(params: {
    searchTerm?: string;
    page?: number;
    limit?: number;
    sortBy?: 'username' | 'rankPoints' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }): Promise<UserSearchResult> {
    const response = await api.get('/users/search', { params });
    return response.data.data;
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/users/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.avatarUrl;
  }

  /**
   * Get user's followers
   */
  async getFollowers(
    userId: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<FollowersFollowingResult> {
    const response = await api.get(`/users/${userId}/followers`, { params });
    return response.data.data;
  }

  /**
   * Get user's following
   */
  async getFollowing(
    userId: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<FollowersFollowingResult> {
    const response = await api.get(`/users/${userId}/following`, { params });
    return response.data.data;
  }
}

export const userService = new UserService();
