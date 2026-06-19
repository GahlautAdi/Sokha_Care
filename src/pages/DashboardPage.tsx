import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { PageShell } from '@/components/common/PageShell';
import { ROUTES } from '@/constants/routes';

const dashboardTiles = [
  { title: 'Active patients', value: '128', note: '+12 this week' },
  { title: 'Appointments', value: '36', note: 'Today' },
  { title: 'Pharmacy queue', value: '18', note: 'Pending review' },
  { title: 'Emergency alerts', value: '4', note: 'Monitoring' },
];

function DashboardPage() {
  return (
    <PageShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Operations overview"
          title="Dashboard"
          description="This is the starter command center for the Sokha Care ecosystem."
          actions={
            <>
              <Button to={ROUTES.appointments} variant="secondary">
                View appointments
              </Button>
              <Button to={ROUTES.aiAssistant}>Open AI assistant</Button>
            </>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardTiles.map((tile) => (
            <Card key={tile.title} className="p-5">
              <p className="text-sm font-medium text-slate-500">{tile.title}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{tile.value}</p>
              <p className="mt-2 text-sm text-slate-600">{tile.note}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900">Starter modules</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use this section as the future launchpad for patient, doctor, pharmacy, and emergency workflows.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {['Patients', 'Doctors', 'Pharmacy', 'Emergency'].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">{item}</p>
                  <p className="mt-1 text-sm text-slate-500">Placeholder for future module data</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
            <div className="mt-4 space-y-3">
              <Button to={ROUTES.doctors} variant="secondary" fullWidth>
                Explore doctors
              </Button>
              <Button to={ROUTES.pharmacy} variant="secondary" fullWidth>
                Open pharmacy
              </Button>
              <Button to={ROUTES.emergency} variant="secondary" fullWidth>
                Check emergency tools
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

export default DashboardPage;
