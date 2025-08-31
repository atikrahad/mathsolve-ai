import { Prisma, Problem, ProblemRating } from '@prisma/client';
import { BaseRepository } from './base.repository';

export interface ProblemWithDetails extends Problem {
  creator: {
    id: string;
    username: string;
    profileImage: string | null;
  };
  _count: {
    ratings: number;
    solutions: number;
    comments: number;
  };
  avgRating: number;
}

export interface ProblemFilters {
  category?: string;
  difficulty?: string;
  tags?: string[];
  creatorId?: string;
  search?: string;
}

export interface ProblemSort {
  field: 'createdAt' | 'qualityScore' | 'viewCount' | 'attemptCount' | 'title';
  order: 'asc' | 'desc';
}

export class ProblemRepository extends BaseRepository {
  async create(data: Omit<Problem, 'id' | 'createdAt' | 'updatedAt'>): Promise<Problem> {
    return this.db.problem.create({
      data,
    });
  }

  async findById(id: string): Promise<ProblemWithDetails | null> {
    const problem = await this.db.problem.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            ratings: true,
            solutions: true,
            comments: true,
          },
        },
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    });

    if (!problem) return null;

    // Calculate average rating
    const avgRating =
      problem.ratings.length > 0
        ? problem.ratings.reduce((sum: number, r: any) => sum + r.rating, 0) /
          problem.ratings.length
        : 0;

    // Remove ratings array and add avgRating
    const { ...problemWithoutRatings } = problem;
    return {
      ...problemWithoutRatings,
      avgRating,
    };
  }

  async findMany(
    filters: ProblemFilters = {},
    pagination: { page: number; limit: number },
    sort: ProblemSort = { field: 'createdAt', order: 'desc' }
  ): Promise<{ problems: ProblemWithDetails[]; total: number }> {
    const { category, difficulty, tags, creatorId, search } = filters;
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ProblemWhereInput = {
      ...(category && { category }),
      ...(difficulty && { difficulty }),
      ...(creatorId && { creatorId }),
      ...(tags &&
        tags.length > 0 && {
          tags: {
            contains: tags.join(','), // Simple tag matching for SQLite
          },
        }),
      ...(search && {
        OR: [{ title: { contains: search } }, { description: { contains: search } }],
      }),
    };

    // Build order clause
    const orderBy: Prisma.ProblemOrderByWithRelationInput = {
      [sort.field]: sort.order,
    };

    // Get problems with details
    const [problems, total] = await Promise.all([
      this.db.problem.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy,
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              profileImage: true,
            },
          },
          _count: {
            select: {
              ratings: true,
              solutions: true,
              comments: true,
            },
          },
          ratings: {
            select: {
              rating: true,
            },
          },
        },
      }),
      this.db.problem.count({ where }),
    ]);

    // Calculate average ratings
    const problemsWithAvgRating = problems.map((problem: any) => {
      const avgRating =
        problem.ratings.length > 0
          ? problem.ratings.reduce((sum: number, r: any) => sum + r.rating, 0) /
            problem.ratings.length
          : 0;

      const { ...problemWithoutRatings } = problem;
      return {
        ...problemWithoutRatings,
        avgRating,
      };
    });

    return {
      problems: problemsWithAvgRating,
      total,
    };
  }

  async update(
    id: string,
    data: Partial<Omit<Problem, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Problem | null> {
    try {
      return await this.db.problem.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.db.problem.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.db.problem.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }

  async incrementAttemptCount(id: string): Promise<void> {
    await this.db.problem.update({
      where: { id },
      data: {
        attemptCount: {
          increment: 1,
        },
      },
    });
  }

  async rateProblem(problemId: string, userId: string, rating: number): Promise<ProblemRating> {
    return this.db.problemRating.upsert({
      where: {
        problemId_userId: {
          problemId,
          userId,
        },
      },
      update: {
        rating,
      },
      create: {
        problemId,
        userId,
        rating,
      },
    });
  }

  async getUserRating(problemId: string, userId: string): Promise<ProblemRating | null> {
    return this.db.problemRating.findUnique({
      where: {
        problemId_userId: {
          problemId,
          userId,
        },
      },
    });
  }

  async updateQualityScore(id: string, score: number): Promise<void> {
    await this.db.problem.update({
      where: { id },
      data: {
        qualityScore: score,
      },
    });
  }

  async findByCreator(
    creatorId: string,
    pagination: { page: number; limit: number }
  ): Promise<{ problems: Problem[]; total: number }> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const [problems, total] = await Promise.all([
      this.db.problem.findMany({
        where: { creatorId },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.db.problem.count({ where: { creatorId } }),
    ]);

    return { problems, total };
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.db.problem.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
      orderBy: {
        category: 'asc',
      },
    });

    return categories.map((c: any) => c.category);
  }

  async getCategoryStats(): Promise<Array<{ category: string; count: number }>> {
    const stats = await this.db.problem.groupBy({
      by: ['category'],
      _count: {
        _all: true,
      },
      orderBy: {
        category: 'asc',
      },
    });

    return stats.map((stat: any) => ({
      category: stat.category,
      count: stat._count._all,
    }));
  }
}
