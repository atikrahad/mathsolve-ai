import { z } from 'zod';

// Problem difficulty levels
export const DIFFICULTY_LEVELS = ['LOW', 'MEDIUM', 'HIGH'] as const;

// Common categories
export const PROBLEM_CATEGORIES = [
  'Algebra',
  'Calculus',
  'Geometry',
  'Statistics',
  'Trigonometry',
  'Number Theory',
  'Linear Algebra',
  'Differential Equations',
  'Combinatorics',
  'Logic',
  'Other',
] as const;

// Create problem schema
export const createProblemSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(200, 'Title must be less than 200 characters')
      .trim(),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(5000, 'Description must be less than 5000 characters')
      .trim(),
    difficulty: z.enum(DIFFICULTY_LEVELS, {
      errorMap: () => ({ message: 'Difficulty must be LOW, MEDIUM, or HIGH' }),
    }),
    category: z
      .string()
      .min(1, 'Category is required')
      .max(50, 'Category must be less than 50 characters')
      .trim(),
    tags: z
      .array(z.string().trim().min(1).max(30))
      .max(10, 'Maximum 10 tags allowed')
      .optional()
      .default([]),
    solution: z.string().max(5000, 'Solution must be less than 5000 characters').optional(),
  }),
});

// Update problem schema
export const updateProblemSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(200, 'Title must be less than 200 characters')
      .trim()
      .optional(),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(5000, 'Description must be less than 5000 characters')
      .trim()
      .optional(),
    difficulty: z
      .enum(DIFFICULTY_LEVELS, {
        errorMap: () => ({ message: 'Difficulty must be LOW, MEDIUM, or HIGH' }),
      })
      .optional(),
    category: z
      .string()
      .min(1, 'Category is required')
      .max(50, 'Category must be less than 50 characters')
      .trim()
      .optional(),
    tags: z.array(z.string().trim().min(1).max(30)).max(10, 'Maximum 10 tags allowed').optional(),
    solution: z.string().max(5000, 'Solution must be less than 5000 characters').optional(),
  }),
});

// Problem query parameters schema
export const problemQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .refine((val) => val > 0, 'Page must be a positive number'),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? Math.min(parseInt(val, 10), 50) : 20))
      .refine((val) => val > 0, 'Limit must be a positive number'),
    category: z.string().optional(),
    difficulty: z.enum(DIFFICULTY_LEVELS).optional(),
    search: z.string().max(100, 'Search term must be less than 100 characters').optional(),
    tags: z
      .string()
      .transform((val) =>
        val
          ? val
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0)
          : []
      )
      .optional(),
    sortBy: z
      .enum(['createdAt', 'qualityScore', 'viewCount', 'attemptCount', 'title'])
      .optional()
      .default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    creatorId: z.string().cuid().optional(),
  }),
});

// Problem ID parameter schema
export const problemParamsSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid problem ID format'),
  }),
});

// Rate problem schema
export const rateProblemSchema = z.object({
  body: z.object({
    rating: z
      .number()
      .int('Rating must be an integer')
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5'),
  }),
  params: z.object({
    id: z.string().cuid('Invalid problem ID format'),
  }),
});

// Problem search schema
export const problemSearchSchema = z.object({
  query: z.object({
    q: z
      .string()
      .min(1, 'Search query is required')
      .max(100, 'Search query must be less than 100 characters')
      .trim(),
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .refine((val) => val > 0, 'Page must be a positive number'),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? Math.min(parseInt(val, 10), 50) : 20))
      .refine((val) => val > 0, 'Limit must be a positive number'),
    category: z.string().optional(),
    difficulty: z.enum(DIFFICULTY_LEVELS).optional(),
  }),
});

// Category stats schema
export const categoryStatsSchema = z.object({
  query: z.object({
    includeCount: z
      .string()
      .optional()
      .transform((val) => val === 'true'),
  }),
});

// Export types
export type CreateProblemInput = z.infer<typeof createProblemSchema>['body'];
export type UpdateProblemInput = z.infer<typeof updateProblemSchema>['body'];
export type ProblemQueryParams = z.infer<typeof problemQuerySchema>['query'];
export type ProblemParams = z.infer<typeof problemParamsSchema>['params'];
export type RateProblemInput = z.infer<typeof rateProblemSchema>;
export type ProblemSearchParams = z.infer<typeof problemSearchSchema>['query'];
export type CategoryStatsParams = z.infer<typeof categoryStatsSchema>['query'];
