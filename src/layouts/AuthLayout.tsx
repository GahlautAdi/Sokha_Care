import { Outlet } from 'react-router-dom';

import { AppBrand } from '@/components/common/AppBrand';
import { Card } from '@/components/ui/Card';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[1.1fr_0.9fr]">
      <aside className="relative hidden overflow-hidden bg-brand-700 px-8 py-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.2),transparent_30%)]" />
        <div className="relative z-10 space-y-8">
          <AppBrand />
          <div className="max-w-md space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-100">Unified care operations</p>
            <h1 className="text-4xl font-semibold leading-tight">
              A clean, scalable healthcare front end for every care team.
            </h1>
            <p className="text-sm leading-6 text-blue-100">
              Patients, doctors, pharmacy, emergency response, admin, and AI support are organized in one enterprise-ready interface.
            </p>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-3 text-sm text-blue-50">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4">Patient ready</div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4">Doctor friendly</div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4">Ops scalable</div>
        </div>
      </aside>

      <section className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden">
            <AppBrand />
          </div>
          <Card className="p-6 sm:p-8">
            <Outlet />
          </Card>
        </div>
      </section>
    </div>
  );
}
