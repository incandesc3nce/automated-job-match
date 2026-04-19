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

  static BadRequest(message: string) {
    return new APIError(400, message);
  }

  static Unauthorized(message: string) {
    return new APIError(401, message);
  }

  static NotFound(message: string) {
    return new APIError(404, message);
  }
  
  static InternalError(message: string) {
    return new APIError(500, message);
  }
}
