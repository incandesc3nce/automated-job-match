import * as z from 'zod';

const matchSchema = z.object({
  score: z.number().min(0).max(100),
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  reasoning: z.string(),
  verdict: z.enum(['strong_match', 'good_match', 'partial_match', 'poor_match']),
});

export type Match = z.infer<typeof matchSchema>;
