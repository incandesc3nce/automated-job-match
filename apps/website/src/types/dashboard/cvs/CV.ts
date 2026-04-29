import * as z from 'zod';

const titleSchema = z
  .string()
  .min(1, { message: 'Название резюме не может быть пустым' })
  .max(50, { message: 'Название резюме не может быть длиннее 50 символов' });
const locationSchema = z
  .string()
  .min(1, { message: 'Местоположение не может быть пустым' })
  .max(100, { message: 'Местоположение не может быть длиннее 100 символов' });
const experienceMonthsSchema = z
  .int()
  .nonnegative({ message: 'Опыт работы не может быть отрицательным' });
const skillsSchema = z
  .array(
    z
      .string()
      .min(1, { message: 'Навык не может быть пустым' })
      .max(30, { message: 'Навык не может быть длиннее 30 символов' }),
  )
  .max(20, { message: 'Максимум 20 навыков' });
const workFormatSchema = z.enum(['any', 'remote', 'office', 'hybrid'], {
  message: 'Неверный формат работы',
});

export const cvSchema = z.object({
  id: z.string(),
  title: titleSchema,
  location: locationSchema,
  experienceMonths: experienceMonthsSchema,
  skills: skillsSchema,
  workFormat: workFormatSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const cvFormSchema = cvSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CVData = z.infer<typeof cvSchema>;
export type CVFormData = z.infer<typeof cvFormSchema>;
