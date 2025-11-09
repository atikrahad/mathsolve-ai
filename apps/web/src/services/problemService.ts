import api from '@/lib/api';
import {
  Problem,
  ProblemSearchParams,
  ProblemSearchResult,
  CreateProblemData,
  UpdateProblemData,
  ProblemAttempt,
  ProblemRating,
  ProblemDifficulty,
} from '@/types/problem';

class ProblemService {
  /**
   * Get all problems with pagination, filtering, and sorting
   */
  async getProblems(params: ProblemSearchParams = {}): Promise<ProblemSearchResult> {
    const response = await api.get('/problems', { params });
    return response.data.data;
  }

  /**
   * Search problems with query string
   */
  async searchProblems(params: ProblemSearchParams & { q: string }): Promise<ProblemSearchResult> {
    const response = await api.get('/problems/search', { params });
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
  async updateProblem(id: string, problemData: UpdateProblemData): Promise<Problem> {
    const response = await api.put(`/problems/${id}`, problemData);
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
    category: string,
    params: Omit<ProblemSearchParams, 'category'> = {}
  ): Promise<ProblemSearchResult> {
    const response = await api.get('/problems', {
      params: { ...params, category },
    });
    return response.data.data;
  }

  /**
   * Get current user's problems
   */
  async getUserProblems(
    params: { page?: number; limit?: number } = {}
  ): Promise<{ problems: Problem[]; total: number }> {
    const response = await api.get('/problems/my', { params });
    return response.data.data;
  }

  /**
   * Rate a problem
   */
  async rateProblem(problemId: string, rating: number): Promise<ProblemRating> {
    const response = await api.post(`/problems/${problemId}/rate`, { rating });
    return response.data.data;
  }

  /**
   * Get problem categories
   */
  async getCategories(
    includeCount: boolean = false
  ): Promise<{ categories: string[] | Array<{ category: string; count: number }> }> {
    const response = await api.get('/problems/categories', {
      params: { includeCount: includeCount.toString() },
    });
    return response.data.data;
  }

  async getDashboardStats(): Promise<{
    categories: Array<{ category: string; count: number }>;
    difficulties: Array<{ difficulty: ProblemDifficulty; count: number }>;
  }> {
    const response = await api.get('/problems/stats');
    return response.data.data;
  }

  /**
   * Get featured problems (highest quality score)
   */
  async getFeaturedProblems(limit: number = 10): Promise<Problem[]> {
    const response = await api.get('/problems', {
      params: {
        sortBy: 'qualityScore',
        sortOrder: 'desc',
        limit,
      },
    });
    return response.data.data.problems;
  }

  /**
   * Get popular problems (most views)
   */
  async getPopularProblems(limit: number = 10): Promise<Problem[]> {
    const response = await api.get('/problems', {
      params: {
        sortBy: 'viewCount',
        sortOrder: 'desc',
        limit,
      },
    });
    return response.data.data.problems;
  }

  /**
   * Get recent problems
   */
  async getRecentProblems(limit: number = 10): Promise<Problem[]> {
    const response = await api.get('/problems', {
      params: {
        sortBy: 'createdAt',
        sortOrder: 'desc',
        limit,
      },
    });
    return response.data.data.problems;
  }

  /**
   * Get problems by difficulty
   */
  async getProblemsByDifficulty(
    difficulty: 'LOW' | 'MEDIUM' | 'HIGH',
    params: Omit<ProblemSearchParams, 'difficulty'> = {}
  ): Promise<ProblemSearchResult> {
    const response = await api.get('/problems', {
      params: { ...params, difficulty },
    });
    return response.data.data;
  }

  /**
   * Get problems with specific tags
   */
  async getProblemsByTags(
    tags: string[],
    params: Omit<ProblemSearchParams, 'tags'> = {}
  ): Promise<ProblemSearchResult> {
    const response = await api.get('/problems', {
      params: { ...params, tags: tags.join(',') },
    });
    return response.data.data;
  }
}

const problemService = new ProblemService();
export default problemService;
