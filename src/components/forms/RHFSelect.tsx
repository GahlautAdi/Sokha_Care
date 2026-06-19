import type { SelectHTMLAttributes, ReactNode } from 'react';

import type { Control, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { Select } from '@/components/ui/Select';

type RHFSelectProps<TFieldValues extends FieldValues> = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
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

export function RHFSelect<TFieldValues extends FieldValues>({ name, control, ...props }: RHFSelectProps<TFieldValues>) {
  const { field, fieldState } = useController({ name, control });

  return <Select {...props} {...field} error={fieldState.error?.message} />;
}
