export class ValidationError extends Error {
  errors: Record<string, string>;

  constructor(errors: Record<string, string>) {
    super('Validation Error');
    this.errors = errors;
    this.name = 'ValidationError';
    
    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}