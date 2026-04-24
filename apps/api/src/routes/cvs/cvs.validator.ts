import * as z from 'zod';
import { zValidator } from '@/lib/validator';
import { cvs } from '@career-ai/db';

const cvSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  location: z.string().min(1, 'Location is required'),
  experienceMonths: z
    .int()
    .nonnegative('Experience months must be a non-negative integer'),
  skills: z
    .array(z.string().min(1, 'Skill cannot be empty'))
    .min(1, 'At least one skill is required'),
  workFormat: z.enum(cvs.workFormat.enumValues),
});

const updateCvSchema = cvSchema.partial();

export const createCvValidator = zValidator('json', cvSchema);
export const updateCvValidator = zValidator('json', updateCvSchema);

export type CreateCvBody = z.infer<typeof cvSchema>;
export type UpdateCvBody = z.infer<typeof updateCvSchema>;
