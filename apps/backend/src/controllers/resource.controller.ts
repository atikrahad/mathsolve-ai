import { Request, Response } from 'express';
import { ResourceService } from '../services/resource.service';
import { ResourceRepository } from '../repositories/resource.repository';
import {
  createResourceSchema,
  updateResourceSchema,
  resourceQuerySchema,
  resourceParamsSchema,
  resourceSearchSchema,
  ResourceQueryParams,
} from '../utils/validators/resource.validators';
import { AuthRequest } from '../types/auth.types';
import { createSuccessResponse, createErrorResponse } from '../utils/response.util';
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ServiceError,
} from '../utils/errors/service-errors';
import { logger } from '../config/logger';

export class ResourceController {
  private resourceService: ResourceService;

  constructor() {
    this.resourceService = new ResourceService(new ResourceRepository());
  }

  /**
   * Create a new learning resource
   * POST /api/resources
   */
  createResource = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const validation = createResourceSchema.safeParse({ body: req.body });

      if (!validation.success) {
        res
          .status(400)
          .json(createErrorResponse('Validation failed', 400, validation.error.errors));
        return;
      }

      const { body: resourceData } = validation.data;
      const resource = await this.resourceService.createResource(req.userId!, resourceData);

      logger.info('Resource created via API', {
        resourceId: resource.id,
        userId: req.userId,
        title: resource.title,
        type: resource.type,
        category: resource.category,
      });

