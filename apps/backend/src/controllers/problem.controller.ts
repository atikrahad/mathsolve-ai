import { Request, Response } from 'express';
import { ProblemService } from '../services/problem.service';
import { realtimeService } from '../services/realtime.service';
import { ProblemRepository } from '../repositories/problem.repository';
import {
  createProblemSchema,
  updateProblemSchema,
  problemQuerySchema,
  problemParamsSchema,
  rateProblemSchema,
  problemSearchSchema,
  categoryStatsSchema,
} from '../utils/validators/problem.validators';
import { AuthRequest } from '../types/auth.types';
import { createSuccessResponse, createErrorResponse } from '../utils/response.util';
import { ValidationError, NotFoundError, ForbiddenError } from '../utils/errors/service-errors';
import { logger } from '../config/logger';

export class ProblemController {
  private problemService: ProblemService;

  constructor() {
    this.problemService = new ProblemService(new ProblemRepository());
  }

  /**
   * Create a new problem
   * POST /api/problems
   */
  createProblem = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const validation = createProblemSchema.safeParse({ body: req.body });

      if (!validation.success) {
        res
          .status(400)
          .json(createErrorResponse('Validation failed', 400, validation.error.errors));
        return;
      }

      const { body: problemData } = validation.data;
      const problem = await this.problemService.createProblem(req.userId!, problemData);

      logger.info('Problem created via API', {
        problemId: problem.id,
        userId: req.userId,
        ip: req.ip,
      });

      realtimeService.emitProblemCreated(problem);

