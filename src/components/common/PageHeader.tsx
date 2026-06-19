import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ eyebrow, title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="space-y-1">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">{eyebrow}</p> : null}
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        {description ? <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
