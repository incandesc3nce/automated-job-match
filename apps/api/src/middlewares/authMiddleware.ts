import { UnauthorizedError } from '@/utils/APIError';
import { verifyJwt } from '@career-ai/auth';
import { createMiddleware } from 'hono/factory';
import { getCookie } from 'hono/cookie';

type AuthEnv = {
  Variables: {
    userId: string;
  };
};

export const auth = createMiddleware<AuthEnv>(async (c, next) => {
  const token = getCookie(c, 'token');

  if (!token) {
    throw new UnauthorizedError('Authentication token is missing');
  }

  try {
    const decoded = verifyJwt(token);
    c.set('userId', decoded.userId);
  } catch (err) {
    throw new UnauthorizedError('Invalid authentication token');
  }

  await next();
});
