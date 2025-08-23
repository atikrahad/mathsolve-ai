import { ApiError } from './ApiError';
import { logger } from '../../config/logger';

export class ServiceError extends ApiError {
  constructor(
    statusCode: number,
    message: string,
    public readonly service: string,
    public readonly operation: string,
    public readonly details?: any
  ) {
    super(statusCode, message);
    this.name = 'ServiceError';

    // Log the error for debugging
    logger.error(`Service Error [${service}.${operation}]: ${message}`, {
      statusCode,
      service,
      operation,
      details,
    });
  }
}

export class AuthServiceErrors {
  private static readonly SERVICE = 'AuthService';

  static userAlreadyExists(field: 'email' | 'username', value: string): ServiceError {
    const message =
      field === 'email' ? 'User with this email already exists' : 'Username is already taken';

    return new ServiceError(409, message, this.SERVICE, 'register', { field, value });
  }

  static invalidCredentials(): ServiceError {
    return new ServiceError(401, 'Invalid email or password', this.SERVICE, 'login');
  }

  static oauthAccountOnly(): ServiceError {
    return new ServiceError(
      401,
      'This account was created with Google. Please sign in with Google.',
      this.SERVICE,
      'login'
    );
  }

  static userNotFound(identifier?: string): ServiceError {
    return new ServiceError(404, 'User not found', this.SERVICE, 'findUser', { identifier });
  }

  static invalidResetToken(): ServiceError {
    return new ServiceError(400, 'Invalid or expired reset token', this.SERVICE, 'resetPassword');
  }

  static invalidVerificationToken(): ServiceError {
    return new ServiceError(
      400,
      'Invalid or expired verification token',
      this.SERVICE,
      'verifyEmail'
    );
  }

  static emailAlreadyVerified(): ServiceError {
    return new ServiceError(400, 'Email is already verified', this.SERVICE, 'verifyEmail');
  }

  static passwordMismatch(): ServiceError {
    return new ServiceError(400, 'Current password is incorrect', this.SERVICE, 'changePassword');
  }

  static tokenGenerationFailed(reason?: string): ServiceError {
    return new ServiceError(
      500,
      'Failed to generate authentication tokens',
      this.SERVICE,
      'generateTokens',
      { reason }
    );
  }

  static emailSendFailed(type: 'verification' | 'reset', email: string): ServiceError {
    return new ServiceError(500, `Failed to send ${type} email`, this.SERVICE, 'sendEmail', {
      type,
      email,
    });
  }

  static databaseError(operation: string, error: any): ServiceError {
    return new ServiceError(500, 'Database operation failed', this.SERVICE, operation, {
      originalError: error.message,
    });
  }
}

export class GoogleAuthServiceErrors {
  private static readonly SERVICE = 'GoogleAuthService';

  static invalidToken(): ServiceError {
    return new ServiceError(400, 'Invalid Google token', this.SERVICE, 'verifyToken');
  }

  static googleApiError(error: any): ServiceError {
    return new ServiceError(502, 'Google API error', this.SERVICE, 'googleRequest', {
      originalError: error.message,
    });
  }

  static missingConfiguration(): ServiceError {
    return new ServiceError(500, 'Google OAuth not configured', this.SERVICE, 'initialize');
  }
}

export class ValidationServiceErrors {
  private static readonly SERVICE = 'ValidationService';

  static invalidInput(field: string, message: string): ServiceError {
    return new ServiceError(
      400,
      `Validation failed for ${field}: ${message}`,
      this.SERVICE,
      'validate',
      { field, message }
    );
  }

  static schemaValidationFailed(errors: any[]): ServiceError {
    return new ServiceError(400, 'Request validation failed', this.SERVICE, 'validateSchema', {
      errors,
    });
  }
}

// Standard error classes for common use cases
export class ValidationError extends ServiceError {
  constructor(message: string, details?: any) {
    super(400, message, 'Validation', 'validate', details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ServiceError {
  constructor(
    message: string = 'Resource not found',
    service: string = 'Unknown',
    operation: string = 'find'
  ) {
    super(404, message, service, operation);
    this.name = 'NotFoundError';
  }
}

export class ForbiddenError extends ServiceError {
  constructor(
    message: string = 'Access forbidden',
    service: string = 'Unknown',
    operation: string = 'access'
  ) {
    super(403, message, service, operation);
    this.name = 'ForbiddenError';
  }
}

export class UnauthorizedError extends ServiceError {
  constructor(
    message: string = 'Unauthorized access',
    service: string = 'Unknown',
    operation: string = 'authenticate'
  ) {
    super(401, message, service, operation);
    this.name = 'UnauthorizedError';
  }
}

export class ConflictError extends ServiceError {
  constructor(
    message: string = 'Resource conflict',
    service: string = 'Unknown',
    operation: string = 'create'
  ) {
    super(409, message, service, operation);
    this.name = 'ConflictError';
  }
}

// Generic service error factory
export class ServiceErrorFactory {
  static create(
    service: string,
    operation: string,
    statusCode: number,
    message: string,
    details?: any
  ): ServiceError {
    return new ServiceError(statusCode, message, service, operation, details);
  }

  static notFound(service: string, operation: string, resource: string, id?: string): ServiceError {
    return new ServiceError(404, `${resource} not found`, service, operation, { resource, id });
  }

  static unauthorized(service: string, operation: string, reason?: string): ServiceError {
    return new ServiceError(401, 'Unauthorized access', service, operation, { reason });
  }

  static forbidden(service: string, operation: string, reason?: string): ServiceError {
    return new ServiceError(403, 'Access forbidden', service, operation, { reason });
  }

  static conflict(
    service: string,
    operation: string,
    resource: string,
    field?: string
  ): ServiceError {
    return new ServiceError(409, `${resource} already exists`, service, operation, {
      resource,
      field,
    });
  }

  static internalError(service: string, operation: string, error: any): ServiceError {
    return new ServiceError(500, 'Internal server error', service, operation, {
      originalError: error.message,
    });
  }
}
