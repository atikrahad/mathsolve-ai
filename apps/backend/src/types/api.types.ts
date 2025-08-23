import { Request } from 'express';

// Base API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: ResponseMeta;
  timestamp: string;
}

// Response metadata for pagination
export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

// Pagination options
export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}

// Error response details
export interface ErrorDetails {
  code?: string;
  field?: string;
  value?: any;
  constraints?: Record<string, string>;
}

// Validation error structure
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Request with authentication
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    username: string;
    role?: string;
  };
}

// Request with pagination
export interface PaginatedRequest extends Request {
  pagination?: {
    page: number;
    limit: number;
    skip: number;
  };
}

// Search request parameters
export interface SearchRequest extends PaginatedRequest {
  query: {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: Record<string, any>;
  };
}

// File upload request
export interface FileUploadRequest extends AuthenticatedRequest {
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
}

// Health check response
export interface HealthCheckResponse {
  status: 'OK' | 'ERROR';
  timestamp: string;
  environment: string;
  version: string;
  features?: Record<string, boolean | string>;
  services?: Record<string, 'up' | 'down' | 'degraded'>;
}
