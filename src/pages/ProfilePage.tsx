import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { PageShell } from '@/components/common/PageShell';
import { useAuthStore } from '@/store/authStore';
import { formatRoleLabel, getPrimaryRole, getUserDisplayName, getUserInitials } from '@/utils/auth';

function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const role = formatRoleLabel(getPrimaryRole(user)) ?? 'NO ROLE';
  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);

  return (
    <PageShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Account"
          title="Profile"
          description="A clean base for personal details, preferences, and contact information."
        />

        <Card className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="grid size-20 place-items-center rounded-3xl bg-brand-50 text-2xl font-semibold text-brand-700">
              {initials}
            </div>
            <div className="space-y-1">
              <p className="text-xl font-semibold text-slate-900">{displayName}</p>
              <p className="text-sm text-slate-600">{user?.email ?? 'user@sokhacare.com'}</p>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-600">{role}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Status</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Active workspace session</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Security</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Token based access ready</p>
            </div>
          </div>

          <div className="mt-6">
            <Button variant="secondary">Edit profile</Button>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

export default ProfilePage;
