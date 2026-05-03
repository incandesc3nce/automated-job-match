import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { logger } from 'hono/logger';
import { APIError } from './utils/APIError';
import { HTTPException } from 'hono/http-exception';
import authRouter from './routes/auth/auth.router';
import usersRouter from './routes/users/users.router';
import cvsRouter from './routes/cvs/cvs.router';
import matchesRouter from './routes/matches/matches.router';

const app = new Hono();

app.use(cors()).use(csrf()).use(logger());
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    if (err.res) {
      return err.res;
    }

    return c.json(
      {
        statusCode: err.status,
        statusText: APIError.statusText(err.status),
        success: false,
        error: err.message,
      },
      err.status,
    );
  }

  // Fallback for 500 errors
  console.error('Unexpected error:', err);
  return c.json(
    {
      statusCode: 500,
      statusText: 'Internal Server Error',
      success: false,
      error: 'An unexpected error occurred',
    },
    500,
  );
});

app.notFound((c) => {
  return c.json(
    {
      statusCode: 404,
      statusText: 'Not Found',
      success: false,
      error: 'Not Found',
    },
    404,
  );
});

const api = app.basePath('/api');
const v1 = api
  .basePath('/v1')
  .route('/auth', authRouter)
  .route('/users', usersRouter)
  .route('/cvs', cvsRouter)
  .route('/matches', matchesRouter);

export type AppType = typeof v1;
export default app;
