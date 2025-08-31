import { Resource, Bookmark } from '@prisma/client';
import {
  ResourceRepository,
  ResourceWithDetails,
  ResourceFilters,
  ResourceSort,
} from '../repositories/resource.repository';
import {
  CreateResourceInput,
  UpdateResourceInput,
  ResourceSearchParams,
} from '../utils/validators/resource.validators';
import {
  ServiceError,
  NotFoundError,
  ForbiddenError,
  ValidationError,
} from '../utils/errors/service-errors';
import { logger } from '../config/logger';

export interface PaginatedResources {
  resources: ResourceWithDetails[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ResourceStats {
  totalResources: number;
  byCategory: Array<{ category: string; count: number }>;
  byType: Array<{ type: string; count: number }>;
  byDifficulty: Array<{ difficulty: string; count: number }>;
}

export class ResourceService {
  constructor(private resourceRepository: ResourceRepository) {}

  async createResource(authorId: string, data: CreateResourceInput): Promise<Resource> {
    try {
      // Validate resource type
      const validTypes = ['TUTORIAL', 'GUIDE', 'REFERENCE'];
      if (!validTypes.includes(data.type)) {
        throw new ValidationError(
          `Invalid resource type. Must be one of: ${validTypes.join(', ')}`
        );
      }

      // Validate difficulty if provided
      if (data.difficulty) {
        const validDifficulties = ['LOW', 'MEDIUM', 'HIGH'];
        if (!validDifficulties.includes(data.difficulty)) {
          throw new ValidationError(
            `Invalid difficulty level. Must be one of: ${validDifficulties.join(', ')}`
          );
        }
      }

      const resourceData = {
        ...data,
        authorId,
        viewCount: 0,
        rating: 0,
        difficulty: data.difficulty || null,
      };

      const resource = await this.resourceRepository.create(resourceData);

      logger.info('Resource created', {
        resourceId: resource.id,
        authorId,
        title: resource.title,
        type: resource.type,
        category: resource.category,
      });

      return resource;
    } catch (error) {
      logger.error('Failed to create resource', { error, authorId, data });

      if (error instanceof ValidationError) {
        throw error;
      }

      throw new ServiceError(500, 'Failed to create resource', 'ResourceService', 'createResource');
    }
  }

  async getResources(params: {
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
    difficulty?: string;
    authorId?: string;
    search?: string;
    sortBy?: ResourceSort;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResources> {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        type,
        difficulty,
        authorId,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = params;

      // Validate pagination
      if (page < 1 || limit < 1 || limit > 100) {
        throw new ValidationError('Invalid pagination parameters');
      }

      const filters: ResourceFilters = {
        category,
        type,
        difficulty,
        authorId,
        search,
      };

      const result = await this.resourceRepository.findMany({
        filters,
        pagination: { page, limit },
        sort: { field: sortBy, order: sortOrder },
      });

      const totalPages = Math.ceil(result.total / limit);

      return {
        resources: result.resources,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      logger.error('Failed to fetch resources', { error, params });

      if (error instanceof ValidationError) {
        throw error;
      }

      throw new ServiceError(500, 'Failed to fetch resources', 'ResourceService', 'getResources');
    }
  }

  async getResourceById(id: string): Promise<ResourceWithDetails | null> {
    try {
      const resource = await this.resourceRepository.findById(id);

      if (!resource) {
        return null;
      }

      return resource;
    } catch (error) {
      logger.error('Failed to fetch resource by ID', { error, id });
      throw new ServiceError(500, 'Failed to fetch resource', 'ResourceService', 'getResourceById');
    }
  }

  async updateResource(
    id: string,
    userId: string,
    data: UpdateResourceInput
  ): Promise<Resource> {
    try {
      // Check if resource exists and user owns it
      const existingResource = await this.resourceRepository.findById(id);

      if (!existingResource) {
        throw new NotFoundError('Resource not found');
      }

      if (existingResource.authorId !== userId) {
        throw new ForbiddenError('You can only update your own resources');
      }

      // Validate resource type if provided
      if (data.type) {
        const validTypes = ['TUTORIAL', 'GUIDE', 'REFERENCE'];
        if (!validTypes.includes(data.type)) {
          throw new ValidationError(
            `Invalid resource type. Must be one of: ${validTypes.join(', ')}`
          );
        }
      }

      // Validate difficulty if provided
      if (data.difficulty) {
        const validDifficulties = ['LOW', 'MEDIUM', 'HIGH'];
        if (!validDifficulties.includes(data.difficulty)) {
          throw new ValidationError(
            `Invalid difficulty level. Must be one of: ${validDifficulties.join(', ')}`
          );
        }
      }

      const updatedResource = await this.resourceRepository.update(id, data);

      logger.info('Resource updated', {
        resourceId: id,
        userId,
        title: updatedResource.title,
      });

      return updatedResource;
    } catch (error) {
      logger.error('Failed to update resource', { error, id, userId, data });

      if (
        error instanceof NotFoundError ||
        error instanceof ForbiddenError ||
        error instanceof ValidationError
      ) {
        throw error;
      }

      throw new ServiceError(500, 'Failed to update resource', 'ResourceService', 'updateResource');
    }
  }

  async deleteResource(id: string, userId: string): Promise<void> {
    try {
      // Check if resource exists and user owns it
      const existingResource = await this.resourceRepository.findById(id);

      if (!existingResource) {
        throw new NotFoundError('Resource not found');
      }

      if (existingResource.authorId !== userId) {
        throw new ForbiddenError('You can only delete your own resources');
      }

      await this.resourceRepository.delete(id);

      logger.info('Resource deleted', {
        resourceId: id,
        userId,
        title: existingResource.title,
      });
    } catch (error) {
      logger.error('Failed to delete resource', { error, id, userId });

      if (
        error instanceof NotFoundError ||
        error instanceof ForbiddenError
      ) {
        throw error;
      }

      throw new ServiceError(500, 'Failed to delete resource', 'ResourceService', 'deleteResource');
    }
  }

  async searchResources(params: ResourceSearchParams): Promise<PaginatedResources> {
    try {
      const {
        query,
        category,
        type,
        difficulty,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = params;

      // Validate pagination
      if (page < 1 || limit < 1 || limit > 100) {
        throw new ValidationError('Invalid pagination parameters');
      }

      const filters: ResourceFilters = {
        search: query,
        category,
        type,
        difficulty,
      };

      const result = await this.resourceRepository.findMany({
        filters,
        pagination: { page, limit },
        sort: { field: sortBy, order: sortOrder },
      });

      const totalPages = Math.ceil(result.total / limit);

      return {
        resources: result.resources,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      logger.error('Failed to search resources', { error, params });

      if (error instanceof ValidationError) {
        throw error;
      }

      throw new ServiceError(500, 'Failed to search resources', 'ResourceService', 'searchResources');
    }
  }

  async incrementViewCount(id: string): Promise<void> {
    try {
      await this.resourceRepository.incrementViewCount(id);
    } catch (error) {
      logger.error('Failed to increment view count', { error, id });
      // Don't throw error for view count increment failures
    }
  }

  async bookmarkResource(resourceId: string, userId: string): Promise<Bookmark> {
    try {
      // Check if resource exists
      const resource = await this.resourceRepository.findById(resourceId);
      if (!resource) {
        throw new NotFoundError('Resource not found');
      }

      // Check if already bookmarked
      const existingBookmark = await this.resourceRepository.findBookmark(resourceId, userId);
      if (existingBookmark) {
        throw new ServiceError(409, 'Resource is already bookmarked', 'ResourceService', 'bookmarkResource');
      }

      const bookmark = await this.resourceRepository.createBookmark(resourceId, userId);

      logger.info('Resource bookmarked', {
        resourceId,
        userId,
        bookmarkId: bookmark.id,
      });

      return bookmark;
    } catch (error) {
      logger.error('Failed to bookmark resource', { error, resourceId, userId });

      if (
        error instanceof NotFoundError ||
        error instanceof ServiceError
      ) {
        throw error;
      }

      throw new ServiceError(500, 'Failed to bookmark resource', 'ResourceService', 'bookmarkResource');
    }
  }

  async removeBookmark(resourceId: string, userId: string): Promise<void> {
    try {
      const bookmark = await this.resourceRepository.findBookmark(resourceId, userId);
      if (!bookmark) {
        throw new NotFoundError('Bookmark not found');
      }

      await this.resourceRepository.deleteBookmark(bookmark.id);

      logger.info('Resource bookmark removed', {
        resourceId,
        userId,
        bookmarkId: bookmark.id,
      });
    } catch (error) {
      logger.error('Failed to remove bookmark', { error, resourceId, userId });

      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new ServiceError(500, 'Failed to remove bookmark', 'ResourceService', 'removeBookmark');
    }
  }

  async getBookmarkedResources(
    userId: string,
    params: { page?: number; limit?: number }
  ): Promise<PaginatedResources> {
    try {
      const { page = 1, limit = 10 } = params;

      // Validate pagination
      if (page < 1 || limit < 1 || limit > 100) {
        throw new ValidationError('Invalid pagination parameters');
      }

      const result = await this.resourceRepository.findBookmarkedByUser(userId, {
        page,
        limit,
      });

      const totalPages = Math.ceil(result.total / limit);

      return {
        resources: result.resources,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      logger.error('Failed to fetch bookmarked resources', { error, userId, params });

      if (error instanceof ValidationError) {
        throw error;
      }

      throw new ServiceError(500, 'Failed to fetch bookmarked resources', 'ResourceService', 'getBookmarkedResources');
    }
  }

  async getResourceStats(): Promise<ResourceStats> {
    try {
      const stats = await this.resourceRepository.getStats();
      return stats;
    } catch (error) {
      logger.error('Failed to fetch resource statistics', { error });
      throw new ServiceError(500, 'Failed to fetch resource statistics', 'ResourceService', 'getResourceStats');
    }
  }

  async getResourcesByAuthor(
    authorId: string,
    params: { page?: number; limit?: number }
  ): Promise<PaginatedResources> {
    try {
      const { page = 1, limit = 10 } = params;

      return this.getResources({
        page,
        limit,
        authorId,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
    } catch (error) {
      logger.error('Failed to fetch resources by author', { error, authorId, params });

      if (error instanceof ValidationError) {
        throw error;
      }

      throw new ServiceError(500, 'Failed to fetch resources by author', 'ResourceService', 'getResourcesByAuthor');
    }
  }
}