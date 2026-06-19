import { cn } from '@/utils/cn';

type LoaderProps = {
  label?: string;
  fullscreen?: boolean;
  className?: string;
};

export function Loader({ label = 'Loading...', fullscreen = false, className }: LoaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-3 text-sm text-slate-600',
        fullscreen && 'min-h-[70vh] flex-col bg-slate-50',
        className
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="size-5 animate-spin rounded-full border-2 border-brand-600 border-r-transparent" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
