import { Card } from '@/components/ui/Card';
import type { ProfileOverview } from '@/types/profile';
import { formatRoleLabel } from '@/utils/auth';

type ProfileOverviewCardProps = {
  profile: ProfileOverview;
};

export function ProfileOverviewCard({ profile }: ProfileOverviewCardProps) {
  const { user, patient, doctor } = profile;

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-emerald-500 px-6 py-6 text-white">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">Account profile</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              {user.firstName} {user.lastName}
            </h2>
            <p className="mt-1 text-sm text-white/85">{user.email}</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.18em] text-white/75">Roles</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {user.roles.map((role) => (
                <span key={role} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                  {formatRoleLabel(role)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-6 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Patient profile</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {patient ? 'Profile is configured' : 'Profile not configured yet'}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Doctor profile</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {doctor ? 'Profile is configured' : 'Profile not configured yet'}
          </p>
        </div>
      </div>
    </Card>
  );
}
