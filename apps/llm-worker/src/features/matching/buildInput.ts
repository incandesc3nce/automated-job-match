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
Score должен отражать общее соответствие кандидата вакансии, учитывая все факторы. от 0 (совершенно не подходит) до 100 (идеальное соответствие). Если в резюме есть все необходимые навыки и опыт, score должен быть 100. Если отсутствуют ключевые навыки или опыт, score должен быть ниже. reasoning должен кратко объяснять, почему был поставлен такой score, ссылаясь на конкретные навыки и опыт из резюме и вакансии. verdict должен быть категоризацией соответствия на основе score: strong_match (80-100), good_match (60-79), partial_match (40-59), poor_match (0-39).
`;
};
