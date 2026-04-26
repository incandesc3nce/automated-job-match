'use client';

import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useState } from 'react';
import { FieldError } from '../ui/field';
import { ControllerFieldState, ControllerRenderProps } from 'react-hook-form';

type PasswordInputProps = {
  field: ControllerRenderProps<any, 'password'>;
  fieldState: ControllerFieldState;
};

export const PasswordInput = ({ field, fieldState }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid gap-2">
      <Label htmlFor="password">Пароль</Label>
      <div className="relative">
        <Input
          {...field}
          id="password"
          type={showPassword ? 'text' : 'password'}
          aria-invalid={fieldState.invalid}
          required
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword((prev) => !prev)}>
          {showPassword && <Eye className="size-4" aria-hidden="true" />}
          {!showPassword && <EyeOff className="size-4" aria-hidden="true" />}
        </Button>
      </div>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </div>
  );
};
