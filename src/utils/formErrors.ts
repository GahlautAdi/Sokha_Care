import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import type { ValidationErrors } from '@/types/api';

export function applyFieldErrors<TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  fieldErrors: ValidationErrors | undefined
) {
  if (!fieldErrors) {
    return;
  }

  Object.entries(fieldErrors).forEach(([field, message]) => {
    setError(field as Path<TFieldValues>, {
      type: 'server',
      message,
    });
  });
}
