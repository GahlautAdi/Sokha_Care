import { forwardRef, type TextareaHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils/cn';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string | undefined;
  hint?: string | undefined;
  error?: string | undefined;
  leftSlot?: ReactNode | undefined;
  rightSlot?: ReactNode | undefined;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, leftSlot, rightSlot, className, id, ...props },
  ref
) {
  const textareaId = id ?? props.name;

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
          'flex min-h-28 items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm transition focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100',
          error && 'border-rose-300 focus-within:border-rose-400 focus-within:ring-rose-100',
          className
        )}
      >
        {leftSlot ? <div className="pt-1 text-slate-400">{leftSlot}</div> : null}
        <textarea
          {...props}
          ref={ref}
          id={textareaId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          className="min-h-24 w-full border-0 bg-transparent p-0 text-sm outline-none placeholder:text-slate-400 focus:ring-0"
        />
        {rightSlot ? <div className="pt-1 text-slate-400">{rightSlot}</div> : null}
      </div>

      {hint && !error ? (
        <p id={`${textareaId}-hint`} className="text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${textareaId}-error`} className="text-xs font-medium text-rose-600">
          {error}
        </p>
      ) : null}
    </label>
  );
});
