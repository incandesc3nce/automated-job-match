import * as z from 'zod';
import { zValidator } from '@/lib/validator';
import { passwordSchema } from '@/lib/schemas/password';

const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email({ error: 'Invalid email address' }),
  password: passwordSchema,
});

const loginSchema = z.object({
  email: z.email({ error: 'Invalid email address' }),
  password: z.string().min(1, 'Password is required'),
});

export const signUpValidator = zValidator('json', signUpSchema);
export const loginValidator = zValidator('json', loginSchema);

export type SignUpBody = z.infer<typeof signUpSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
