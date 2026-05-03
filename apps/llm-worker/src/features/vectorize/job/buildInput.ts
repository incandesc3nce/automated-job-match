import { jobs } from '@career-ai/db';

export const buildVectorizeJobInput = (job: typeof jobs.$inferSelect): string => {
  const parts: string[] = [];

  parts.push(`title: ${job.title}`);
  parts.push(`description: ${job.shortDescription}`);

  if (job.skills.length > 0) {
    parts.push(`skills: ${job.skills.join(', ')}`);
  }

  if (job.salaryFrom || job.salaryTo) {
    const salary = [job.salaryFrom, job.salaryTo].filter(Boolean).join('-');
    parts.push(`salary: ${salary} ${job.salaryExtra}`.trim());
  }

  parts.push(`location: ${job.location}`);
  parts.push(`work format: ${job.workFormat.join(', ')}`);
  parts.push(`experience: ${job.experience}`);

  return parts.join('\n');
};
