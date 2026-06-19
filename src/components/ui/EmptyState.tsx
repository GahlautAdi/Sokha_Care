import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center shadow-panel', className)}>
      {icon ? <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">{icon}</div> : null}
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
