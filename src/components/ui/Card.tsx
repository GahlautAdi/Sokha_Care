import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return <section className={cn('rounded-3xl border border-slate-200 bg-white shadow-panel', className)}>{children}</section>;
}
