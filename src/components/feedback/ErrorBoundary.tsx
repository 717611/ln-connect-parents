import { Component, type ErrorInfo, type ReactNode } from "react";

import { ErrorState } from "@/components/feedback/ErrorState";

interface Props {
  children: ReactNode;
  fallback?: ReactNode | undefined;
}

interface State {
  error: Error | null;
}

/** Catches render errors so parents never see the default React crash screen. */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  private handleReset = (): void => {
    this.setState({ error: null });
  };

  override render(): ReactNode {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <ErrorState onRetry={this.handleReset} />
          </div>
        )
      );
    }
    return this.props.children;
  }
}
