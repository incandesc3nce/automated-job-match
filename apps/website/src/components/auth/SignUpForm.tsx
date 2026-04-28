'use client';

import { emailSchema } from '@/types/common/Email';
import { CardContent, CardFooter } from '../ui/card';
import { AuthCard } from './AuthCard';
import * as z from 'zod';
import { signUpPasswordSchema } from '@/types/common/Password';
import { usernameSchema } from '@/types/common/Username';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { APIFetch } from '@/utils/APIFetch';
import { redirect } from 'next/navigation';
import { EmailInput } from '../common/EmailInput';
import { PasswordInput } from '../common/PasswordInput';
import { Button } from '../ui/button';
import { UsernameInput } from '../common/UsernameInput';

const signUpFormSchema = z.object({
  email: emailSchema,
  name: usernameSchema,
  password: signUpPasswordSchema,
});

type SignUpFormData = z.infer<typeof signUpFormSchema>;

export const SignUpForm = () => {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    const result = await APIFetch<SignUpFormData>('/api/v1/auth/sign-up', {
      method: 'POST',
      body: data,
    });

    if (result.success) {
      redirect('/dashboard');
    } else {
      console.error('Sign-up error:', result.error);
    }
  };

  return (
    <AuthCard
      title="Регистрация в Career AI"
      description="Заполните форму ниже, чтобы создать новый аккаунт">
      <CardContent>
        <form
          id="sign-up-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <EmailInput field={field} fieldState={fieldState} />
            )}
          />
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <UsernameInput field={field} fieldState={fieldState} />
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <PasswordInput field={field} fieldState={fieldState} />
            )}
          />
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" form="sign-up-form">
          Зарегистрироваться
        </Button>
      </CardFooter>
    </AuthCard>
  );
};
