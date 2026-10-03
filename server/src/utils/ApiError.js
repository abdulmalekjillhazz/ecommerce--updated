/**
 * Custom Error Class for API responses
 */
export class ApiError extends Error {
  constructor(
    statusCode = 500,
    message = 'Internal Server Error',
    errors = [],
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
