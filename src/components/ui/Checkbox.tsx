import type { InputHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  hint?: string;
  error?: string;
};

export function Checkbox({ label, hint, error, className, id, ...props }: CheckboxProps) {
  const inputId = id ?? props.name;

  return (
    <label className={cn('flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm', className)} htmlFor={inputId}>
      <span className="mt-0.5 grid size-5 place-items-center rounded border border-slate-300 bg-white">
        <input
          {...props}
          id={inputId}
          type="checkbox"
          className="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        />
      </span>
      <span className="space-y-1">
        {label ? <span className="block text-sm font-medium text-slate-700">{label}</span> : null}
        {hint && !error ? (
          <span id={`${inputId}-hint`} className="block text-xs text-slate-500">
            {hint}
          </span>
        ) : null}
        {error ? (
          <span id={`${inputId}-error`} className="block text-xs font-medium text-rose-600">
            {error}
          </span>
        ) : null}
      </span>
    </label>
  );
}
