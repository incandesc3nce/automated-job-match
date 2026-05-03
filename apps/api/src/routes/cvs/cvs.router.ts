import { Hono } from 'hono';
import { auth } from '@/middlewares/authMiddleware';
import { db, cvs, eq, and, desc } from '@career-ai/db';
import { createCvValidator, updateCvValidator } from './cvs.validator';
import { NotFoundError } from '@/utils/APIError';
import { vectorizeCvQueue } from '@career-ai/queue';

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

  return c.json(updatedCv);
});

cvsRouter.delete('/:cvId', async (c) => {
  const cvId = c.req.param('cvId');
  const [deletedCv] = await db
    .delete(cvs)
    .where(and(eq(cvs.id, cvId), eq(cvs.userId, c.get('userId'))))
    .returning();

  if (!deletedCv) {
    throw new NotFoundError('CV not found');
  }

  return c.json({ success: true });
});

export default cvsRouter;
