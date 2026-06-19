import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { PageShell } from '@/components/common/PageShell';
import { ROUTES } from '@/constants/routes';

const prompts = ['Summarize care plan', 'Check follow-up', 'Suggest next steps', 'Translate instructions'];

function AIAssistantPage() {
  return (
    <PageShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="AI support"
          title="AI Assistant"
          description="A future integration point for guided assistance, triage support, and care navigation."
          actions={<Button to={ROUTES.dashboard} variant="secondary">Return to dashboard</Button>}
        />

        <Card className="p-6">
          <EmptyState
            title="Assistant interface ready"
            description="This screen can later host chat threads, suggestion chips, and context-aware support."
          />
          <div className="mt-6 flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <span key={prompt} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                {prompt}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

export default AIAssistantPage;
