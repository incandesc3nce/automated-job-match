import * as z from 'zod';

export const usernameSchema = z.string().min(1, 'Имя не может быть пустым');

export type Username = z.infer<typeof usernameSchema>;
