import { API_BASE_URL } from '@/lib/config';

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
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];

    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/users/profile/me`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(updateData: UserUpdateData): Promise<UserProfile> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/users/profile/me`, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Get user by ID (public profile)
   */
  async getUserById(id: string): Promise<UserPublicProfile> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Get user statistics
   */
  async getUserStats(id: string): Promise<UserStatistics> {
    const response = await fetch(`${API_BASE_URL}/users/${id}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user stats: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Follow a user
   */
  async followUser(id: string): Promise<void> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/users/${id}/follow`, {
      method: 'POST',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to follow user: ${response.statusText}`);
    }
  }

  /**
   * Unfollow a user
   */
  async unfollowUser(id: string): Promise<void> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/users/${id}/follow`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to unfollow user: ${response.statusText}`);
    }
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
    const queryParams = new URLSearchParams();

    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await fetch(`${API_BASE_URL}/users/search?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to search users: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(file: File): Promise<string> {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];

    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${API_BASE_URL}/users/profile/avatar`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload avatar: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.avatarUrl;
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
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/users/${userId}/followers?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch followers: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
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
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/users/${userId}/following?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch following: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }
}

export const userService = new UserService();
