import {
  type MatchCvToJobPayload,
  Worker,
  Job,
  connectionOptions,
  matchGenerationQueue,
} from '@career-ai/queue';
import { findTopJobsForCv } from '../queries';

const handleMatchingCvToJobs = async (job: Job<MatchCvToJobPayload>) => {
  const { cvId } = job.data;
  await job.updateProgress(10);

  const topMatches = await findTopJobsForCv(cvId);
  await job.updateProgress(50);

  await matchGenerationQueue.addBulk(
    topMatches.map((match) => ({
      name: 'match-generation',
      data: {
        cvId,
        jobId: match.jobId,
        similarity: match.similarity,
      },
    })),
  );
  await job.updateProgress(100);
};

export const startMatchingCvToJobsWorker = () => {
  const worker = new Worker<MatchCvToJobPayload>(
    'match-cv-to-jobs',
    handleMatchingCvToJobs,
    {
      connection: connectionOptions,
    },
  );

  worker.on('failed', (job, err) => {
    console.error(
      `[Matching CV-to-Jobs] Job failed: ${job?.data.cvId}, Error: ${err.message}`,
    );
  });

  worker.on('completed', (job) => {
    console.log(`[Matching CV-to-Jobs] Job completed: ${job?.data.cvId}`);
  });

  return worker;
};
