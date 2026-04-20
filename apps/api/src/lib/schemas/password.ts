import * as z from 'zod';

export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters long')
  .max(100, 'Password must be less than 100 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');