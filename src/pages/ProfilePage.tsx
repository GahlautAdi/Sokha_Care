import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { PageHeader } from '@/components/common/PageHeader';
import { PageShell } from '@/components/common/PageShell';
import { ProfileOverviewCard } from '@/components/profile/ProfileOverviewCard';
import { PatientProfileForm } from '@/components/profile/PatientProfileForm';
import { DoctorProfileForm } from '@/components/profile/DoctorProfileForm';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { fetchProfileOverview } from '@/services/profile/profileApi';
import { useAuthStore } from '@/store/authStore';
import { formatRoleLabel, getPrimaryRole } from '@/utils/auth';
import { toApiError } from '@/utils/apiError';

function ProfilePage() {
  const authUser = useAuthStore((state) => state.user);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.profile.me,
    queryFn: fetchProfileOverview,
  });

  const currentRole = getPrimaryRole(data?.user ?? authUser);
  const roleLabel = formatRoleLabel(currentRole) ?? 'PROFILE';

  if (isLoading) {
    return (
      <PageShell>
        <Loader fullscreen label="Loading your profile..." />
      </PageShell>
    );
  }

  if (isError) {
    const normalized = toApiError(error);

    return (
      <PageShell>
        <div className="space-y-6">
          <PageHeader
            eyebrow="Account"
            title="Profile"
            description="We could not load your profile right now."
          />
          <EmptyState
            title="Profile unavailable"
            description={normalized.message}
            action={
              <Button onClick={() => refetch()} variant="secondary">
                Try again
              </Button>
            }
          />
        </div>
      </PageShell>
    );
  }

  if (!data) {
    return (
      <PageShell>
        <Loader fullscreen label="Preparing your profile..." />
      </PageShell>
    );
  }

  const profile = data;
  const canEditPatient = Boolean(profile.user.roles.includes('PATIENT'));
  const canEditDoctor = Boolean(profile.user.roles.includes('DOCTOR'));

  return (
    <PageShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow={roleLabel}
          title="Profile"
          description="Manage the account details that power Sokha Care profile features."
        />

        <ProfileOverviewCard profile={profile} />

        <div className="grid gap-6">
          {canEditPatient ? <PatientProfileForm profile={profile.patient} /> : null}
          {canEditDoctor ? <DoctorProfileForm profile={profile.doctor} /> : null}
        </div>

        {!canEditPatient && !canEditDoctor ? (
          <EmptyState
            title="No profile role available"
            description="Your account is authenticated, but it does not currently carry the patient or doctor role needed for profile editing."
          />
        ) : null}
      </div>
    </PageShell>
  );
}

export default ProfilePage;
