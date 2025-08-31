import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PROBLEM_CATEGORIES } from '@/types/problem';

// GET /api/problems/categories - Get all categories with optional counts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeCount = searchParams.get('includeCount') === 'true';

    if (includeCount) {
      // Get categories with problem counts
      const categoryCounts = await prisma.problem.groupBy({
        by: ['category'],
        _count: {
          category: true,
        },
      });

      // Map to include all categories (even with 0 count)
      const categoriesWithCounts = PROBLEM_CATEGORIES.map((category) => {
        const found = categoryCounts.find((c) => c.category === category);
        return {
          category,
          count: found?._count.category || 0,
        };
      });

      return NextResponse.json({
        success: true,
        data: {
          categories: categoriesWithCounts,
        },
      });
    } else {
      // Return just the category names
      return NextResponse.json({
        success: true,
        data: {
          categories: [...PROBLEM_CATEGORIES],
        },
      });
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}