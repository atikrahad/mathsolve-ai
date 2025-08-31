import { z } from 'zod';

// Resource types
export const RESOURCE_TYPES = ['TUTORIAL', 'GUIDE', 'REFERENCE'] as const;

// Difficulty levels (same as problems for consistency)
export const DIFFICULTY_LEVELS = ['LOW', 'MEDIUM', 'HIGH'] as const;

// Resource categories (same as problems for consistency)
export const RESOURCE_CATEGORIES = [
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
  'General',
  'Other',
] as const;

// Create resource schema
export const createResourceSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(200, 'Title must be less than 200 characters')
      .trim(),
    content: z
      .string()
      .min(50, 'Content must be at least 50 characters')
      .max(50000, 'Content must be less than 50,000 characters')
      .trim(),
    type: z.enum(RESOURCE_TYPES, {
      errorMap: () => ({ message: 'Type must be TUTORIAL, GUIDE, or REFERENCE' }),
    }),
    category: z
      .string()
      .min(1, 'Category is required')
      .max(50, 'Category must be less than 50 characters')
      .trim(),
    difficulty: z
      .enum(DIFFICULTY_LEVELS, {
        errorMap: () => ({ message: 'Difficulty must be LOW, MEDIUM, or HIGH' }),
      })
      .optional()
      .nullable(),
  }),
});

// Update resource schema
export const updateResourceSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(200, 'Title must be less than 200 characters')
      .trim()
      .optional(),
    content: z
      .string()
      .min(50, 'Content must be at least 50 characters')
      .max(50000, 'Content must be less than 50,000 characters')
      .trim()
      .optional(),
    type: z
      .enum(RESOURCE_TYPES, {
        errorMap: () => ({ message: 'Type must be TUTORIAL, GUIDE, or REFERENCE' }),
      })
      .optional(),
    category: z
      .string()
      .min(1, 'Category is required')
      .max(50, 'Category must be less than 50 characters')
      .trim()
      .optional(),
    difficulty: z
      .enum(DIFFICULTY_LEVELS, {
        errorMap: () => ({ message: 'Difficulty must be LOW, MEDIUM, or HIGH' }),
      })
      .optional()
      .nullable(),
  }),
});

// Resource query parameters schema
export const resourceQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => val > 0, 'Page must be greater than 0')
      .optional()
      .default('1')
      .transform((val) => (typeof val === 'string' ? parseInt(val, 10) : val)),
    limit: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100')
      .optional()
      .default('10')
      .transform((val) => (typeof val === 'string' ? parseInt(val, 10) : val)),
    category: z.string().optional(),
    type: z.enum(RESOURCE_TYPES).optional(),
    difficulty: z.enum(DIFFICULTY_LEVELS).optional(),
    authorId: z.string().optional(),
    search: z.string().max(100, 'Search term must be less than 100 characters').optional(),
    sortBy: z.enum(['createdAt', 'viewCount', 'rating', 'title']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});

// Resource parameters schema (for URL params)
export const resourceParamsSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid resource ID format'),
  }),
});

// Resource search schema
export const resourceSearchSchema = z.object({
  query: z.object({
    query: z
      .string()
      .min(1, 'Search query is required')
      .max(100, 'Search query must be less than 100 characters')
      .trim(),
    page: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => val > 0, 'Page must be greater than 0')
      .optional()
      .default('1')
      .transform((val) => (typeof val === 'string' ? parseInt(val, 10) : val)),
    limit: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => val > 0 && val <= 50, 'Limit must be between 1 and 50')
      .optional()
      .default('10')
      .transform((val) => (typeof val === 'string' ? parseInt(val, 10) : val)),
    category: z.string().optional(),
    type: z.enum(RESOURCE_TYPES).optional(),
    difficulty: z.enum(DIFFICULTY_LEVELS).optional(),
    sortBy: z.enum(['createdAt', 'viewCount', 'rating', 'title']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});

// Bookmark parameters schema
export const bookmarkParamsSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid resource ID format'),
  }),
});

// Type exports for use in controllers and services
export type CreateResourceInput = z.infer<typeof createResourceSchema>['body'];
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>['body'];
export type ResourceQueryParams = z.infer<typeof resourceQuerySchema>['query'];
export type ResourceSearchParams = z.infer<typeof resourceSearchSchema>['query'];
export type ResourceParamsType = z.infer<typeof resourceParamsSchema>['params'];

// Utility function to validate resource category
export const isValidResourceCategory = (category: string): boolean => {
  return RESOURCE_CATEGORIES.includes(category as any) || category === 'Other';
};

// Utility function to validate resource type
export const isValidResourceType = (type: string): boolean => {
  return RESOURCE_TYPES.includes(type as any);
};

// Utility function to validate difficulty
export const isValidDifficulty = (difficulty: string | null): boolean => {
  if (difficulty === null) return true;
  return DIFFICULTY_LEVELS.includes(difficulty as any);
};

// Schema for bulk operations (if needed in the future)
export const bulkResourceOperationSchema = z.object({
  body: z.object({
    resourceIds: z
      .array(z.string().cuid('Invalid resource ID format'))
      .min(1, 'At least one resource ID is required')
      .max(50, 'Maximum 50 resources can be processed at once'),
    operation: z.enum(['delete', 'bookmark', 'unbookmark'], {
      errorMap: () => ({ message: 'Operation must be delete, bookmark, or unbookmark' }),
    }),
  }),
});

export type BulkResourceOperation = z.infer<typeof bulkResourceOperationSchema>['body'];
