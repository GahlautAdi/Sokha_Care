import type { InputHTMLAttributes, ReactNode } from 'react';

import type { Control, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { Input } from '@/components/ui/Input';

type RHFInputProps<TFieldValues extends FieldValues> = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'name' | 'defaultValue' | 'value' | 'onChange' | 'onBlur' | 'ref'
> & {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string | undefined;
  hint?: string | undefined;
  error?: string | undefined;
  leftSlot?: ReactNode | undefined;
  rightSlot?: ReactNode | undefined;
};

export function RHFInput<TFieldValues extends FieldValues>({ name, control, ...props }: RHFInputProps<TFieldValues>) {
  const { field, fieldState } = useController({ name, control });

  return <Input {...props} {...field} error={fieldState.error?.message} />;
}
