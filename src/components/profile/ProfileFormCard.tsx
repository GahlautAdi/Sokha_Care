import type { ReactNode } from 'react';

import { Card } from '@/components/ui/Card';
import { FormNotice } from '@/components/forms/FormNotice';

type ProfileFormCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  status?: ReactNode;
  successMessage?: string | null;
  errorMessage?: string | null;
};

export function ProfileFormCard({ title, description, children, status, successMessage, errorMessage }: ProfileFormCardProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        {status ? <div>{status}</div> : null}
      </div>

      {successMessage ? (
        <div className="mt-5">
          <FormNotice tone="success" title="Saved" message={successMessage} />
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-5">
          <FormNotice tone="error" title="Unable to save" message={errorMessage} />
        </div>
      ) : null}

      <div className="mt-6">{children}</div>
    </Card>
  );
}
