import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/common/PageHeader';
import { PageShell } from '@/components/common/PageShell';
import { ROUTES } from '@/constants/routes';

function DoctorsPage() {
  return (
    <PageShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Clinical network"
          title="Doctors"
          description="A modular space for doctor profiles, specialties, availability, and future scheduling."
          actions={<Button to={ROUTES.appointments}>See appointments</Button>}
        />
        <EmptyState
          title="Doctor directory coming next"
          description="This foundation page is ready for list views, filters, availability calendars, and provider details."
        />
      </div>
    </PageShell>
  );
}

export default DoctorsPage;
