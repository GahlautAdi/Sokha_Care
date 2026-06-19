import { cn } from '@/utils/cn';

type FormNoticeTone = 'error' | 'success' | 'info';

type FormNoticeProps = {
  tone: FormNoticeTone;
  title?: string;
  message: string;
};

const toneClasses: Record<FormNoticeTone, string> = {
  error: 'border-rose-200 bg-rose-50 text-rose-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  info: 'border-slate-200 bg-slate-50 text-slate-700',
};

export function FormNotice({ tone, title, message }: FormNoticeProps) {
  return (
    <div className={cn('rounded-2xl border px-4 py-3 text-sm', toneClasses[tone])} role={tone === 'error' ? 'alert' : 'status'}>
      {title ? <p className="font-semibold">{title}</p> : null}
      <p className={cn(title && 'mt-1')}>{message}</p>
    </div>
  );
}
