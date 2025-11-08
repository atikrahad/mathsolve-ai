import { z } from 'zod';

// Programming challenge difficulty levels
export const DIFFICULTY_LEVELS = ['WARMUP', 'EASY', 'MEDIUM', 'HARD', 'LEGENDARY'] as const;

// Common programming categories
export const PROBLEM_CATEGORIES = [
  'Arrays',
  'Strings',
  'Linked Lists',
  'Stacks & Queues',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'Greedy',
  'Sorting',
  'Backtracking',
  'Math',
  'Bit Manipulation',
  'SQL',
  'System Design',
  'Concurrency',
  'Other',
] as const;

export const SUPPORTED_LANGUAGES = [
  'python',
  'javascript',
  'typescript',
  'java',
  'cpp',
  'go',
  'rust',
  'sql',
] as const;

// Create problem schema
export const createProblemSchema = z.object({
  body: z.object({
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case')
      .max(60, 'Slug must be less than 60 characters')
      .optional(),
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
    languages: z
      .array(z.enum(SUPPORTED_LANGUAGES))
      .min(1, 'Select at least one language')
      .max(SUPPORTED_LANGUAGES.length, 'Unsupported language provided')
      .default(['python']),
    topics: z.array(z.string().trim().min(1).max(40)).max(10, 'Maximum 10 topics allowed').optional(),
    tags: z
      .array(z.string().trim().min(1).max(30))
      .max(10, 'Maximum 10 tags allowed')
      .optional()
      .default([]),
    constraints: z.string().max(2000, 'Constraints must be less than 2000 characters').optional(),
    sampleInput: z.string().max(2000).optional(),
    sampleOutput: z.string().max(2000).optional(),
    starterCode: z.record(z.string()).optional(),
    timeLimitMs: z.number().int().positive().max(10000).optional(),
    memoryLimitKb: z.number().int().positive().max(1048576).optional(),
    solution: z.string().max(5000, 'Solution must be less than 5000 characters').optional(),
  }),
});

// Update problem schema
export const updateProblemSchema = z.object({
  body: z.object({
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case')
      .max(60, 'Slug must be less than 60 characters')
      .optional(),
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
    languages: z
      .array(z.enum(SUPPORTED_LANGUAGES))
      .min(1)
      .max(SUPPORTED_LANGUAGES.length)
      .optional(),
    topics: z.array(z.string().trim().min(1).max(40)).max(10, 'Maximum 10 topics allowed').optional(),
    tags: z.array(z.string().trim().min(1).max(30)).max(10, 'Maximum 10 tags allowed').optional(),
    constraints: z.string().max(2000).optional(),
    sampleInput: z.string().max(2000).optional(),
    sampleOutput: z.string().max(2000).optional(),
    starterCode: z.record(z.string()).optional(),
    timeLimitMs: z.number().int().positive().max(10000).optional(),
    memoryLimitKb: z.number().int().positive().max(1048576).optional(),
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
