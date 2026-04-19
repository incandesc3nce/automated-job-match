import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

export class APIError extends HTTPException {
  constructor(status: ContentfulStatusCode, message: string) {
    super(status, {
      message: JSON.stringify({
        statusCode: status,
        statusText: APIError.statusText(status),
        success: false,
        error: message,
      }),
    });
  }

  private static statusText(status: ContentfulStatusCode) {
    switch (status) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized';
      case 404:
        return 'Not Found';
      case 500:
        return 'Internal Server Error';
      default:
        return 'Error';
    }
  }
}

export class BadRequestError extends APIError {
  constructor(message: string) {
    super(400, message);
  }
}

export class UnauthorizedError extends APIError {
  constructor(message: string) {
    super(401, message);
  }
}

export class NotFoundError extends APIError {
  constructor(message: string) {
    super(404, message);
  }
}

export class InternalServerError extends APIError {
  constructor(message: string) {
    super(500, message);
  }
}
