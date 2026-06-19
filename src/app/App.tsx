import { Suspense } from 'react';

import { AppErrorBoundary } from '@/components/feedback/AppErrorBoundary';
import { Loader } from '@/components/ui/Loader';
import { AppRoutes } from '@/routes/AppRoutes';

export function App() {
  return (
    <AppErrorBoundary>
      <Suspense fallback={<Loader fullscreen label="Loading Sokha Care..." />}>
        <AppRoutes />
      </Suspense>
    </AppErrorBoundary>
  );
}