      res.status(201).json(createSuccessResponse(resource, 'Resource created successfully'));
    } catch (error) {
      logger.error('Error creating resource', { error, userId: req.userId });

      if (error instanceof ValidationError) {
        res.status(400).json(createErrorResponse(error.message, 400));
        return;
      }

      if (error instanceof ServiceError) {
        res.status(500).json(createErrorResponse(error.message, 500));
        return;
      }

      res.status(500).json(createErrorResponse('Internal server error', 500));
    }
  };

  /**
   * Get all resources with pagination and filtering
   * GET /api/resources
   */
  getResources = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = resourceQuerySchema.safeParse({ query: req.query });

      if (!validation.success) {
        res
          .status(400)
          .json(createErrorResponse('Invalid query parameters', 400, validation.error.errors));
        return;
      }

      const { query: queryParams } = validation.data as { query: ResourceQueryParams };
      const result = await this.resourceService.getResources(queryParams);

      res.json(createSuccessResponse(result));
    } catch (error) {
      logger.error('Error fetching resources', { error, query: req.query });
      res.status(500).json(createErrorResponse('Internal server error', 500));
    }
  };

  /**
   * Get a single resource by ID
   * GET /api/resources/:id
   */
  getResourceById = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = resourceParamsSchema.safeParse({ params: req.params });

      if (!validation.success) {
        res
          .status(400)
          .json(createErrorResponse('Invalid resource ID', 400, validation.error.errors));
        return;
      }

      const { params } = validation.data;
      const resource = await this.resourceService.getResourceById(params.id);

      if (!resource) {
        res.status(404).json(createErrorResponse('Resource not found', 404));
        return;
      }

      // Increment view count
      await this.resourceService.incrementViewCount(params.id);

      logger.info('Resource viewed', {
        resourceId: resource.id,
        title: resource.title,
        viewCount: resource.viewCount + 1,
      });

      res.json(createSuccessResponse(resource));
    } catch (error) {
      logger.error('Error fetching resource', { error, resourceId: req.params.id });

      if (error instanceof NotFoundError) {
        res.status(404).json(createErrorResponse(error.message, 404));
        return;
      }

      res.status(500).json(createErrorResponse('Internal server error', 500));
    }
  };

  /**
   * Update a resource
   * PUT /api/resources/:id
   */
  updateResource = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const paramsValidation = resourceParamsSchema.safeParse({ params: req.params });
      const bodyValidation = updateResourceSchema.safeParse({ body: req.body });

      if (!paramsValidation.success || !bodyValidation.success) {
        res
          .status(400)
          .json(
            createErrorResponse('Validation failed', 400, [
              ...(paramsValidation.error?.errors || []),
              ...(bodyValidation.error?.errors || []),
            ])
          );
        return;
      }

      const { params } = paramsValidation.data;
      const { body: updateData } = bodyValidation.data;

      const resource = await this.resourceService.updateResource(
        params.id,
        req.userId!,
        updateData
      );

      logger.info('Resource updated via API', {
        resourceId: resource.id,
        userId: req.userId,
        title: resource.title,
      });

      res.json(createSuccessResponse(resource, 'Resource updated successfully'));
    } catch (error) {
      logger.error('Error updating resource', {
        error,
        resourceId: req.params.id,
        userId: req.userId,
      });

      if (error instanceof NotFoundError) {
        res.status(404).json(createErrorResponse(error.message, 404));
        return;
      }

      if (error instanceof ForbiddenError) {
        res.status(403).json(createErrorResponse(error.message, 403));
        return;
      }

      if (error instanceof ValidationError) {
        res.status(400).json(createErrorResponse(error.message, 400));
        return;
      }

      res.status(500).json(createErrorResponse('Internal server error', 500));
    }
  };

  /**
   * Delete a resource
   * DELETE /api/resources/:id
   */
  deleteResource = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const validation = resourceParamsSchema.safeParse({ params: req.params });

      if (!validation.success) {
        res
          .status(400)
          .json(createErrorResponse('Invalid resource ID', 400, validation.error.errors));
        return;
      }

      const { params } = validation.data;
      await this.resourceService.deleteResource(params.id, req.userId!);

      logger.info('Resource deleted via API', {
        resourceId: params.id,
        userId: req.userId,
      });

      res.json(createSuccessResponse(null, 'Resource deleted successfully'));
    } catch (error) {
      logger.error('Error deleting resource', {
        error,
        resourceId: req.params.id,
        userId: req.userId,
      });

      if (error instanceof NotFoundError) {
        res.status(404).json(createErrorResponse(error.message, 404));
        return;
      }

      if (error instanceof ForbiddenError) {
        res.status(403).json(createErrorResponse(error.message, 403));
        return;
      }

      res.status(500).json(createErrorResponse('Internal server error', 500));
    }
  };

  /**
   * Search resources
   * GET /api/resources/search
   */
  searchResources = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = resourceSearchSchema.safeParse({ query: req.query });

      if (!validation.success) {
        res
          .status(400)
          .json(createErrorResponse('Invalid search parameters', 400, validation.error.errors));
        return;
      }

      const { query: searchParams } = validation.data;
      const result = await this.resourceService.searchResources(searchParams);

      res.json(createSuccessResponse(result));
    } catch (error) {
      logger.error('Error searching resources', { error, query: req.query });
      res.status(500).json(createErrorResponse('Internal server error', 500));
    }
  };

  /**
   * Get resources by category
   * GET /api/resources/category/:category
   */
  getResourcesByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category } = req.params;
      const queryParams = {
        ...req.query,
        category,
      } as ResourceQueryParams;

      const result = await this.resourceService.getResources(queryParams);

      res.json(createSuccessResponse(result));
    } catch (error) {
      logger.error('Error fetching resources by category', {
        error,
        category: req.params.category,
      });
      res.status(500).json(createErrorResponse('Internal server error', 500));
    }
  };

  /**
   * Get resources by type
   * GET /api/resources/type/:type
   */
  getResourcesByType = async (req: Request, res: Response): Promise<void> => {
    try {
      const { type } = req.params;
      const queryParams = {
        ...req.query,
        type,
      } as ResourceQueryParams;

      const result = await this.resourceService.getResources(queryParams);

      res.json(createSuccessResponse(result));
    } catch (error) {
      logger.error('Error fetching resources by type', {
        error,
        type: req.params.type,
      });
      res.status(500).json(createErrorResponse('Internal server error', 500));
    }
  };

  /**
   * Bookmark a resource
   * POST /api/resources/:id/bookmark
   */
  bookmarkResource = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const validation = resourceParamsSchema.safeParse({ params: req.params });

      if (!validation.success) {
        res
          .status(400)
          .json(createErrorResponse('Invalid resource ID', 400, validation.error.errors));
        return;
      }

      const { params } = validation.data;
      const bookmark = await this.resourceService.bookmarkResource(params.id, req.userId!);

      logger.info('Resource bookmarked', {
        resourceId: params.id,
        userId: req.userId,
        bookmarkId: bookmark.id,
      });

      res.status(201).json(createSuccessResponse(bookmark, 'Resource bookmarked successfully'));
    } catch (error) {
      logger.error('Error bookmarking resource', {
        error,
        resourceId: req.params.id,
        userId: req.userId,
      });

      if (error instanceof NotFoundError) {
        res.status(404).json(createErrorResponse(error.message, 404));
        return;
      }

      if (error instanceof ServiceError) {
        res.status(400).json(createErrorResponse(error.message, 400));
        return;
      }

      res.status(500).json(createErrorResponse('Internal server error', 500));
    }
  };

  /**
   * Remove bookmark from a resource
   * DELETE /api/resources/:id/bookmark
   */
  removeBookmark = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const validation = resourceParamsSchema.safeParse({ params: req.params });

      if (!validation.success) {
        res
          .status(400)
          .json(createErrorResponse('Invalid resource ID', 400, validation.error.errors));
        return;
      }

      const { params } = validation.data;
      await this.resourceService.removeBookmark(params.id, req.userId!);

      logger.info('Resource bookmark removed', {
        resourceId: params.id,
        userId: req.userId,
      });

      res.json(createSuccessResponse(null, 'Bookmark removed successfully'));
    } catch (error) {
      logger.error('Error removing bookmark', {
        error,
        resourceId: req.params.id,
        userId: req.userId,
      });

      if (error instanceof NotFoundError) {
        res.status(404).json(createErrorResponse(error.message, 404));
        return;
      }

      res.status(500).json(createErrorResponse('Internal server error', 500));
    }
  };
}
