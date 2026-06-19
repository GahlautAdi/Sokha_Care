import type { TextareaHTMLAttributes, ReactNode } from 'react';

import type { Control, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { Textarea } from '@/components/ui/Textarea';

type RHFTextareaProps<TFieldValues extends FieldValues> = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
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

export function RHFTextarea<TFieldValues extends FieldValues>({ name, control, ...props }: RHFTextareaProps<TFieldValues>) {
  const { field, fieldState } = useController({ name, control });

  return <Textarea {...props} {...field} error={fieldState.error?.message} />;
}
