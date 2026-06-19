import { Outlet, useNavigate } from 'react-router-dom';

import { AppBrand } from '@/components/common/AppBrand';
import { Button } from '@/components/ui/Button';
import { dashboardNavigation } from '@/constants/navigation';
import { ROUTES } from '@/constants/routes';
import { logout } from '@/services/auth/authApi';
import { useAuthStore } from '@/store/authStore';
import { formatRoleLabel, getPrimaryRole, getUserDisplayName } from '@/utils/auth';
import { cn } from '@/utils/cn';

export function DashboardLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const role = getPrimaryRole(user);
  const roleLabel = formatRoleLabel(role);
  const displayName = getUserDisplayName(user);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-slate-200 p-6">
            <AppBrand />
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {dashboardNavigation.map((item) => (
              <Button
                key={item.to}
                to={item.to}
                variant="ghost"
                className="w-full justify-start px-4 py-3 text-left"
              >
                <span className="flex flex-col items-start">
                  <span>{item.label}</span>
                  {item.description ? <span className="text-xs text-slate-500">{item.description}</span> : null}
                </span>
              </Button>
            ))}
          </nav>
            <div className="border-t border-slate-200 p-4">
              <div className="mb-4 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">{displayName}</p>
              <p className="text-xs text-slate-500">{roleLabel ?? 'NO ROLE'}</p>
              </div>
            <Button variant="secondary" fullWidth onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="lg:hidden">
                <AppBrand compact />
              </div>
              <div className={cn('ml-auto flex items-center gap-3', !user && 'ml-0')}>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium text-slate-900">{displayName}</p>
                  <p className="text-xs text-slate-500">{roleLabel ?? 'WORKSPACE'}</p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
            <nav className="flex gap-2 overflow-x-auto border-t border-slate-200 px-4 py-3 lg:hidden">
              {dashboardNavigation.map((item) => (
                <Button key={item.to} to={item.to} variant="ghost" size="sm" className="whitespace-nowrap">
                  {item.label}
                </Button>
              ))}
            </nav>
          </header>

          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
