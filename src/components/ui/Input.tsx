import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string | undefined;
  hint?: string | undefined;
  error?: string | undefined;
  leftSlot?: ReactNode | undefined;
  rightSlot?: ReactNode | undefined;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leftSlot, rightSlot, className, id, ...props },
  ref
) {
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-1.5">
      {label ? (
        <span className="text-sm font-medium text-slate-700">
          {label}
          {props.required ? <span className="ml-1 text-rose-600">*</span> : null}
        </span>
      ) : null}

      <div
        className={cn(
          'flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 shadow-sm transition focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100',
          error && 'border-rose-300 focus-within:border-rose-400 focus-within:ring-rose-100',
          className
        )}
      >
        {leftSlot ? <div className="text-slate-400">{leftSlot}</div> : null}
        <input
          {...props}
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className="w-full border-0 bg-transparent p-0 text-sm outline-none placeholder:text-slate-400 focus:ring-0"
        />
        {rightSlot ? <div className="text-slate-400">{rightSlot}</div> : null}
      </div>

      {hint && !error ? (
        <p id={`${inputId}-hint`} className="text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${inputId}-error`} className="text-xs font-medium text-rose-600">
          {error}
        </p>
      ) : null}
    </label>
  );
});
