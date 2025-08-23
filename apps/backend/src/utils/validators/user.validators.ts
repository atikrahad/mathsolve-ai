import { z } from 'zod';

/**
 * Schema for user profile update
 */
export const userProfileUpdateSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username must be at most 30 characters long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),

  bio: z.string().max(500, 'Bio must be at most 500 characters long').optional(),

  profileImage: z.string().url('Profile image must be a valid URL').optional(),
});

/**
 * Schema for user search query parameters
 */
export const userSearchSchema = z.object({
  searchTerm: z
    .string()
    .min(1, 'Search term must be at least 1 character long')
    .max(100, 'Search term must be at most 100 characters long')
    .optional(),

  page: z
    .string()
    .regex(/^\d+$/, 'Page must be a positive integer')
    .transform(Number)
    .refine((n) => n >= 1, 'Page must be at least 1')
    .optional()
    .default('1'),

  limit: z
    .string()
    .regex(/^\d+$/, 'Limit must be a positive integer')
    .transform(Number)
    .refine((n) => n >= 1 && n <= 100, 'Limit must be between 1 and 100')
    .optional()
    .default('20'),

  sortBy: z.enum(['username', 'rankPoints', 'createdAt']).optional().default('username'),

  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

/**
 * Schema for follow/unfollow user parameters
 */
export const followUserSchema = z.object({
  id: z.string().uuid('User ID must be a valid UUID'),
});

/**
 * Schema for avatar upload
 */
export const avatarUploadSchema = z.object({
  mimetype: z
    .string()
    .refine(
      (type) => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(type),
      'File must be a valid image (JPEG, PNG, WebP, or GIF)'
    ),

  size: z.number().max(5 * 1024 * 1024, 'File size must be less than 5MB'),
});

/**
 * Schema for user statistics query parameters
 */
export const userStatsSchema = z.object({
  timeRange: z.enum(['week', 'month', 'quarter', 'year', 'all']).optional().default('month'),

  includeHistory: z
    .string()
    .transform((val) => val === 'true')
    .optional()
    .default('false'),
});

/**
 * Schema for updating user rank points
 */
export const updateRankPointsSchema = z.object({
  points: z
    .number()
    .int('Points must be an integer')
    .min(-1000, 'Cannot deduct more than 1000 points at once')
    .max(1000, 'Cannot add more than 1000 points at once'),

  reason: z
    .string()
    .min(1, 'Reason is required')
    .max(200, 'Reason must be at most 200 characters long'),
});

/**
 * Schema for updating user streak
 */
export const updateStreakSchema = z.object({
  count: z
    .number()
    .int('Streak count must be an integer')
    .min(0, 'Streak count cannot be negative'),
});

export type UserProfileUpdateData = z.infer<typeof userProfileUpdateSchema>;
export type UserSearchQuery = z.infer<typeof userSearchSchema>;
export type FollowUserParams = z.infer<typeof followUserSchema>;
export type AvatarUploadData = z.infer<typeof avatarUploadSchema>;
export type UserStatsQuery = z.infer<typeof userStatsSchema>;
export type UpdateRankPointsData = z.infer<typeof updateRankPointsSchema>;
export type UpdateStreakData = z.infer<typeof updateStreakSchema>;
