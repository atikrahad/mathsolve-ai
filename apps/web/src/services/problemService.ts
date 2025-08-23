import api from '@/lib/api';
import {
  Problem,
  ProblemSearchParams,
  ProblemSearchResult,
  CreateProblemData,
  UpdateProblemData,
  ProblemAttempt,
  ProblemRating,
  ProblemCategory,
} from '@/types/problem';

class ProblemService {
  /**
   * Get all problems with search and filtering
   */
  async searchProblems(params: ProblemSearchParams = {}): Promise<ProblemSearchResult> {
    const response = await api.get('/problems/search', { params });
    return response.data.data;
  }

  /**
   * Get featured/popular problems for homepage
   */
  async getFeaturedProblems(limit: number = 10): Promise<Problem[]> {
    const response = await api.get('/problems/featured', {
      params: { limit },
    });
    return response.data.data;
  }

  /**
   * Get problem by ID
   */
  async getProblemById(id: string): Promise<Problem> {
    const response = await api.get(`/problems/${id}`);
    return response.data.data;
  }

  /**
   * Create a new problem
   */
  async createProblem(problemData: CreateProblemData): Promise<Problem> {
    const response = await api.post('/problems', problemData);
    return response.data.data;
  }

  /**
   * Update an existing problem
   */
  async updateProblem(id: string, updateData: UpdateProblemData): Promise<Problem> {
    const response = await api.put(`/problems/${id}`, updateData);
    return response.data.data;
  }

  /**
   * Delete a problem
   */
  async deleteProblem(id: string): Promise<void> {
    await api.delete(`/problems/${id}`);
  }

  /**
   * Get problems by category
   */
  async getProblemsByCategory(
    category: ProblemCategory,
    params: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' } = {}
  ): Promise<ProblemSearchResult> {
    const response = await api.get(`/problems/category/${category}`, { params });
    return response.data.data;
  }

  /**
   * Get user's created problems
   */
  async getUserProblems(
    userId?: string,
    params: { page?: number; limit?: number; includeUnpublished?: boolean } = {}
  ): Promise<ProblemSearchResult> {
    const endpoint = userId ? `/problems/user/${userId}` : '/problems/my-problems';
    const response = await api.get(endpoint, { params });
    return response.data.data;
  }

  /**
   * Submit a problem attempt
   */
  async submitAttempt(problemId: string, answer: string, hintsUsed: number = 0): Promise<{
    isCorrect: boolean;
    attempt: ProblemAttempt;
    feedback?: string;
  }> {
    const response = await api.post(`/problems/${problemId}/attempt`, {
      answer,
      hintsUsed,
    });
    return response.data.data;
  }

  /**
   * Get problem attempts for a user
   */
  async getUserAttempts(
    problemId?: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<{
    attempts: ProblemAttempt[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const endpoint = problemId ? `/problems/${problemId}/attempts` : '/problems/attempts';
    const response = await api.get(endpoint, { params });
    return response.data.data;
  }

  /**
   * Rate a problem
   */
  async rateProblem(problemId: string, rating: number, comment?: string): Promise<void> {
    await api.post(`/problems/${problemId}/rating`, { rating, comment });
  }

  /**
   * Get problem ratings
   */
  async getProblemRatings(
    problemId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<{
    ratings: Array<ProblemRating & { user: { username: string; profileImage?: string } }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await api.get(`/problems/${problemId}/ratings`, { params });
    return response.data.data;
  }

  /**
   * Bookmark/unbookmark a problem
   */
  async toggleBookmark(problemId: string): Promise<{ isBookmarked: boolean }> {
    const response = await api.post(`/problems/${problemId}/bookmark`);
    return response.data.data;
  }

  /**
   * Favorite/unfavorite a problem
   */
  async toggleFavorite(problemId: string): Promise<{ isFavorited: boolean }> {
    const response = await api.post(`/problems/${problemId}/favorite`);
    return response.data.data;
  }

  /**
   * Get bookmarked problems
   */
  async getBookmarkedProblems(
    params: { page?: number; limit?: number } = {}
  ): Promise<ProblemSearchResult> {
    const response = await api.get('/problems/bookmarked', { params });
    return response.data.data;
  }

  /**
   * Get favorited problems
   */
  async getFavoritedProblems(
    params: { page?: number; limit?: number } = {}
  ): Promise<ProblemSearchResult> {
    const response = await api.get('/problems/favorited', { params });
    return response.data.data;
  }

  /**
   * Get problem statistics
   */
  async getProblemStatistics(problemId: string): Promise<{
    totalAttempts: number;
    successfulAttempts: number;
    successRate: number;
    averageTime: number;
    hintsUsedAverage: number;
    difficultyRating: number;
    popularHints: number[];
  }> {
    const response = await api.get(`/problems/${problemId}/statistics`);
    return response.data.data;
  }

  /**
   * Get problem categories with counts
   */
  async getCategories(): Promise<Array<{
    category: ProblemCategory;
    count: number;
    recentCount: number; // problems added in last 30 days
  }>> {
    const response = await api.get('/problems/categories');
    return response.data.data;
  }

  /**
   * Get popular tags
   */
  async getPopularTags(limit: number = 20): Promise<Array<{ tag: string; count: number }>> {
    const response = await api.get('/problems/tags/popular', {
      params: { limit },
    });
    return response.data.data;
  }

  /**
   * Get problem hints
   */
  async getProblemHints(problemId: string): Promise<{
    hints: Array<{ id: string; content: string; order: number }>;
    unlockedCount: number;
  }> {
    const response = await api.get(`/problems/${problemId}/hints`);
    return response.data.data;
  }

  /**
   * Unlock next hint for a problem
   */
  async unlockHint(problemId: string): Promise<{
    hint: { id: string; content: string; order: number };
    remainingHints: number;
  }> {
    const response = await api.post(`/problems/${problemId}/hints/unlock`);
    return response.data.data;
  }

  /**
   * Get similar problems (recommendations)
   */
  async getSimilarProblems(
    problemId: string,
    limit: number = 5
  ): Promise<Problem[]> {
    const response = await api.get(`/problems/${problemId}/similar`, {
      params: { limit },
    });
    return response.data.data;
  }

  /**
   * Report a problem
   */
  async reportProblem(
    problemId: string,
    reason: string,
    description?: string
  ): Promise<void> {
    await api.post(`/problems/${problemId}/report`, {
      reason,
      description,
    });
  }
}

export const problemService = new ProblemService();
export default problemService;