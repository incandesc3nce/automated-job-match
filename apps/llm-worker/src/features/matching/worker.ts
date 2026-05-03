import { llm } from '@/providers/llm';
import { cvs, db, eq, jobs, matches } from '@career-ai/db';
import {
  type MatchGenerationPayload,
  Worker,
  Job,
  connectionOptions,
} from '@career-ai/queue';
import { buildMatchPrompt, SYSTEM_PROMPT } from './buildInput';
import { matchSchema } from './types/Match';

const handleMatchGenerationJob = async (job: Job<MatchGenerationPayload>) => {
  const { cvId, jobId } = job.data;
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

export const startMatchGenerationWorker = () => {
  const worker = new Worker<MatchGenerationPayload>(
    'match-generation',
    handleMatchGenerationJob,
    {
      connection: connectionOptions,
    },
  );

  worker.on('failed', (job, err) => {
    console.error(
      `[Match Generation] Job failed: ${job?.data.cvId}, Error: ${err.message}`,
    );
  });

  worker.on('completed', (job) => {
    console.log(`[Match Generation] Job completed: ${job?.data.cvId}`);
  });

  return worker;
};
