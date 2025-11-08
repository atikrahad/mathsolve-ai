import { Challenge as Problem, ChallengeRating as ProblemRating } from '@prisma/client';
import {
  ProblemRepository,
  ProblemWithDetails,
  ProblemFilters,
  ProblemSort,
} from '../repositories/problem.repository';
import { CreateProblemInput, UpdateProblemInput } from '../utils/validators/problem.validators';
import { ServiceError, NotFoundError, ForbiddenError } from '../utils/errors/service-errors';
import { logger } from '../config/logger';

export interface PaginatedProblems {
  problems: ProblemWithDetails[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CategoryStats {
  category: string;
  count: number;
}

export class ProblemService {
  constructor(private problemRepository: ProblemRepository) {}

  async createProblem(userId: string, data: CreateProblemInput): Promise<Problem> {
    try {
      const tagsJson = JSON.stringify(data.tags || []);
      const topicsJson = JSON.stringify(data.topics || []);
      const languagesJson = JSON.stringify(data.languages || []);
      const starterCodeJson = data.starterCode ? JSON.stringify(data.starterCode) : null;
      const slug = data.slug || this.generateSlug(data.title);

      const problemData = {
        slug,
        title: data.title,
        prompt: data.description,
        difficulty: data.difficulty,
        category: data.category,
        creatorId: userId,
        tags: tagsJson,
        topics: topicsJson,
        languages: languagesJson,
        constraints: data.constraints,
        sampleInput: data.sampleInput,
        sampleOutput: data.sampleOutput,
        starterCode: starterCodeJson,
        timeLimitMs: data.timeLimitMs ?? 2000,
        memoryLimitKb: data.memoryLimitKb ?? 256000,
        qualityScore: this.calculateInitialQualityScore(data),
        viewCount: 0,
        attemptCount: 0,
        solutionOutline: data.solution || null,
      };

      const problem = await this.problemRepository.create(problemData);

      logger.info('Problem created', {
        problemId: problem.id,
        creatorId: userId,
        title: problem.title,
      });

      return problem;
    } catch (error) {
      logger.error('Failed to create problem', { error, userId, title: data.title });
      throw new ServiceError(500, 'Failed to create problem', 'ProblemService', 'createProblem');
    }
  }

  async getProblem(id: string, userId?: string): Promise<ProblemWithDetails> {
    const problem = await this.problemRepository.findById(id);

    if (!problem) {
      throw new NotFoundError('Problem not found');
    }

    // Increment view count (fire and forget)
    this.problemRepository.incrementViewCount(id).catch((error) => {
      logger.warn('Failed to increment view count', { problemId: id, error });
    });

    const enrichedProblem = this.enrichProblem(problem);

    // If user is provided, get their rating for this problem
    if (userId) {
      try {
        const userRating = await this.problemRepository.getUserRating(id, userId);
        (enrichedProblem as any).userRating = userRating?.rating || null;
      } catch (error) {
        logger.warn('Failed to get user rating', { problemId: id, userId, error });
        (enrichedProblem as any).userRating = null;
      }
    }

    return enrichedProblem;
  }

  async getProblems(
    filters: ProblemFilters,
    pagination: { page: number; limit: number },
    sort: ProblemSort
  ): Promise<PaginatedProblems> {
    try {
      const { problems, total } = await this.problemRepository.findMany(filters, pagination, sort);

      // Parse tags for each problem
      const problemsWithParsedTags = problems.map((problem) => this.enrichProblem(problem));

      const totalPages = Math.ceil(total / pagination.limit);

      return {
        problems: problemsWithParsedTags as any,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total,
          totalPages,
          hasNext: pagination.page < totalPages,
          hasPrev: pagination.page > 1,
        },
      };
    } catch (error) {
      logger.error('Failed to get problems', { error, filters, pagination });
      throw new ServiceError(500, 'Failed to retrieve problems', 'ProblemService', 'getProblems');
    }
  }

  async updateProblem(id: string, userId: string, data: UpdateProblemInput): Promise<Problem> {
    const existingProblem = await this.problemRepository.findById(id);

    if (!existingProblem) {
      throw new NotFoundError('Problem not found');
    }

    if (existingProblem.creator.id !== userId) {
      throw new ForbiddenError('You can only update your own problems');
    }

    try {
      // Convert tags array to JSON string if provided
      let updateData: any = {
        ...(data.slug && { slug: data.slug }),
        ...(data.title && { title: data.title }),
        ...(data.description && { prompt: data.description }),
        ...(data.difficulty && { difficulty: data.difficulty }),
        ...(data.category && { category: data.category }),
        ...(data.tags && { tags: JSON.stringify(data.tags) }),
        ...(data.topics && { topics: JSON.stringify(data.topics) }),
        ...(data.languages && { languages: JSON.stringify(data.languages) }),
        ...(data.constraints && { constraints: data.constraints }),
        ...(data.sampleInput && { sampleInput: data.sampleInput }),
        ...(data.sampleOutput && { sampleOutput: data.sampleOutput }),
        ...(data.starterCode && { starterCode: JSON.stringify(data.starterCode) }),
        ...(typeof data.timeLimitMs === 'number' && { timeLimitMs: data.timeLimitMs }),
        ...(typeof data.memoryLimitKb === 'number' && { memoryLimitKb: data.memoryLimitKb }),
        ...(data.solution && { solutionOutline: data.solution }),
      };

      // Recalculate quality score if content changed
      if (data.title || data.description || data.tags || data.topics || data.languages || data.solution) {
        const newData = {
          title: data.title || existingProblem.title,
          description: data.description || existingProblem.prompt,
          tags: data.tags || JSON.parse(existingProblem.tags || '[]'),
          topics: data.topics || this.parseJsonField(existingProblem.topics, []),
          languages: data.languages || this.parseJsonField(existingProblem.languages, []),
          solution: data.solution || existingProblem.solutionOutline,
        };
        updateData.qualityScore = this.calculateQualityScore(newData, existingProblem);
      }

      const updatedProblem = await this.problemRepository.update(id, updateData);

      if (!updatedProblem) {
        throw new NotFoundError('Problem not found');
      }

      logger.info('Problem updated', {
        problemId: id,
        userId,
        updates: Object.keys(data),
      });

      return updatedProblem;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ForbiddenError) {
        throw error;
      }
      logger.error('Failed to update problem', { error, problemId: id, userId });
      throw new ServiceError(500, 'Failed to update problem', 'ProblemService', 'updateProblem');
    }
  }

