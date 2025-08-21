// Jest setup file for backend tests
import { PrismaClient } from '@prisma/client';

// Mock Prisma client for tests
const mockPrisma = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  problem: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  // Add more model mocks as needed
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

// Mock the database connection
jest.mock('../src/config/database', () => mockPrisma);

// Setup test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.DATABASE_URL = 'file:./test.db';

// Global test timeout
jest.setTimeout(10000);

// Clean up after tests
afterEach(() => {
  jest.clearAllMocks();
});

export { mockPrisma };