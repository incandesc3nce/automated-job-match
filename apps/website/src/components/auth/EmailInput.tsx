import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FieldError } from '../ui/field';
import { ControllerFieldState, ControllerRenderProps } from 'react-hook-form';

type EmailInputProps = {
  field: ControllerRenderProps<any, 'email'>;
  fieldState: ControllerFieldState;
};

export const EmailInput = ({ field, fieldState }: EmailInputProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input
        {...field}
        id="email"
        type="email"
        placeholder="email@career-ai.com"
        aria-invalid={fieldState.invalid}
        required
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </div>
  );
};
