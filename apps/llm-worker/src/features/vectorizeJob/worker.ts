import { db, eq, jobs } from '@career-ai/db';
import {
  type VectorizeJobPayload,
  Worker,
  Job,
  connectionOptions,
  matchJobToCvsQueue,
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

  await db
    .update(jobs)
    .set({
      embeddings: vector,
      embeddingStatus: 'completed',
    })
    .where(eq(jobs.id, jobId));
  await job.updateProgress(90);

  await matchJobToCvsQueue.add('match-job-to-cvs', {
    jobId,
  });
  await job.updateProgress(100);
};

export const startVectorizeJobWorker = () => {
  const worker = new Worker<VectorizeJobPayload>('vectorize-job', handleVectorizeJob, {
    connection: connectionOptions,
  });

  worker.on('failed', async (job, err) => {
    console.error(`[VectorizeJob] Job failed: ${job?.data.jobId}`, err);
    if (job?.data.jobId) {
      await db
        .update(jobs)
        .set({ embeddingStatus: 'failed' })
        .where(eq(jobs.id, job.data.jobId));
    }
  });

  worker.on('completed', (job) => {
    console.log(`[VectorizeJob] Job completed: ${job?.data.jobId}`);
  });

  return worker;
};
