import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/common/PageHeader';
import { PageShell } from '@/components/common/PageShell';
import { ROUTES } from '@/constants/routes';

function PharmacyPage() {
  return (
    <PageShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Medication services"
          title="Pharmacy"
          description="A clean base for prescription handling, stock insights, and medication workflows."
          actions={<Button to={ROUTES.emergency} variant="secondary">Emergency tools</Button>}
        />
        <EmptyState
          title="Pharmacy tools will live here"
          description="This area is ready for inventory views, prescription management, and safe operational flows."
        />
      </div>
    </PageShell>
  );
}

export default PharmacyPage;
