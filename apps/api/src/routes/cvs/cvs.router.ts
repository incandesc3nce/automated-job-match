import { Hono } from 'hono';
import { auth } from '@/middlewares/authMiddleware';
import { db, cvs, eq, and, desc, matches } from '@career-ai/db';
import { createCvValidator, updateCvValidator } from './cvs.validator';
import { BadRequestError, NotFoundError } from '@/utils/APIError';
import { vectorizeCvQueue } from '@career-ai/queue';
import { streamSSE } from 'hono/streaming';
import { redisClient } from '@career-ai/redis';
import { getMatches, getMatchesCount } from './cvs.queries';

const cvsRouter = new Hono().use('*', auth);

cvsRouter.get('/', async (c) => {
  const userCvs = await db
    .select({
      id: cvs.id,
      title: cvs.title,
      location: cvs.location,
      experienceMonths: cvs.experienceMonths,
      skills: cvs.skills,
      workFormat: cvs.workFormat,
      createdAt: cvs.createdAt,
      updatedAt: cvs.updatedAt,
    })
    .from(cvs)
    .where(eq(cvs.userId, c.get('userId')))
    .orderBy(desc(cvs.updatedAt));

  return c.json(userCvs);
});

cvsRouter.get('/:cvId/matches', async (c) => {
  const cvId = c.req.param('cvId');
  const userId = c.get('userId');
  const limit = Number(c.req.query('limit') || 30);
  const offset = Number(c.req.query('offset') || 0);
  if (!cvId) {
    throw new BadRequestError('cvId is required');
  }

  const matchRows = await getMatches({
    cvId,
    userId,
    limit,
    offset,
  });

  const total = await getMatchesCount({
    cvId,
    userId,
  });

  return c.json({
    matches: matchRows,
    total: total,
  });
});

cvsRouter.get('/:cvId/matches/hidden', async (c) => {
  const cvId = c.req.param('cvId');
  const userId = c.get('userId');
  const limit = Number(c.req.query('limit') || 30);
  const offset = Number(c.req.query('offset') || 0);
  if (!cvId) {
    throw new BadRequestError('cvId is required');
  }

  const matchRows = await getMatches({
    cvId,
    userId,
    limit,
    offset,
    hidden: true,
  });

  const total = await getMatchesCount({
    cvId,
    userId,
    hidden: true,
  });

  return c.json({
    hiddenMatches: matchRows,
    total: total,
  });
});

cvsRouter.get('/:cvId/matches/sse', async (c) => {
  const userId = c.get('userId');
  const key = `matches:ready:${userId}`;

  return streamSSE(c, async (stream) => {
    const redis = await redisClient.duplicate();

    const heartbeat = setInterval(async () => {
      await stream.writeSSE({
        event: 'heartbeat',
        data: String(Date.now()),
      });
    }, 30_000);

    await redis.subscribe(key, async (message, channel) => {
      if (channel === key) {
        const payload: { matchId: string; cvId: string } = JSON.parse(message);

        await stream.writeSSE({
          event: 'matchesReady',
          data: JSON.stringify({
            cvId: payload.cvId,
          }),
        });
      }
    });

    stream.onAbort(async () => {
      clearInterval(heartbeat);
      await redis.unsubscribe(key);
      redis.close();
    });

    await stream.sleep(5 * 60 * 1000);
  });
});

cvsRouter.post('/form', createCvValidator, async (c) => {
  const { title, location, experienceMonths, skills, workFormat } = c.req.valid('json');

  const [newCv] = await db
    .insert(cvs)
    .values({
      userId: c.get('userId'),
      title,
      location,
      experienceMonths,
      skills,
      workFormat: workFormat,
    })
    .returning();

  if (!newCv) {
    throw new Error('Failed to create CV');
  }

  await vectorizeCvQueue.add('vectorize-cv', {
    cvId: newCv.id,
  });

  return c.json(newCv, 201);
});

// TODO: implement file upload endpoint, get text from file and parse it to create CV
// cvsRouter.post('/upload', async (c) => {});

cvsRouter.patch('/:cvId', updateCvValidator, async (c) => {
  const cvId = c.req.param('cvId');
  const { title, location, experienceMonths, skills, workFormat } = c.req.valid('json');

  const [updatedCv] = await db
    .update(cvs)
    .set({
      title,
      location,
      experienceMonths: experienceMonths,
      skills,
      workFormat: workFormat,
    })
    .where(and(eq(cvs.id, cvId), eq(cvs.userId, c.get('userId'))))
    .returning();

  if (!updatedCv) {
    throw new NotFoundError('CV not found');
  }

  await vectorizeCvQueue.add('vectorize-cv', {
    cvId: updatedCv.id,
  });

  await db.delete(matches).where(eq(matches.cvId, cvId));

  return c.json(updatedCv);
});

cvsRouter.delete('/:cvId', async (c) => {
  const cvId = c.req.param('cvId');

  const [cvToVerify] = await db
    .select()
    .from(cvs)
    .where(and(eq(cvs.id, cvId), eq(cvs.userId, c.get('userId'))));

  if (!cvToVerify) {
    throw new NotFoundError('CV not found');
  }

  await db.delete(matches).where(eq(matches.cvId, cvId));

  await db.delete(cvs).where(eq(cvs.id, cvId));

  return c.json({ success: true });
});

export default cvsRouter;
