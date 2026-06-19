import { Outlet } from 'react-router-dom';

import { AppBrand } from '@/components/common/AppBrand';
import { Button } from '@/components/ui/Button';
import { publicNavigation } from '@/constants/navigation';
import { ROUTES } from '@/constants/routes';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-hero-gradient text-slate-900">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <AppBrand />
          <nav className="hidden items-center gap-2 sm:flex">
            {publicNavigation.map((item) => (
              <Button key={item.to} to={item.to} variant="ghost" size="sm">
                {item.label}
              </Button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button to={ROUTES.login} variant="secondary" size="sm">
              Login
            </Button>
            <Button to={ROUTES.register} size="sm">
              Register
            </Button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
