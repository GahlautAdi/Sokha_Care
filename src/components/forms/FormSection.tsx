import type { ReactNode } from 'react';

type FormSectionProps = {
  title?: string;
  description?: string;
  children: ReactNode;
};

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="space-y-4">
      {title ? (
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {description ? <p className="text-sm text-slate-600">{description}</p> : null}
        </div>
      ) : null}
      <div className="space-y-4">{children}</div>
    </section>
  );
}
