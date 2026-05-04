import { Hono } from 'hono';
import { auth } from '@/middlewares/authMiddleware';
import { db, cvs, eq, and, desc, matches, jobs, count } from '@career-ai/db';
import { createCvValidator, updateCvValidator } from './cvs.validator';
import { BadRequestError, NotFoundError } from '@/utils/APIError';
import { vectorizeCvQueue } from '@career-ai/queue';
import { jobSourceLinkMap } from '@/utils/jobSourceLinkMap';

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
  const limit = Number(c.req.query('limit') || 30);
  const offset = Number(c.req.query('offset') || 0);
  if (!cvId) {
    throw new BadRequestError('cvId is required');
  }

  const matchesRows = await db
    .select({
      id: matches.id,
      score: matches.score,
      reasoning: matches.reasoning,
      hidden: matches.hidden,
      createdAt: matches.createdAt,
      updatedAt: matches.updatedAt,
      jobTitle: jobs.title,
      jobSource: jobs.source,
      jobExternalId: jobs.externalId,
      jobCompanyName: jobs.companyName,
      jobLocation: jobs.location,
      jobDescription: jobs.shortDescription,
      jobWorkFormat: jobs.workFormat,
      jobSalaryFrom: jobs.salaryFrom,
      jobSalaryTo: jobs.salaryTo,
      jobSalaryExtra: jobs.salaryExtra,
      jobSkills: jobs.skills,
      jobPostedAt: jobs.postedAt,
    })
    .from(matches)
    .leftJoin(jobs, eq(matches.jobId, jobs.id))
    .where(and(eq(matches.cvId, cvId), eq(matches.userId, c.get('userId'))))
    .orderBy(desc(matches.score), desc(matches.createdAt))
    .limit(limit)
    .offset(offset);

  const [total] = await db
    .select({ count: count() })
    .from(matches)
    .where(
      and(
        and(eq(matches.cvId, cvId), eq(matches.userId, c.get('userId'))),
        eq(matches.hidden, false),
      ),
    );

  return c.json({
    matches: matchesRows
      .filter((match) => !match.hidden)
      .map((match) => ({
        ...match,
        externalUrl: jobSourceLinkMap[match.jobSource!]!(match.jobExternalId!),
      })),
    hiddenMatches: matchesRows.filter((match) => match.hidden),
    total: total?.count || 0,
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

  await db.delete(matches).where(eq(matches.cvId, cvId));

  return c.json({ success: true });
});

export default cvsRouter;
