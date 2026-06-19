import { Navigate, Outlet } from 'react-router-dom';

import { Loader } from '@/components/ui/Loader';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/authStore';

export function PublicRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return <Loader fullscreen label="Loading access state..." />;
  }

  if (accessToken) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <Outlet />;
}