  async deleteProblem(id: string, userId: string): Promise<void> {
    const existingProblem = await this.problemRepository.findById(id);

    if (!existingProblem) {
      throw new NotFoundError('Problem not found');
    }

    if (existingProblem.creator.id !== userId) {
      throw new ForbiddenError('You can only delete your own problems');
    }

    try {
      const deleted = await this.problemRepository.delete(id);

      if (!deleted) {
        throw new NotFoundError('Problem not found');
      }

      logger.info('Problem deleted', {
        problemId: id,
        userId,
        title: existingProblem.title,
      });
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ForbiddenError) {
        throw error;
      }
      logger.error('Failed to delete problem', { error, problemId: id, userId });
      throw new ServiceError(500, 'Failed to delete problem', 'ProblemService', 'deleteProblem');
    }
  }

  async rateProblem(problemId: string, userId: string, rating: number): Promise<ProblemRating> {
    const problem = await this.problemRepository.findById(problemId);

    if (!problem) {
      throw new NotFoundError('Problem not found');
    }

    if (problem.creator.id === userId) {
      throw new ForbiddenError('You cannot rate your own problems');
    }

    try {
      const problemRating = await this.problemRepository.rateProblem(problemId, userId, rating);

      // Update problem quality score (fire and forget)
      this.updateProblemQualityScore(problemId).catch((error) => {
        logger.warn('Failed to update quality score after rating', { problemId, error });
      });

      logger.info('Problem rated', {
        problemId,
        userId,
        rating,
        isUpdate: !!problemRating,
      });

      return problemRating;
    } catch (error) {
      logger.error('Failed to rate problem', { error, problemId, userId, rating });
      throw new ServiceError(500, 'Failed to rate problem', 'ProblemService', 'rateProblem');
    }
  }

  async searchProblems(
    searchTerm: string,
    filters: Omit<ProblemFilters, 'search'>,
    pagination: { page: number; limit: number }
  ): Promise<PaginatedProblems> {
    const searchFilters = {
      ...filters,
      search: searchTerm,
    };

    return this.getProblems(
      searchFilters,
      pagination,
      { field: 'qualityScore', order: 'desc' } // Sort by quality for search results
    );
  }

  async getCategories(): Promise<string[]> {
    try {
      return await this.problemRepository.getCategories();
    } catch (error) {
      logger.error('Failed to get categories', { error });
      throw new ServiceError(
        500,
        'Failed to retrieve categories',
        'ProblemService',
        'getCategories'
      );
    }
  }

  async getCategoryStats(includeCount: boolean = false): Promise<string[] | CategoryStats[]> {
    try {
      if (includeCount) {
        return await this.problemRepository.getCategoryStats();
      } else {
        return await this.problemRepository.getCategories();
      }
    } catch (error) {
      logger.error('Failed to get category stats', { error, includeCount });
      throw new ServiceError(
        500,
        'Failed to retrieve category statistics',
        'ProblemService',
        'getCategoryStats'
      );
    }
  }

  async getUserProblems(
    userId: string,
    pagination: { page: number; limit: number }
  ): Promise<{ problems: Problem[]; total: number }> {
    try {
      return await this.problemRepository.findByCreator(userId, pagination);
    } catch (error) {
      logger.error('Failed to get user problems', { error, userId });
      throw new ServiceError(
        500,
        'Failed to retrieve user problems',
        'ProblemService',
        'getUserProblems'
      );
    }
  }

  private calculateInitialQualityScore(data: CreateProblemInput): number {
    let score = 0;

    // Base score for having required fields
    score += 10;

    // Title quality (length and structure)
    if (data.title.length >= 10 && data.title.length <= 100) score += 15;
    else if (data.title.length >= 5) score += 10;

    // Description quality (length and detail)
    if (data.description.length >= 100) score += 20;
    else if (data.description.length >= 50) score += 15;
    else if (data.description.length >= 20) score += 10;

    // Tags bonus
    if (data.tags && data.tags.length > 0) {
      score += Math.min(data.tags.length * 5, 15); // Max 15 points for tags
    }

    if (data.topics && data.topics.length > 0) {
      score += Math.min(data.topics.length * 2, 10);
    }

    if (data.languages && data.languages.length > 0) {
      score += 10;
    }

    // Solution bonus
    if (data.solution && data.solution.length > 0) {
      score += 20;
    }

    // Cap at 80 for new problems (room to grow with ratings and engagement)
    return Math.min(score, 80);
  }

  private calculateQualityScore(data: any, existingProblem: any): number {
    // Start with base content score
    let score = this.calculateInitialQualityScore(data);

    // Add engagement bonuses based on existing metrics
    const viewBonus = Math.min(existingProblem.viewCount * 0.1, 10);
    const attemptBonus = Math.min(existingProblem.attemptCount * 0.5, 15);

    score += viewBonus + attemptBonus;

    return Math.min(score, 100);
  }

  private enrichProblem(problem: any) {
    return {
      ...problem,
      parsedTags: this.parseJsonField<string[]>(problem.tags, []),
      parsedTopics: this.parseJsonField<string[]>(problem.topics, []),
      supportedLanguages: this.parseJsonField<string[]>(problem.languages, []),
      starterCodeMap: this.parseJsonField<Record<string, string>>(problem.starterCode, {}),
    };
  }

  private parseJsonField<T>(value: string | null | undefined, fallback: T): T {
    if (!value) return fallback;
    try {
      const parsed = JSON.parse(value);
      return (parsed ?? fallback) as T;
    } catch {
      return fallback;
    }
  }

  private generateSlug(title: string): string {
    const base = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);
    return base || `challenge-${Date.now()}`;
  }

  private async updateProblemQualityScore(problemId: string): Promise<void> {
    try {
      const problem = await this.problemRepository.findById(problemId);
      if (!problem) return;

      const parsedTags = JSON.parse(problem.tags || '[]');
      const newScore = this.calculateQualityScore(
        {
          title: problem.title,
          description: problem.prompt,
          tags: parsedTags,
          topics: this.parseJsonField(problem.topics, []),
          languages: this.parseJsonField(problem.languages, []),
          solution: problem.solutionOutline,
        },
        {
          viewCount: problem.viewCount,
          attemptCount: problem.attemptCount,
          avgRating: problem.avgRating,
        }
      );

      // Add rating bonus
      if (problem.avgRating > 0) {
        const ratingBonus = (problem.avgRating - 1) * 5; // 0-20 bonus based on avg rating
        const finalScore = Math.min(newScore + ratingBonus, 100);
        await this.problemRepository.updateQualityScore(problemId, finalScore);
      } else {
        await this.problemRepository.updateQualityScore(problemId, newScore);
      }
    } catch (error) {
      logger.error('Failed to update quality score', { error, problemId });
    }
  }
}
