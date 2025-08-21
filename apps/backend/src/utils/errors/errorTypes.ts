export enum ErrorTypes {
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_FIELD = 'MISSING_FIELD',
  
  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Server errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  
  // File upload errors
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  
  // Business logic errors
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
}

export const ErrorMessages = {
  [ErrorTypes.UNAUTHORIZED]: 'Authentication required',
  [ErrorTypes.FORBIDDEN]: 'Access forbidden',
  [ErrorTypes.TOKEN_EXPIRED]: 'Token has expired',
  [ErrorTypes.INVALID_TOKEN]: 'Invalid token provided',
  
  [ErrorTypes.VALIDATION_ERROR]: 'Validation failed',
  [ErrorTypes.INVALID_INPUT]: 'Invalid input provided',
  [ErrorTypes.MISSING_FIELD]: 'Required field is missing',
  
  [ErrorTypes.NOT_FOUND]: 'Resource not found',
  [ErrorTypes.ALREADY_EXISTS]: 'Resource already exists',
  [ErrorTypes.DUPLICATE_ENTRY]: 'Duplicate entry',
  
  [ErrorTypes.RATE_LIMIT_EXCEEDED]: 'Too many requests',
  
  [ErrorTypes.INTERNAL_ERROR]: 'Internal server error',
  [ErrorTypes.DATABASE_ERROR]: 'Database operation failed',
  [ErrorTypes.EXTERNAL_API_ERROR]: 'External API error',
  
  [ErrorTypes.FILE_TOO_LARGE]: 'File size exceeds limit',
  [ErrorTypes.INVALID_FILE_TYPE]: 'Invalid file type',
  [ErrorTypes.UPLOAD_FAILED]: 'File upload failed',
  
  [ErrorTypes.INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions',
  [ErrorTypes.OPERATION_NOT_ALLOWED]: 'Operation not allowed',
  [ErrorTypes.QUOTA_EXCEEDED]: 'Quota exceeded',
} as const;