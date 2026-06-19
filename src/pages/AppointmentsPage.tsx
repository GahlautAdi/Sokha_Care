import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/common/PageHeader';
import { PageShell } from '@/components/common/PageShell';
import { ROUTES } from '@/constants/routes';

function AppointmentsPage() {
  return (
    <PageShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Care scheduling"
          title="Appointments"
          description="A future-ready base for appointment booking, calendars, rescheduling, and reminders."
          actions={<Button to={ROUTES.doctors}>Browse doctors</Button>}
        />
        <EmptyState
          title="Appointment workflows are scaffolded"
          description="You can plug in booking forms, timelines, patient lists, and state-driven actions here."
        />
      </div>
    </PageShell>
  );
}

export default AppointmentsPage;
