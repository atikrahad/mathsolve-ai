import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PROBLEM_CATEGORIES, PROBLEM_DIFFICULTY_LEVELS } from '@/types/problem';

// GET /api/problems/search - Search problems with query
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const creatorId = searchParams.get('creatorId');

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search query is required',
        },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { contains: query, mode: 'insensitive' } }
      ],
    };
    
    if (category && PROBLEM_CATEGORIES.includes(category as any)) {
      where.category = category;
    }
    
    if (difficulty && PROBLEM_DIFFICULTY_LEVELS.includes(difficulty as any)) {
      where.difficulty = difficulty;
    }
    
    if (creatorId) {
      where.creatorId = creatorId;
    }

    // Build orderBy clause
    const orderBy: any = {};
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      orderBy[sortBy] = sortOrder;
    } else if (sortBy === 'qualityScore' || sortBy === 'viewCount' || sortBy === 'attemptCount') {
      orderBy[sortBy] = sortOrder;
    } else if (sortBy === 'title') {
      orderBy.title = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    // Get problems with pagination
    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        skip,
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
        },
      }),
      prisma.problem.count({ where }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    // Process problems - parse tags and calculate average rating
    const processedProblems = await Promise.all(
      problems.map(async (problem) => {
        // Parse tags from JSON string
        let parsedTags: string[] = [];
        try {
          parsedTags = typeof problem.tags === 'string' ? JSON.parse(problem.tags) : problem.tags || [];
        } catch (e) {
          parsedTags = [];
        }

        // Calculate average rating
        const ratings = await prisma.problemRating.findMany({
          where: { problemId: problem.id },
          select: { rating: true },
        });
        
        const avgRating = ratings.length > 0 
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
          : null;

        return {
          ...problem,
          tags: parsedTags,
          parsedTags,
          avgRating,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        problems: processedProblems,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext,
          hasPrev,
        },
      },
    });
  } catch (error) {
    console.error('Error searching problems:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search problems',
      },
      { status: 500 }
    );
  }
}