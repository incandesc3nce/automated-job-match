import { db, eq, jobs } from '@career-ai/db';
import {
  Worker,
  Job,
  type VectorizeJobPayload,
  connectionOptions,
} from '@career-ai/queue';
import { buildVectorizeJobInput } from './buildInput';
import { llm } from '@/providers/llm';

const handleVectorizeJob = async (job: Job<VectorizeJobPayload>) => {
  const { jobId } = job.data;
  await job.updateProgress(10);

  const [jobRow] = await db.select().from(jobs).where(eq(jobs.id, jobId));
  if (!jobRow) {
    throw new Error(`Job with ID ${jobId} not found`);
  }
  await job.updateProgress(30);

  const input = buildVectorizeJobInput(jobRow);
  await job.updateProgress(50);

  const vector = await llm.embed(input);
  await job.updateProgress(80);

  await db.update(jobs).set({ embeddings: vector }).where(eq(jobs.id, jobId));
  await job.updateProgress(100);
};

export const startVectorizeJobWorker = () => {
  const worker = new Worker<VectorizeJobPayload>('vectorize-job', handleVectorizeJob, {
    connection: connectionOptions,
  });

  worker.on('failed', (job, err) => {
    console.error(`[VectorizeJob] Job failed: ${job?.data.jobId}, Error: ${err.message}`);
  });

  worker.on('completed', (job) => {
    console.log(`[VectorizeJob] Job completed: ${job?.data.jobId}`);
  });

  return worker;
};
