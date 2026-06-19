import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/common/PageHeader';
import { PageShell } from '@/components/common/PageShell';
import { ROUTES } from '@/constants/routes';

const featureCards = [
  { title: 'Patient care', description: 'Smooth appointment, profile, and follow-up journeys.' },
  { title: 'Clinical workflow', description: 'Doctor-ready views that stay fast and focused.' },
  { title: 'Operational control', description: 'Admin, pharmacy, and emergency services in one place.' },
  { title: 'AI assistance', description: 'A foundation ready for guided care and smart triage.' },
];

function HomePage() {
  return (
    <PageShell className="py-10 sm:py-14 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <PageHeader
            eyebrow="Sokha Care Platform"
            title="A modern healthcare frontend foundation built for scale."
            description="This starter architecture gives you a clean, modular, responsive base for patients, doctors, pharmacy, emergency services, admin, and AI support."
            actions={
              <>
                <Button to={ROUTES.login}>Get started</Button>
                <Button to={ROUTES.register} variant="secondary">
                  Create account
                </Button>
              </>
            }
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {featureCards.map((card) => (
              <Card key={card.title} className="p-5">
                <h2 className="text-base font-semibold text-slate-900">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
              </Card>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
            <p className="text-sm font-semibold text-brand-700">Healthcare cockpit</p>
            <p className="mt-1 text-sm text-slate-600">A unified workspace for the entire ecosystem.</p>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            {['Patients', 'Doctors', 'Pharmacy', 'Emergency', 'Admin', 'AI Assistant'].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-medium text-slate-900">{item}</p>
                <p className="mt-1 text-xs text-slate-500">Foundation ready</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

export default HomePage;
