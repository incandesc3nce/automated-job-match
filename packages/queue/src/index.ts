import { Queue } from 'bullmq';

export type VectorizeJobPayload = {
  jobId: string;
};

export type VectorizeCvPayload = {
  cvId: string;
};

export type MatchJobCvPayload = {
  jobId: string;
  cvId: string;
};

export const scrapeJobsQueue = new Queue<string>('scrape-jobs');
export const vectorizeJobQueue = new Queue<VectorizeJobPayload>('vectorize-job');
export const vectorizeCvQueue = new Queue<VectorizeCvPayload>('vectorize-cv');
export const matchJobCvQueue = new Queue<MatchJobCvPayload>('match-job-cv');
