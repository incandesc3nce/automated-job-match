import * as z from 'zod';
import { zValidator } from '@/lib/validator';
import { passwordSchema } from '@/lib/schemas/password';

const updateUserSchema = z
  .object({
    name: z.string().min(1, 'Name is required').optional(),
    email: z.email({ error: 'Invalid email address' }).optional(),
    oldPassword: z.string().min(1, 'Old password is required').optional(),
    newPassword: passwordSchema.optional(),
  })
  .refine(
    (data) => {
      console.log(data.newPassword, data.oldPassword);
      if (data.newPassword && !data.oldPassword) {
        return false;
      }
      return true;
    },
    { error: 'Old password is required when setting a new password' },
  );

export const updateUserValidator = zValidator('json', updateUserSchema);

export type UpdateUserBody = z.infer<typeof updateUserSchema>;
