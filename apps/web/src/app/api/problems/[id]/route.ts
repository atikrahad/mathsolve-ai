import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UpdateProblemData } from '@/types/problem';

// GET /api/problems/[id] - Get problem by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const problemId = params.id;

    if (!problemId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Problem ID is required',
        },
        { status: 400 }
      );
    }

    // Increment view count and get problem
    const problem = await prisma.problem.update({
      where: { id: problemId },
      data: { viewCount: { increment: 1 } },
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

    if (!problem) {
      return NextResponse.json(
        {
          success: false,
          error: 'Problem not found',
        },
        { status: 404 }
      );
    }

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

    return NextResponse.json({
      success: true,
      data: {
        ...problem,
        tags: parsedTags,
        parsedTags,
        avgRating,
      },
    });
  } catch (error) {
    console.error('Error fetching problem:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch problem',
      },
      { status: 500 }
    );
  }
}

// PUT /api/problems/[id] - Update problem
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const problemId = params.id;
    const body: UpdateProblemData = await request.json();

    if (!problemId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Problem ID is required',
        },
        { status: 400 }
      );
    }

    // Check if problem exists
    const existingProblem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!existingProblem) {
      return NextResponse.json(
        {
          success: false,
          error: 'Problem not found',
        },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (body.title) updateData.title = body.title;
    if (body.description) updateData.description = body.description;
    if (body.difficulty) updateData.difficulty = body.difficulty;
    if (body.category) updateData.category = body.category;
    if (body.tags) updateData.tags = JSON.stringify(body.tags);
    if (body.solution !== undefined) updateData.solution = body.solution;

    // Update the problem
    const updatedProblem = await prisma.problem.update({
      where: { id: problemId },
      data: updateData,
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
      parsedTags = typeof updatedProblem.tags === 'string' ? JSON.parse(updatedProblem.tags) : updatedProblem.tags || [];
    } catch (e) {
      parsedTags = [];
    }

    // Calculate average rating
    const ratings = await prisma.problemRating.findMany({
      where: { problemId: updatedProblem.id },
      select: { rating: true },
    });
    
    const avgRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
      : null;

    return NextResponse.json({
      success: true,
      data: {
        ...updatedProblem,
        tags: parsedTags,
        parsedTags,
        avgRating,
      },
    });
  } catch (error) {
    console.error('Error updating problem:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update problem',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/problems/[id] - Delete problem
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const problemId = params.id;

    if (!problemId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Problem ID is required',
        },
        { status: 400 }
      );
    }

    // Check if problem exists
    const existingProblem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!existingProblem) {
      return NextResponse.json(
        {
          success: false,
          error: 'Problem not found',
        },
        { status: 404 }
      );
    }

    // Delete related records first (ratings, comments, solutions)
    await prisma.$transaction(async (tx) => {
      await tx.problemRating.deleteMany({ where: { problemId } });
      await tx.problem.delete({ where: { id: problemId } });
    });

    return NextResponse.json({
      success: true,
      message: 'Problem deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting problem:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete problem',
      },
      { status: 500 }
    );
  }
}