import { Router } from 'express';
import { ResourceController } from '../controllers/resource.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { createRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();
const resourceController = new ResourceController();

// Rate limiters for different operations
const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

const createLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 resource creations per hour
  message: 'Too many resources created from this IP, please try again later.',
});

const searchLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Higher limit for search as it's a core feature
  message: 'Too many search requests from this IP, please try again later.',
});

const bookmarkLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 bookmark operations per hour
  message: 'Too many bookmark operations from this IP, please try again later.',
});

// Public routes (no authentication required)

/**
 * @route   GET /api/resources
 * @desc    Get learning resources with filtering, pagination, and sorting
 * @access  Public
 * @query   {number} [page=1] - Page number
 * @query   {number} [limit=10] - Number of resources per page (max 100)
 * @query   {string} [category] - Filter by category
 * @query   {string} [type] - Filter by type (TUTORIAL, GUIDE, REFERENCE)
 * @query   {string} [difficulty] - Filter by difficulty (LOW, MEDIUM, HIGH)
 * @query   {string} [search] - Search term for title/content/category
 * @query   {string} [sortBy=createdAt] - Sort field (createdAt, viewCount, rating, title)
 * @query   {string} [sortOrder=desc] - Sort order (asc, desc)
 * @query   {string} [authorId] - Filter by author ID
 */
router.get('/', generalLimiter, resourceController.getResources);

/**
 * @route   GET /api/resources/search
 * @desc    Search learning resources with advanced filtering
 * @access  Public
 * @query   {string} query - Search query (required)
 * @query   {number} [page=1] - Page number
 * @query   {number} [limit=10] - Number of resources per page (max 50)
 * @query   {string} [category] - Filter by category
 * @query   {string} [type] - Filter by type
 * @query   {string} [difficulty] - Filter by difficulty
 * @query   {string} [sortBy=createdAt] - Sort field
 * @query   {string} [sortOrder=desc] - Sort order
 */
router.get('/search', searchLimiter, resourceController.searchResources);

/**
 * @route   GET /api/resources/category/:category
 * @desc    Get resources by specific category
 * @access  Public
 * @param   {string} category - Resource category
 * @query   Same as GET /api/resources (except category)
 */
router.get('/category/:category', generalLimiter, resourceController.getResourcesByCategory);

/**
 * @route   GET /api/resources/type/:type
 * @desc    Get resources by specific type
 * @access  Public
 * @param   {string} type - Resource type (TUTORIAL, GUIDE, REFERENCE)
 * @query   Same as GET /api/resources (except type)
 */
router.get('/type/:type', generalLimiter, resourceController.getResourcesByType);

/**
 * @route   GET /api/resources/:id
 * @desc    Get a single learning resource by ID
 * @access  Public
 * @param   {string} id - Resource ID
 */
router.get('/:id', generalLimiter, resourceController.getResourceById);

// Protected routes (authentication required)

/**
 * @route   POST /api/resources
 * @desc    Create a new learning resource
 * @access  Private
 * @body    {string} title - Resource title (required, max 200 chars)
 * @body    {string} content - Resource content (required, 50-50000 chars)
 * @body    {string} type - Resource type (TUTORIAL, GUIDE, REFERENCE)
 * @body    {string} category - Resource category (required, max 50 chars)
 * @body    {string} [difficulty] - Difficulty level (LOW, MEDIUM, HIGH)
 */
router.post('/', createLimiter, authenticateToken, resourceController.createResource);

/**
 * @route   PUT /api/resources/:id
 * @desc    Update a learning resource
 * @access  Private (Owner only)
 * @param   {string} id - Resource ID
 * @body    Same as POST /api/resources but all fields optional
 */
router.put('/:id', generalLimiter, authenticateToken, resourceController.updateResource);

/**
 * @route   DELETE /api/resources/:id
 * @desc    Delete a learning resource
 * @access  Private (Owner only)
 * @param   {string} id - Resource ID
 */
router.delete('/:id', generalLimiter, authenticateToken, resourceController.deleteResource);

/**
 * @route   POST /api/resources/:id/bookmark
 * @desc    Bookmark a learning resource
 * @access  Private
 * @param   {string} id - Resource ID
 */
router.post(
  '/:id/bookmark',
  bookmarkLimiter,
  authenticateToken,
  resourceController.bookmarkResource
);

/**
 * @route   DELETE /api/resources/:id/bookmark
 * @desc    Remove bookmark from a learning resource
 * @access  Private
 * @param   {string} id - Resource ID
 */
router.delete(
  '/:id/bookmark',
  bookmarkLimiter,
  authenticateToken,
  resourceController.removeBookmark
);

export default router;
