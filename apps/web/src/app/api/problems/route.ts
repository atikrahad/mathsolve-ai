import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  ProblemSearchParams,
  CreateProblemData,
  PROBLEM_CATEGORIES,
  PROBLEM_DIFFICULTY_LEVELS,
} from '@/types/problem';

// GET /api/problems - Get all problems with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search') || searchParams.get('q');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const creatorId = searchParams.get('creatorId');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (category && PROBLEM_CATEGORIES.includes(category as any)) {
      where.category = category;
    }

    if (difficulty && PROBLEM_DIFFICULTY_LEVELS.includes(difficulty as any)) {
      where.difficulty = difficulty;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } },
      ];
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
          parsedTags =
            typeof problem.tags === 'string' ? JSON.parse(problem.tags) : problem.tags || [];
        } catch (e) {
          parsedTags = [];
        }

        // Calculate average rating
        const ratings = await prisma.problemRating.findMany({
          where: { problemId: problem.id },
          select: { rating: true },
        });

        const avgRating =
          ratings.length > 0
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
    console.error('Error fetching problems:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch problems',
      },
      { status: 500 }
    );
  }
}

// POST /api/problems - Create a new problem
export async function POST(request: NextRequest) {
  try {
    const body: CreateProblemData = await request.json();

    // Validate required fields
    if (!body.title || !body.description || !body.difficulty || !body.category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title, description, difficulty, category',
        },
        { status: 400 }
      );
    }

    // Validate category
    if (!PROBLEM_CATEGORIES.includes(body.category as any)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid category',
        },
        { status: 400 }
      );
    }

    // Validate difficulty
    if (!PROBLEM_DIFFICULTY_LEVELS.includes(body.difficulty as any)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid difficulty level',
        },
        { status: 400 }
      );
    }

    // For now, we'll use a default creator ID - this should come from auth in production
    // Check if a default user exists, create one if not
    let user = await prisma.user.findFirst({
      where: { username: 'default-user' },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          username: 'default-user',
          email: 'default@example.com',
          rankPoints: 100,
          currentRank: 'Bronze',
          streakCount: 0,
        },
      });
    }

    const creatorId = user.id;

    // Create the problem
    const problem = await prisma.problem.create({
      data: {
        title: body.title,
        description: body.description,
        difficulty: body.difficulty,
        category: body.category,
        tags: JSON.stringify(body.tags || []),
        solution: body.solution,
        qualityScore: 1.0, // Default quality score
        viewCount: 0,
        attemptCount: 0,
        creatorId,
      },
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
    });

    // Parse tags for response
    let parsedTags: string[] = [];
    try {
      parsedTags = typeof problem.tags === 'string' ? JSON.parse(problem.tags) : problem.tags || [];
    } catch (e) {
      parsedTags = [];
    }

    return NextResponse.json({
      success: true,
      data: {
        ...problem,
        tags: parsedTags,
        parsedTags,
        avgRating: null,
      },
    });
  } catch (error) {
    console.error('Error creating problem:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create problem',
      },
      { status: 500 }
    );
  }
}
