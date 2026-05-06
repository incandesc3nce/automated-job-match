import { emailSchema } from '@/types/common/Email';
import { signUpPasswordSchema } from '@/types/common/Password';
import { usernameSchema } from '@/types/common/Username';
import * as z from 'zod';

export const settingsFormSchema = z.object({
  name: usernameSchema.optional(),
  email: emailSchema.optional(),
  password: signUpPasswordSchema.optional(),
  newPassword: signUpPasswordSchema.optional(),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
