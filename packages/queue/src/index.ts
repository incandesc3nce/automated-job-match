import { Job, Queue } from 'bullmq';

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

export const scrapeJobsQueue = new Queue<string>('scrape-jobs');
export const shortenDescriptionQueue = new Queue<ShortenDescriptionPayload>(
  'shorten-description',
);
export const vectorizeJobQueue = new Queue<VectorizeJobPayload>('vectorize-job');
export const vectorizeCvQueue = new Queue<VectorizeCvPayload>('vectorize-cv');
export const matchJobCvQueue = new Queue<MatchJobCvPayload>('match-job-cv');

export { Worker, Job } from 'bullmq';
