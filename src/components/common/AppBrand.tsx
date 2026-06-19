import { APP_NAME } from '@/constants/app';
import { cn } from '@/utils/cn';

type AppBrandProps = {
  compact?: boolean;
  className?: string;
};

export function AppBrand({ compact = false, className }: AppBrandProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="grid size-11 place-items-center rounded-2xl bg-brand-600 text-sm font-bold text-white shadow-soft">
        SC
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-900">{APP_NAME}</p>
          <p className="text-xs text-slate-500">Healthcare ecosystem</p>
        </div>
      )}
    </div>
  );
}
