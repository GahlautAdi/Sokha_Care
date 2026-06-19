import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string | undefined;
  hint?: string | undefined;
  error?: string | undefined;
  leftSlot?: ReactNode | undefined;
  rightSlot?: ReactNode | undefined;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, leftSlot, rightSlot, className, id, children, ...props },
  ref
) {
  const selectId = id ?? props.name;

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
        <select
          {...props}
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
          className="w-full border-0 bg-transparent p-0 text-sm outline-none focus:ring-0"
        >
          {children}
        </select>
        {rightSlot ? <div className="text-slate-400">{rightSlot}</div> : null}
      </div>

      {hint && !error ? (
        <p id={`${selectId}-hint`} className="text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${selectId}-error`} className="text-xs font-medium text-rose-600">
          {error}
        </p>
      ) : null}
    </label>
  );
});
