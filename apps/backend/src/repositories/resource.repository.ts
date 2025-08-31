import { Prisma, Resource, Bookmark } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { ResourceStats } from '../services/resource.service';

export interface ResourceWithDetails extends Resource {
  author: {
    id: string;
    username: string;
    profileImage: string | null;
  };
  _count: {
    bookmarks: number;
  };
  isBookmarked?: boolean;
}

export interface ResourceFilters {
  category?: string;
  type?: string;
  difficulty?: string;
  authorId?: string;
  search?: string;
}

export type ResourceSort = 'createdAt' | 'viewCount' | 'rating' | 'title';

export class ResourceRepository extends BaseRepository {
  async create(data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>): Promise<Resource> {
    return this.db.resource.create({
      data,
    });
  }

  async findById(id: string): Promise<ResourceWithDetails | null> {
    const resource = await this.db.resource.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            bookmarks: true,
          },
        },
      },
    });

    return resource;
  }

  async findMany(params: {
    filters?: ResourceFilters;
    pagination?: { page: number; limit: number };
    sort?: { field: ResourceSort; order: 'asc' | 'desc' };
    userId?: string;
  }): Promise<{ resources: ResourceWithDetails[]; total: number }> {
    const {
      filters = {},
      pagination = { page: 1, limit: 10 },
      sort = { field: 'createdAt', order: 'desc' },
      userId,
    } = params;

    const { category, type, difficulty, authorId, search } = filters;
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ResourceWhereInput = {
      ...(category && { category }),
      ...(type && { type }),
      ...(difficulty && { difficulty }),
      ...(authorId && { authorId }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
          { category: { contains: search } },
        ],
      }),
    };

    // Build order clause
    const orderBy: Prisma.ResourceOrderByWithRelationInput = {
      [sort.field]: sort.order,
    };

    // Get resources with details
    const [resources, total] = await Promise.all([
      this.db.resource.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              profileImage: true,
            },
          },
          _count: {
            select: {
              bookmarks: true,
            },
          },
          ...(userId && {
            bookmarks: {
              where: { userId },
              select: { id: true },
            },
          }),
        },
      }),
      this.db.resource.count({ where }),
    ]);

    // Add bookmark status if user is provided
    const resourcesWithBookmarkStatus = resources.map((resource: any) => {
      if (userId) {
        const isBookmarked = resource.bookmarks && resource.bookmarks.length > 0;
        const { bookmarks, ...resourceWithoutBookmarks } = resource;
        return {
          ...resourceWithoutBookmarks,
          isBookmarked,
        };
      }
      return resource;
    });

    return {
      resources: resourcesWithBookmarkStatus,
      total,
    };
  }

  async update(
    id: string,
    data: Partial<Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Resource> {
    try {
      return await this.db.resource.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Error('Resource not found');
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.db.resource.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Error('Resource not found');
      }
      throw error;
    }
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.db.resource.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }

  async createBookmark(resourceId: string, userId: string): Promise<Bookmark> {
    return this.db.bookmark.create({
      data: {
        userId,
        resourceId,
      },
    });
  }

  async findBookmark(resourceId: string, userId: string): Promise<Bookmark | null> {
    return this.db.bookmark.findFirst({
      where: {
        resourceId,
        userId,
      },
    });
  }

  async deleteBookmark(bookmarkId: string): Promise<void> {
    await this.db.bookmark.delete({
      where: { id: bookmarkId },
    });
  }

  async findBookmarkedByUser(
    userId: string,
    pagination: { page: number; limit: number }
  ): Promise<{ resources: ResourceWithDetails[]; total: number }> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
      this.db.bookmark.findMany({
        where: { userId, resourceId: { not: null } },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          resource: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  profileImage: true,
                },
              },
              _count: {
                select: {
                  bookmarks: true,
                },
              },
            },
          },
        },
      }),
      this.db.bookmark.count({
        where: { userId, resourceId: { not: null } },
      }),
    ]);

    const resources = bookmarks
      .filter((bookmark) => bookmark.resource)
      .map((bookmark) => ({
        ...bookmark.resource!,
        isBookmarked: true,
      }));

    return { resources, total };
  }

  async getStats(): Promise<ResourceStats> {
    const [totalResources, categoryStats, typeStats, difficultyStats] = await Promise.all([
      this.db.resource.count(),
      this.db.resource.groupBy({
        by: ['category'],
        _count: { category: true },
        orderBy: { _count: { category: 'desc' } },
      }),
      this.db.resource.groupBy({
        by: ['type'],
        _count: { type: true },
        orderBy: { _count: { type: 'desc' } },
      }),
      this.db.resource.groupBy({
        by: ['difficulty'],
        _count: { difficulty: true },
        where: { difficulty: { not: null } },
        orderBy: { _count: { difficulty: 'desc' } },
      }),
    ]);

    return {
      totalResources,
      byCategory: categoryStats.map((stat) => ({
        category: stat.category,
        count: stat._count.category,
      })),
      byType: typeStats.map((stat) => ({
        type: stat.type,
        count: stat._count.type,
      })),
      byDifficulty: difficultyStats.map((stat) => ({
        difficulty: stat.difficulty || 'Not specified',
        count: stat._count.difficulty,
      })),
    };
  }

  async getPopularResources(
    limit: number = 10,
    timeframe: 'day' | 'week' | 'month' | 'all' = 'all'
  ): Promise<ResourceWithDetails[]> {
    let dateFilter: Date | undefined;

    if (timeframe !== 'all') {
      const now = new Date();
      switch (timeframe) {
        case 'day':
          dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }
    }

    return this.db.resource.findMany({
      where: dateFilter ? { createdAt: { gte: dateFilter } } : {},
      take: limit,
      orderBy: [{ viewCount: 'desc' }, { rating: 'desc' }],
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            bookmarks: true,
          },
        },
      },
    });
  }

  async getRecentResources(limit: number = 10): Promise<ResourceWithDetails[]> {
    return this.db.resource.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            bookmarks: true,
          },
        },
      },
    });
  }

  async getRelatedResources(
    resourceId: string,
    category: string,
    limit: number = 5
  ): Promise<ResourceWithDetails[]> {
    return this.db.resource.findMany({
      where: {
        category,
        id: { not: resourceId },
      },
      take: limit,
      orderBy: [{ viewCount: 'desc' }, { rating: 'desc' }],
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            bookmarks: true,
          },
        },
      },
    });
  }
}