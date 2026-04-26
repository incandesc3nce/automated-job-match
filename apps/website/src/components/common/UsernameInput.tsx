import { ControllerFieldState, ControllerRenderProps } from 'react-hook-form';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { FieldError } from '../ui/field';

type UsernameInputProps = {
  field: ControllerRenderProps<any, 'name'>;
  fieldState: ControllerFieldState;
};

export const UsernameInput = ({ field, fieldState }: UsernameInputProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="name">Имя</Label>
      <Input
        {...field}
        id="name"
        type="text"
        placeholder="Ваше имя"
        aria-invalid={fieldState.invalid}
        required
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </div>
  );
};
