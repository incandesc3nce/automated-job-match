import { Queue, type ConnectionOptions } from 'bullmq';

type JobId = {
  jobId: string;
};

type CvId = {
  cvId: string;
};

export type ShortenDescriptionPayload = JobId;
export type VectorizeJobPayload = JobId;
export type VectorizeCvPayload = CvId;
export type MatchJobCvPayload = JobId & CvId;

export const connectionOptions: ConnectionOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT) || 6379,
};

export const scrapeJobsQueue = new Queue<string>('scrape-jobs', {
  connection: connectionOptions,
});
export const shortenDescriptionQueue = new Queue<ShortenDescriptionPayload>(
  'shorten-description',
  { connection: connectionOptions },
);
export const vectorizeJobQueue = new Queue<VectorizeJobPayload>('vectorize-job', {
  connection: connectionOptions,
});
export const vectorizeCvQueue = new Queue<VectorizeCvPayload>('vectorize-cv', {
  connection: connectionOptions,
});
export const matchJobCvQueue = new Queue<MatchJobCvPayload>('match-job-cv', {
  connection: connectionOptions,
  defaultJobOptions: {
    attempts: 3,
  },
});

export { Worker, Job } from 'bullmq';
