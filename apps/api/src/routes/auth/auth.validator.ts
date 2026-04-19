import * as z from 'zod';
import { zValidator } from '@/lib/validator';

export const signUpValidator = zValidator('json', z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email({ error: 'Invalid email address' }),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters long')
    .max(100, 'Password must be less than 100 characters long')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
}));

export const loginValidator = zValidator('json', z.object({
  email: z.email({ error: 'Invalid email address' }),
  password: z.string().min(1, 'Password is required')
}));
