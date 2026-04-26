import * as z from 'zod';

export const loginPasswordSchema = z.string().min(1, 'Пароль обязателен');
export const signUpPasswordSchema = z
  .string()
  .min(12, 'Пароль должен быть не менее 12 символов')
  .max(100, 'Пароль должен быть не более 100 символов')
  .regex(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
  .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
  .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру');

export type LoginPassword = z.infer<typeof loginPasswordSchema>;
export type SignUpPassword = z.infer<typeof signUpPasswordSchema>;
