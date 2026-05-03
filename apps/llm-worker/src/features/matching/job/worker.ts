import {
  type MatchJobToCvsPayload,
  connectionOptions,
  Job,
  matchGenerationQueue,
  Worker,
} from '@career-ai/queue';
import { findTopCvsForJob } from '../queries';

const handleMatchingJobToCvs = async (job: Job<MatchJobToCvsPayload>) => {
  const { jobId } = job.data;
  await job.updateProgress(10);

  const topMatches = await findTopCvsForJob(jobId);
  await job.updateProgress(50);

  await matchGenerationQueue.addBulk(
    topMatches.map((match) => ({
      name: 'match-generation',
      data: {
        cvId: match.cvId,
        jobId,
        similarity: match.similarity,
      },
    })),
  );
  await job.updateProgress(100);
};

export const startMatchingJobToCvsWorker = () => {
  const worker = new Worker<MatchJobToCvsPayload>(
    'match-job-to-cvs',
    handleMatchingJobToCvs,
    {
      connection: connectionOptions,
    },
  );

  worker.on('failed', (job, err) => {
    console.error(
      `[Matching Job-to-CVs] Job failed: ${job?.data.jobId}, Error: ${err.message}`,
    );
  });

  worker.on('completed', (job) => {
    console.log(`[Matching Job-to-CVs] Job completed: ${job?.data.jobId}`);
  });

  return worker;
};
