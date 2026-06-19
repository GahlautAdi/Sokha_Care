import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { PageShell } from '@/components/common/PageShell';

function SettingsPage() {
  return (
    <PageShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Preferences"
          title="Settings"
          description="A place for theme, language, notification, and account preferences later on."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900">Theme</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The base design uses a healthcare-friendly light theme with blue accents and soft surfaces.
            </p>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900">Language</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The app keeps language concerns out of the main route structure so multilingual support can be added cleanly later.
            </p>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

export default SettingsPage;
