import { Hono } from 'hono';
import { auth } from '@/middlewares/authMiddleware';
import { db, cvs, eq, and, desc } from '@career-ai/db';
import { createCvValidator, updateCvValidator } from './cvs.validator';
import { NotFoundError } from '@/utils/APIError';

const cvsRouter = new Hono().use('*', auth);

cvsRouter.get('/', async (c) => {
  const userCvs = await db
    .select({
      id: cvs.id,
      title: cvs.title,
      location: cvs.location,
      experience_months: cvs.experience_months,
      skills: cvs.skills,
      workFormat: cvs.workFormat,
      created_at: cvs.created_at,
      updated_at: cvs.updated_at,
    })
    .from(cvs)
    .where(eq(cvs.user_id, c.get('userId')))
    .orderBy(desc(cvs.updated_at));

  return c.json(userCvs);
});

cvsRouter.post('/form', createCvValidator, async (c) => {
  const { title, location, experienceMonths, skills, workFormat } = c.req.valid('json');

  const [newCv] = await db
    .insert(cvs)
    .values({
      user_id: c.get('userId'),
      title,
      location,
      experience_months: experienceMonths,
      skills,
      workFormat,
    })
    .returning();

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
      experience_months: experienceMonths,
      skills,
      workFormat,
    })
    .where(and(eq(cvs.id, cvId), eq(cvs.user_id, c.get('userId'))))
    .returning();

    if (!updatedCv) {
      throw new NotFoundError('CV not found');
    }

  return c.json(updatedCv);
});

cvsRouter.delete('/:cvId', async (c) => {
  const cvId = c.req.param('cvId');
  const [deletedCv] = await db.delete(cvs).where(and(eq(cvs.id, cvId), eq(cvs.user_id, c.get('userId')))).returning();

  if (!deletedCv) {
    throw new NotFoundError('CV not found');
  }

  return c.json({ success: true });
});

export default cvsRouter;
