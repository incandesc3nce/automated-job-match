import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SetState } from '@/types/common/SetState';
import { CVData, CVFormData, cvFormSchema } from '@/types/dashboard/cvs/CV';
import { APIFetch } from '@/utils/APIFetch';
import { zodResolver } from '@hookform/resolvers/zod';
import { XIcon } from 'lucide-react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

type CvFormProps = (
  | {
      action: 'edit';
      cv: CVData;
    }
  | {
      action: 'create';
    }
) & {
  setCvs: SetState<CVData[]>;
  setOpen: SetState<boolean>;
};

export const CvForm = (props: CvFormProps) => {
  const { action, setCvs, setOpen } = props;
  const cv = action === 'edit' ? props.cv : null;
  const formId = `cv-form-${cv?.id ?? 'new'}`;

  const form = useForm<CVFormData>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: {
      ...(cv || {
        title: '',
        location: '',
        experienceMonths: 0,
        skills: [],
        workFormat: 'any',
      }),
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    //@ts-ignore
    name: 'skills',
  });

  const onSubmit = async (data: CVFormData) => {
    if (action === 'edit') {
      const result = await APIFetch<CVData>(`/api/v1/cvs/${cv?.id}`, {
        method: 'PATCH',
        body: data,
      });

      if (result.success) {
        setCvs((prev) => prev.map((item) => (item.id === cv?.id ? result.data : item)));
      } else {
        console.error('Failed to update CV:', result.error);
      }
    } else if (action === 'create') {
      const result = await APIFetch<CVData>('/api/v1/cvs/form', {
        method: 'POST',
        body: data,
      });

      if (result.success) {
        setCvs((prev) => [result.data, ...prev]);
      } else {
        console.error('Failed to create CV:', result.error);
      }
    }

    setOpen(false);
  };

  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="responsive" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title">Должность</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id="title"
                placeholder="Ваша должность"
                required
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="location"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="responsive" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="location">Город</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id="location"
                placeholder="Город, в котором вы ищете работу"
                required
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="experienceMonths"
          control={form.control}
          render={({ field, fieldState }) => {
            const totalMonths = Number.isFinite(field.value) ? field.value : 0;
            const years = Math.floor(totalMonths / 12);
            const months = totalMonths % 12;

            return (
              <FieldSet data-invalid={fieldState.invalid}>
                <FieldLegend variant="label">Опыт работы</FieldLegend>
                <FieldDescription>Укажите отдельно годы и месяцы.</FieldDescription>
                <FieldGroup className="grid grid-cols-2 gap-4">
                  <Field>
                    <Label htmlFor="experienceYears">Годы</Label>
                    <Input
                      id="experienceYears"
                      type="number"
                      min={0}
                      step={1}
                      value={years}
                      onChange={(event) => {
                        const nextYears = Math.max(0, Number(event.target.value) || 0);
                        field.onChange(nextYears * 12 + months);
                      }}
                      aria-invalid={fieldState.invalid}
                      placeholder="Годы"
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="experienceMonths">Месяцы</Label>
                    <Input
                      id="experienceMonths"
                      type="number"
                      min={0}
                      max={11}
                      step={1}
                      value={months}
                      onChange={(event) => {
                        const rawMonths = Number(event.target.value);
                        const nextMonths = Number.isNaN(rawMonths)
                          ? 0
                          : Math.min(11, Math.max(0, rawMonths));
                        field.onChange(years * 12 + nextMonths);
                      }}
                      aria-invalid={fieldState.invalid}
                      placeholder="Месяцы"
                    />
                  </Field>
                </FieldGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldSet>
            );
          }}
        />

        <FieldSet>
          <FieldLegend variant="label">Навыки</FieldLegend>
          <FieldDescription>Введите до 20 навыков.</FieldDescription>
          <div className="overflow-x-hidden max-h-[20vh] overflow-y-auto">
            <FieldGroup className="gap-4">
              {fields.map((skill, index) => (
                <Controller
                  key={skill.id}
                  name={`skills.${index}`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            id={`skill-${index}`}
                            aria-invalid={fieldState.invalid}
                            placeholder="Навык"
                            type="text"
                          />
                          {fields.length > 1 && (
                            <InputGroupAddon align="inline-end">
                              <InputGroupButton
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => remove(index)}
                                aria-label={`Удалить навык ${index + 1}`}>
                                <XIcon />
                              </InputGroupButton>
                            </InputGroupAddon>
                          )}
                        </InputGroup>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </FieldContent>
                    </Field>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append('')}
                disabled={fields.length >= 20}>
                Добавить навык
              </Button>
            </FieldGroup>
          </div>
        </FieldSet>

        <Controller
          name="workFormat"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="responsive" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="workFormat">Формат работы</FieldLabel>
              </FieldContent>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Выбор" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Любой</SelectItem>
                  <SelectSeparator />
                  <SelectItem value="onsite">На месте работодателя</SelectItem>
                  <SelectItem value="remote">Удаленно</SelectItem>
                  <SelectItem value="hybrid">Гибрид</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
};
