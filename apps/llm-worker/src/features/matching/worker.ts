import { llm } from '@/providers/llm';
import { cvs, db, eq, jobs, matches } from '@career-ai/db';
import { Worker, Job, type MatchJobCvPayload, connectionOptions } from '@career-ai/queue';
import { buildMatchPrompt, SYSTEM_PROMPT } from './buildInput';
import { matchSchema } from './types/Match';

const handleMatchingJob = async (job: Job<MatchJobCvPayload>) => {
  const { jobId, cvId } = job.data;
  await job.updateProgress(10);

  const [cvRow] = await db.select().from(cvs).where(eq(cvs.id, cvId));
  if (!cvRow) {
    throw new Error(`CV with ID ${cvId} not found`);
  }
  await job.updateProgress(20);

  const [jobRow] = await db.select().from(jobs).where(eq(jobs.id, jobId));
  if (!jobRow) {
    throw new Error(`Job with ID ${jobId} not found`);
  }
  await job.updateProgress(30);

  const matchResult = await llm.generate({
    input: buildMatchPrompt(cvRow, jobRow),
    systemPrompt: SYSTEM_PROMPT,
  });
  await job.updateProgress(60);

  const { score, reasoning } = matchSchema.parse(JSON.parse(matchResult));
  await job.updateProgress(80);

  await db.insert(matches).values({
    cvId,
    jobId,
    score,
    reasoning,
  });
  await job.updateProgress(100);
};

export const startMatchingWorker = () => {
  const worker = new Worker<MatchJobCvPayload>('match-job-cv', handleMatchingJob, {
    connection: connectionOptions,
  });

  worker.on('failed', (job, err) => {
    console.error(
      `[Matching] Job failed: ${job?.data.jobId}, CV: ${job?.data.cvId}, Error: ${err.message}`,
    );
  });

  worker.on('completed', (job) => {
    console.log(`[Matching] Job completed: ${job?.data.jobId}, CV: ${job?.data.cvId}`);
  });

  return worker;
};
