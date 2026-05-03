import { cvs, db, eq } from '@career-ai/db';
import {
  type VectorizeCvPayload,
  connectionOptions,
  Job,
  matchCvToJobsQueue,
  Worker,
} from '@career-ai/queue';
import { buildVectorizeCvInput } from './buildInput';
import { llm } from '@/providers/llm';

const handleVectorizeCvJob = async (job: Job<VectorizeCvPayload>) => {
  const { cvId } = job.data;
  await job.updateProgress(10);

  const [cvRow] = await db.select().from(cvs).where(eq(cvs.id, cvId));
  if (!cvRow) {
    throw new Error(`CV with ID ${cvId} not found`);
  }
  await job.updateProgress(30);

  const input = buildVectorizeCvInput(cvRow);
  await job.updateProgress(50);

  const vector = await llm.embed(input);
  await job.updateProgress(80);

  await db.update(cvs).set({ embeddings: vector }).where(eq(cvs.id, cvId));
  await job.updateProgress(90);

  await matchCvToJobsQueue.add('match-cv-to-job', {
    cvId,
  });
  await job.updateProgress(100);
};

export const startVectorizeCvWorker = () => {
  const worker = new Worker<VectorizeCvPayload>('vectorize-cv', handleVectorizeCvJob, {
    connection: connectionOptions,
  });

  worker.on('failed', (job, err) => {
    console.error(`[VectorizeCv] Job failed: ${job?.data.cvId}, Error: ${err.message}`);
  });

  worker.on('completed', (job) => {
    console.log(`[VectorizeCv] Job completed: ${job?.data.cvId}`);
  });

  return worker;
};
