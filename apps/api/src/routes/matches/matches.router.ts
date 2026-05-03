import { Hono } from 'hono';
import { auth } from '@/middlewares/authMiddleware';
import { BadRequestError } from '@/utils/APIError';
import { and, db, eq, matches } from '@career-ai/db';

const matchesRouter = new Hono().use('*', auth);

matchesRouter.patch('/:matchId/hide', async (c) => {
  const matchId = c.req.param('matchId');
  if (!matchId) {
    throw new BadRequestError('matchId is required');
  }

  const [updatedMatch] = await db
    .update(matches)
    .set({ hidden: true })
    .where(and(eq(matches.id, matchId), eq(matches.userId, c.get('userId'))))
    .returning();

  return c.json(updatedMatch);
});

matchesRouter.patch('/:matchId/unhide', async (c) => {
  const matchId = c.req.param('matchId');
  if (!matchId) {
    throw new BadRequestError('matchId is required');
  }

  const [updatedMatch] = await db
    .update(matches)
    .set({ hidden: false })
    .where(and(eq(matches.id, matchId), eq(matches.userId, c.get('userId'))))
    .returning();

  return c.json(updatedMatch);
});

export default matchesRouter;
