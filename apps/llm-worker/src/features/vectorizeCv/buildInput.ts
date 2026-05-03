import { cvs } from '@career-ai/db';

export const buildVectorizeJobInput = (cv: typeof cvs.$inferSelect): string => {
  const parts: string[] = [];

  const experienceYears = Math.floor(cv.experienceMonths / 12);
  const experienceMonths = cv.experienceMonths % 12;
  let experience = '';

  if (experienceYears > 0) {
    if (experienceYears <= 3) {
      experience += `${experienceYears} года`;
    } else {
      experience += `${experienceYears} лет`;
    }
  }

  if (experienceMonths > 0) {
    if (experienceYears > 0) {
      experience += ' ';
    }

    experience += `${experienceMonths} месяцев`;
  }

  parts.push(`title: ${cv.title}`);

  if (cv.skills.length > 0) {
    parts.push(`skills: ${cv.skills.join(', ')}`);
  }

  parts.push(`location: ${cv.location}`);
  parts.push(`work format: ${cv.workFormat}`);
  parts.push(`experience: ${experienceYears} лет`);

  return parts.join('\n');
};
