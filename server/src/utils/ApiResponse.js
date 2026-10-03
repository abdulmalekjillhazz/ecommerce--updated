/**
 * Consistent API Response Formatter
 */
export class ApiResponse {
  constructor(statusCode = 200, data = null, message = 'Success') {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}
