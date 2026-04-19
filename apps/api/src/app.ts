import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { logger } from 'hono/logger';
import authRouter from './routes/auth/auth.router';

const app = new Hono();

app.use(cors()).use(csrf()).use(logger());

const api = app.basePath('/api');
const v1 = api.basePath('/v1').route('/auth', authRouter);

export type AppType = typeof v1;
export default app;
