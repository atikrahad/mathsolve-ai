// Repository operation options
export interface FindManyOptions {
  skip?: number;
  take?: number;
  where?: any;
  orderBy?: any;
  include?: any;
  select?: any;
}

// Database connection options
export interface DatabaseConfig {
  url: string;
  maxConnections?: number;
  connectionTimeout?: number;
  queryTimeout?: number;
  logQueries?: boolean;
}

// Migration status
export interface MigrationStatus {
  name: string;
  appliedAt: Date;
  status: 'pending' | 'applied' | 'failed';
}

// Database health
export interface DatabaseHealth {
  connected: boolean;
  latency?: number;
  version?: string;
  migrations?: MigrationStatus[];
}

// Pagination result
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Database operation result
export interface DatabaseOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  affectedRows?: number;
}

// Transaction options
export interface TransactionOptions {
  timeout?: number;
  isolationLevel?: 'ReadUncommitted' | 'ReadCommitted' | 'RepeatableRead' | 'Serializable';
}

// Soft delete fields
export interface SoftDeleteFields {
  deletedAt?: Date | null;
  isDeleted?: boolean;
}

// Audit fields
export interface AuditFields {
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

// Search options
export interface SearchOptions {
  searchTerm?: string;
  searchFields?: string[];
  caseSensitive?: boolean;
  fuzzySearch?: boolean;
}

// Sort options
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Filter options
export interface FilterOptions {
  field: string;
  operator:
    | 'eq'
    | 'ne'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'in'
    | 'nin'
    | 'contains'
    | 'startsWith'
    | 'endsWith';
  value: any;
}

// Query builder options
export interface QueryBuilderOptions {
  where?: Record<string, any>;
  orderBy?: SortOptions[];
  filters?: FilterOptions[];
  search?: SearchOptions;
  pagination?: {
    page: number;
    limit: number;
  };
  include?: string[];
  select?: string[];
}
