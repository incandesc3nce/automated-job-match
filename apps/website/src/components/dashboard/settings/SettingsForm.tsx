'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  settingsFormSchema,
  SettingsFormValues,
} from '@/types/dashboard/settings/SettingsForm';
import { APIFetch } from '@/utils/APIFetch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

type SettingsFormProps = {
  name: string;
  email: string;
};

export const SettingsForm = ({ name, email }: SettingsFormProps) => {
  const router = useRouter();
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      name,
      email,
      password: '',
      newPassword: '',
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    const result = await APIFetch<SettingsFormValues>('/api/v1/users/me', {
      method: 'PATCH',
      body: data,
    });

    if (result.success) {
      router.refresh();
    } else {
      console.error('Error updating settings:', result.error);
    }
  };

  return (
    <form id="settings-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="name">Имя</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="Ваше имя"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="email@career-ai.com"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="password">Старый пароль</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="Введите старый пароль"
                type="password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="newPassword">Новый пароль</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="Введите новый пароль"
                type="password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" className="mt-4">
        Сохранить изменения
      </Button>
    </form>
  );
};
