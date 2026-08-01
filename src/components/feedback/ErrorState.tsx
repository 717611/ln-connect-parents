import { TriangleAlert } from "lucide-react";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Button } from "@/components/ui/button";
import { LABELS } from "@/constants/labels";

interface ErrorStateProps {
  title?: string;
  body?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ title, body, onRetry, className }: ErrorStateProps) {
  return (
    <EmptyState
      icon={TriangleAlert}
      title={title ?? LABELS.states.errorTitle}
      body={body ?? LABELS.states.errorBody}
      className={className}
      action={
        onRetry ? (
          <Button onClick={onRetry} variant="secondary">
            {LABELS.states.retry}
          </Button>
        ) : undefined
      }
    />
  );
}