      res.status(201).json(createSuccessResponse(problem, 'Problem created successfully'));
    } catch (error) {
      logger.error('Create problem error', { error, userId: req.userId });

      if (error instanceof ValidationError) {
        res.status(400).json(createErrorResponse(error.message, 400));
      } else {
        res.status(500).json(createErrorResponse('Failed to create problem', 500));
      }
    }
  };

  /**
   * Get problem by ID
   * GET /api/problems/:id
   */
  getProblem = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const paramsValidation = problemParamsSchema.safeParse({ params: req.params });

      if (!paramsValidation.success) {
        res
          .status(400)
          .json(createErrorResponse('Invalid problem ID', 400, paramsValidation.error.errors));
        return;
      }

      const { id } = paramsValidation.data.params;
      const problem = await this.problemService.getProblem(id, req.userId);

      res.json(createSuccessResponse(problem, 'Problem retrieved successfully'));
    } catch (error) {
      logger.error('Get problem error', { error, problemId: req.params.id });

      if (error instanceof NotFoundError) {
        res.status(404).json(createErrorResponse(error.message, 404));
      } else {
        res.status(500).json(createErrorResponse('Failed to retrieve problem', 500));
      }
    }
  };

  /**
   * Get problems with filtering, pagination, and sorting
   * GET /api/problems
   */
  getProblems = async (req: Request, res: Response): Promise<void> => {
    try {
      const queryValidation = problemQuerySchema.safeParse({ query: req.query });

      if (!queryValidation.success) {
        res
          .status(400)
          .json(createErrorResponse('Invalid query parameters', 400, queryValidation.error.errors));
        return;
      }

      const { page, limit, category, difficulty, search, tags, sortBy, sortOrder, creatorId } =
        queryValidation.data.query;

      const filters = {
        category,
        difficulty,
        search,
        tags,
        creatorId,
      };

      const pagination = { page, limit };
      const sort = { field: sortBy, order: sortOrder };

      const result = await this.problemService.getProblems(filters, pagination, sort);

      res.json(createSuccessResponse(result, 'Problems retrieved successfully'));
    } catch (error) {
      logger.error('Get problems error', { error, query: req.query });
      res.status(500).json(createErrorResponse('Failed to retrieve problems', 500));
    }
  };

  /**
   * Update problem
   * PUT /api/problems/:id
   */
  updateProblem = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const paramsValidation = problemParamsSchema.safeParse({ params: req.params });
      const bodyValidation = updateProblemSchema.safeParse({ body: req.body });

      if (!paramsValidation.success) {
        res
          .status(400)
          .json(createErrorResponse('Invalid problem ID', 400, paramsValidation.error.errors));
        return;
      }

      if (!bodyValidation.success) {
        res
          .status(400)
          .json(createErrorResponse('Validation failed', 400, bodyValidation.error.errors));
        return;
      }

      const { id } = paramsValidation.data.params;
      const updateData = bodyValidation.data.body;

      const updatedProblem = await this.problemService.updateProblem(id, req.userId!, updateData);

      logger.info('Problem updated via API', {
        problemId: id,
        userId: req.userId,
        updates: Object.keys(updateData),
      });

      if (updatedProblem) {
        realtimeService.emitProblemUpdated(updatedProblem as any);
      }

      res.json(createSuccessResponse(updatedProblem, 'Problem updated successfully'));
    } catch (error) {
      logger.error('Update problem error', { error, problemId: req.params.id, userId: req.userId });

      if (error instanceof NotFoundError) {
        res.status(404).json(createErrorResponse(error.message, 404));
      } else if (error instanceof ForbiddenError) {
        res.status(403).json(createErrorResponse(error.message, 403));
      } else if (error instanceof ValidationError) {
        res.status(400).json(createErrorResponse(error.message, 400));
      } else {
        res.status(500).json(createErrorResponse('Failed to update problem', 500));
      }
    }
  };

  /**
   * Delete problem
   * DELETE /api/problems/:id
   */
  deleteProblem = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const paramsValidation = problemParamsSchema.safeParse({ params: req.params });

      if (!paramsValidation.success) {
        res
          .status(400)
          .json(createErrorResponse('Invalid problem ID', 400, paramsValidation.error.errors));
        return;
      }

      const { id } = paramsValidation.data.params;
      await this.problemService.deleteProblem(id, req.userId!);

      logger.info('Problem deleted via API', {
        problemId: id,
        userId: req.userId,
      });

      realtimeService.emitProblemDeleted(id);

      res.json(createSuccessResponse(null, 'Problem deleted successfully'));
    } catch (error) {
      logger.error('Delete problem error', { error, problemId: req.params.id, userId: req.userId });

      if (error instanceof NotFoundError) {
        res.status(404).json(createErrorResponse(error.message, 404));
      } else if (error instanceof ForbiddenError) {
        res.status(403).json(createErrorResponse(error.message, 403));
      } else {
        res.status(500).json(createErrorResponse('Failed to delete problem', 500));
      }
    }
  };

  /**
   * Search problems
   * GET /api/problems/search
   */
  searchProblems = async (req: Request, res: Response): Promise<void> => {
    try {
      const queryValidation = problemSearchSchema.safeParse({ query: req.query });

      if (!queryValidation.success) {
        res
          .status(400)
          .json(
            createErrorResponse('Invalid search parameters', 400, queryValidation.error.errors)
          );
        return;
      }

      const { q: searchTerm, page, limit, category, difficulty } = queryValidation.data.query;

      const filters = { category, difficulty };
      const pagination = { page, limit };

      const result = await this.problemService.searchProblems(searchTerm, filters, pagination);

      res.json(createSuccessResponse(result, 'Search completed successfully'));
    } catch (error) {
      logger.error('Search problems error', { error, query: req.query });
      res.status(500).json(createErrorResponse('Search failed', 500));
    }
  };

  /**
   * Get problem categories
   * GET /api/problems/categories
   */
  getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const queryValidation = categoryStatsSchema.safeParse({ query: req.query });

      if (!queryValidation.success) {
        res
          .status(400)
          .json(createErrorResponse('Invalid query parameters', 400, queryValidation.error.errors));
        return;
      }

      const { includeCount } = queryValidation.data.query;
      const categories = await this.problemService.getCategoryStats(includeCount);

      res.json(createSuccessResponse({ categories }, 'Categories retrieved successfully'));
    } catch (error) {
      logger.error('Get categories error', { error });
      res.status(500).json(createErrorResponse('Failed to retrieve categories', 500));
    }
  };

  /**
   * Get aggregated stats for dashboard
   * GET /api/problems/stats
   */
  getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.problemService.getDashboardStats();
      res.json(createSuccessResponse(stats, 'Problem stats retrieved successfully'));
    } catch (error) {
      logger.error('Get dashboard stats error', { error });
      res.status(500).json(createErrorResponse('Failed to retrieve problem stats', 500));
    }
  };

  /**
   * Rate a problem
   * POST /api/problems/:id/rate
   */
  rateProblem = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const validation = rateProblemSchema.safeParse({
        params: req.params,
        body: req.body,
      });

      if (!validation.success) {
        res
          .status(400)
          .json(createErrorResponse('Validation failed', 400, validation.error.errors));
        return;
      }

      const {
        params: { id },
        body: { rating },
      } = validation.data;
      const problemRating = await this.problemService.rateProblem(id, req.userId!, rating);

      logger.info('Problem rated via API', {
        problemId: id,
        userId: req.userId,
        rating,
      });

      res.json(createSuccessResponse(problemRating, 'Problem rated successfully'));
    } catch (error) {
      logger.error('Rate problem error', { error, problemId: req.params.id, userId: req.userId });

      if (error instanceof NotFoundError) {
        res.status(404).json(createErrorResponse(error.message, 404));
      } else if (error instanceof ForbiddenError) {
        res.status(403).json(createErrorResponse(error.message, 403));
      } else if (error instanceof ValidationError) {
        res.status(400).json(createErrorResponse(error.message, 400));
      } else {
        res.status(500).json(createErrorResponse('Failed to rate problem', 500));
      }
    }
  };

  /**
   * Get user's problems
   * GET /api/problems/my
   */
  getMyProblems = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const queryValidation = problemQuerySchema.safeParse({ query: req.query });

      if (!queryValidation.success) {
        res
          .status(400)
          .json(createErrorResponse('Invalid query parameters', 400, queryValidation.error.errors));
        return;
      }

      const { page, limit } = queryValidation.data.query;
      const pagination = { page, limit };

      const result = await this.problemService.getUserProblems(req.userId!, pagination);

      res.json(createSuccessResponse(result, 'User problems retrieved successfully'));
    } catch (error) {
      logger.error('Get user problems error', { error, userId: req.userId });
      res.status(500).json(createErrorResponse('Failed to retrieve user problems', 500));
    }
  };
}
