import { cosineDistance, cvs, db, desc, eq, gt, jobs, sql } from '@career-ai/db';

const LIMIT = 30;

export const findTopJobsForCv = async (cvId: string, limit = LIMIT) => {
  const [cv] = await db
    .select({
      embeddings: cvs.embeddings,
    })
    .from(cvs)
    .where(eq(cvs.id, cvId));

  if (!cv) {
    throw new Error(`CV with ID ${cvId} not found`);
  }
  if (!cv.embeddings) {
    throw new Error(`CV with ID ${cvId} does not have embeddings`);
  }

  const similarity = sql<number>`1 - (${cosineDistance(jobs.embeddings, cv.embeddings)})`;

  const topMatches = await db
    .select({ jobId: jobs.id, similarity })
    .from(jobs)
    .where(gt(similarity, 0.75))
    .orderBy((t) => desc(t.similarity))
    .limit(limit);

  return topMatches;
};

export const findTopCvsForJob = async (jobId: string, limit = LIMIT) => {
  const [job] = await db
    .select({
      embeddings: jobs.embeddings,
    })
    .from(jobs)
    .where(eq(jobs.id, jobId));

  if (!job) {
    throw new Error(`Job with ID ${jobId} not found`);
  }
  if (!job.embeddings) {
    throw new Error(`Job with ID ${jobId} does not have embeddings`);
  }

  const similarity = sql<number>`1 - (${cosineDistance(cvs.embeddings, job.embeddings)})`;

  const topMatches = await db
    .select({ cvId: cvs.id, similarity })
    .from(cvs)
    .where(gt(similarity, 0.75))
    .orderBy((t) => desc(t.similarity))
    .limit(limit);

  return topMatches;
};
