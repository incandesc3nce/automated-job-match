import { db, eq, jobs } from '@career-ai/db';
import {
  type ShortenDescriptionPayload,
  connectionOptions,
  Job,
  vectorizeJobQueue,
  Worker,
} from '@career-ai/queue';
import { buildShortenDescriptionPrompt, SYSTEM_PROMPT } from './buildInput';
import { llm } from '@/providers/llm';

const handleShortenDescriptionJob = async (job: Job<ShortenDescriptionPayload>) => {
  const { jobId } = job.data;
  await job.updateProgress(10);

  const [jobRow] = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      description: jobs.description,
    })
    .from(jobs)
    .where(eq(jobs.id, jobId));

  if (!jobRow) {
    throw new Error(`Job with ID ${jobId} not found`);
  }
  await job.updateProgress(30);

  const input = buildShortenDescriptionPrompt(jobRow);
  await job.updateProgress(60);

  const shortDescription = await llm.generate({
    input,
    systemPrompt: SYSTEM_PROMPT,
  });
  await job.updateProgress(80);

  await db.update(jobs).set({ shortDescription }).where(eq(jobs.id, jobId));
  await job.updateProgress(90);

  await vectorizeJobQueue.add(
    'vectorize-job',
    { jobId },
    { jobId: `vectorize-job-${jobId}` },
  );
  await job.updateProgress(100);
};

export const startShortenDescriptionWorker = () => {
  const worker = new Worker<ShortenDescriptionPayload>(
    'shorten-description',
    handleShortenDescriptionJob,
    {
      connection: connectionOptions,
    },
  );

  worker.on('failed', (job, err) => {
    console.error(
      `[ShortenDescription] Job failed: ${job?.data.jobId}, Error: ${err.message}`,
    );
  });

  worker.on('completed', (job) => {
    console.log(`[ShortenDescription] Job completed: ${job?.data.jobId}`);
  });

  return worker;
};
