import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { Loader } from '@/components/ui/Loader';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/authStore';
import type { Role } from '@/types/auth';

type ProtectedRouteProps = {
  allowedRoles?: readonly Role[];
};

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return <Loader fullscreen label="Preparing secure workspace..." />;
  }

  if (!accessToken) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = user?.roles.some((role) => allowedRoles.includes(role)) ?? false;

    if (!hasAccess) {
      return <Navigate to={ROUTES.dashboard} replace />;
    }
  }

  return <Outlet />;
}
