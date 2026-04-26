'use client';

import { CardContent, CardFooter } from '../ui/card';
import { AuthCard } from './AuthCard';
import { Button } from '../ui/button';
import { PasswordInput } from './PasswordInput';
import { EmailInput } from './EmailInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { emailSchema } from '@/types/auth/Email';
import { loginPasswordSchema } from '@/types/auth/Password';
import * as z from 'zod';

const loginFormSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export const LoginForm = () => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };

  return (
    <AuthCard
      title="Вход в аккаунт Career AI"
      description="Введите свой email и пароль для входа в аккаунт">
      <CardContent>
        <form
          id="login-form"
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
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <PasswordInput field={field} fieldState={fieldState} />
            )}
          />
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" form="login-form">
          Войти
        </Button>
      </CardFooter>
    </AuthCard>
  );
};
