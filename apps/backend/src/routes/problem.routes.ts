import { Router } from 'express';
import { ProblemController } from '../controllers/problem.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { createRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();
const problemController = new ProblemController();

// Rate limiters for different operations
const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

const createLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 problem creations per hour
  message: 'Too many problems created from this IP, please try again later.',
});

const rateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 ratings per hour
  message: 'Too many ratings from this IP, please try again later.',
});

const searchLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Higher limit for search as it's a core feature
  message: 'Too many search requests from this IP, please try again later.',
});

// Public routes (no authentication required)

/**
 * @route   GET /api/problems
 * @desc    Get problems with filtering, pagination, and sorting
 * @access  Public
 * @query   {number} [page=1] - Page number
 * @query   {number} [limit=20] - Number of problems per page (max 50)
 * @query   {string} [category] - Filter by category
 * @query   {string} [difficulty] - Filter by difficulty (LOW, MEDIUM, HIGH)
 * @query   {string} [search] - Search term for title/description
 * @query   {string} [tags] - Comma-separated tags to filter by
 * @query   {string} [sortBy=createdAt] - Sort field (createdAt, qualityScore, viewCount, attemptCount, title)
 * @query   {string} [sortOrder=desc] - Sort order (asc, desc)
 * @query   {string} [creatorId] - Filter by creator ID
 */
router.get('/', generalLimiter, problemController.getProblems);

/**
 * @route   GET /api/problems/search
 * @desc    Search problems with advanced filtering
 * @access  Public
 * @query   {string} q - Search query (required)
 * @query   {number} [page=1] - Page number
 * @query   {number} [limit=20] - Number of results per page (max 50)
 * @query   {string} [category] - Filter by category
 * @query   {string} [difficulty] - Filter by difficulty
 */
router.get('/search', searchLimiter, problemController.searchProblems);

/**
 * @route   GET /api/problems/categories
 * @desc    Get all problem categories with optional count statistics
 * @access  Public
 * @query   {boolean} [includeCount=false] - Include problem count for each category
 */
router.get('/categories', generalLimiter, problemController.getCategories);

/**
 * @route   GET /api/problems/:id
 * @desc    Get problem by ID with detailed information
 * @access  Public (but shows user-specific data if authenticated)
 * @param   {string} id - Problem ID (CUID format)
 */
router.get('/:id', generalLimiter, problemController.getProblem);

// Protected routes (authentication required)

/**
 * @route   POST /api/problems
 * @desc    Create a new problem
 * @access  Private
 * @body    {string} title - Problem title (1-200 chars)
 * @body    {string} description - Problem description (10-5000 chars)
 * @body    {string} difficulty - Problem difficulty (LOW, MEDIUM, HIGH)
 * @body    {string} category - Problem category (1-50 chars)
 * @body    {string[]} [tags] - Array of tags (max 10 tags, 30 chars each)
 * @body    {string} [solution] - Problem solution (max 5000 chars)
 */
router.post('/', createLimiter, authenticateToken, problemController.createProblem);

/**
 * @route   GET /api/problems/my
 * @desc    Get current user's problems
 * @access  Private
 * @query   {number} [page=1] - Page number
 * @query   {number} [limit=20] - Number of problems per page
 */
router.get('/my', generalLimiter, authenticateToken, problemController.getMyProblems);

/**
 * @route   PUT /api/problems/:id
 * @desc    Update a problem (only by creator)
 * @access  Private
 * @param   {string} id - Problem ID
 * @body    {string} [title] - Updated title (1-200 chars)
 * @body    {string} [description] - Updated description (10-5000 chars)
 * @body    {string} [difficulty] - Updated difficulty (LOW, MEDIUM, HIGH)
 * @body    {string} [category] - Updated category (1-50 chars)
 * @body    {string[]} [tags] - Updated tags array (max 10 tags)
 * @body    {string} [solution] - Updated solution (max 5000 chars)
 */
router.put('/:id', generalLimiter, authenticateToken, problemController.updateProblem);

/**
 * @route   DELETE /api/problems/:id
 * @desc    Delete a problem (only by creator)
 * @access  Private
 * @param   {string} id - Problem ID
 */
router.delete('/:id', generalLimiter, authenticateToken, problemController.deleteProblem);

/**
 * @route   POST /api/problems/:id/rate
 * @desc    Rate a problem (1-5 stars)
 * @access  Private
 * @param   {string} id - Problem ID
 * @body    {number} rating - Rating value (1-5)
 */
router.post('/:id/rate', rateLimiter, authenticateToken, problemController.rateProblem);

export default router;
