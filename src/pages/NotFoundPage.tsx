import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ROUTES } from '@/constants/routes';

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <EmptyState
        title="Page not found"
        description="The route you tried to open does not exist in this frontend foundation."
        action={<Button to={ROUTES.home}>Go home</Button>}
      />
    </div>
  );
}

export default NotFoundPage;
