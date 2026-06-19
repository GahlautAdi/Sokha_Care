import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/common/PageHeader';
import { PageShell } from '@/components/common/PageShell';
import { ROUTES } from '@/constants/routes';

function EmergencyPage() {
  return (
    <PageShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Rapid response"
          title="Emergency"
          description="Built to support critical care actions with a calm, high-contrast, accessible UI."
          actions={<Button to={ROUTES.dashboard} variant="secondary">Back to dashboard</Button>}
        />
        <EmptyState
          title="Emergency response foundation"
          description="You can add triage views, call buttons, escalation steps, and incident tracking later."
        />
      </div>
    </PageShell>
  );
}

export default EmergencyPage;
