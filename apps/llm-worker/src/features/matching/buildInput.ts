import type { cvs, jobs } from '@career-ai/db';

export const SYSTEM_PROMPT = `Ты профессиональный ассистент в подборе работы. 
Проанализируй соотвествие резюме к вакансии и ответь ТОЛЬКО верным JSON. Объяснений помимо JSON ответа не требуется.`;

export const buildMatchPrompt = (
  cv: typeof cvs.$inferSelect,
  job: typeof jobs.$inferSelect,
) => {
  const yearsOfExperience = Math.floor(cv.experienceMonths / 12);
  const monthsOfExperience = cv.experienceMonths % 12;

  return `Проанализируй насколько данный кандидат подходит под вакансию.
КАНДИДАТ:
Должность: ${cv.title}
Навыки: ${cv.skills.join(', ')}
Опыт работы: ${yearsOfExperience} лет и ${monthsOfExperience} месяцев

ВАКАНСИЯ:
Должность: ${job.title}
Необходимые навыки: ${job.skills.join(', ')}
Описание: ${job.description}

Ответ должен быть в формате JSON с именно такой структурой:
{
  "score": <integer 0-100>,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "reasoning": "<2-3 предложения объясняющие score>",
  "verdict": "strong_match" | "good_match" | "partial_match" | "poor_match"
}
`;
};
