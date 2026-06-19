import { Component, type ErrorInfo, type ReactNode } from 'react';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App error boundary caught an error', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
          <EmptyState
            title="Something went wrong"
            description="The app hit an unexpected error. You can retry now or refresh the page if the issue persists."
            action={
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button onClick={this.handleRetry}>Try again</Button>
                <Button variant="secondary" onClick={() => globalThis.location.reload()}>
                  Refresh page
                </Button>
              </div>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}
