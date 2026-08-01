import { WifiOff } from "lucide-react";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Button } from "@/components/ui/button";
import { LABELS } from "@/constants/labels";

interface OfflineStateProps {
  onRetry?: (() => void) | undefined;
  className?: string | undefined;
}

/** Reusable offline surface — usable full page or inside any card. */
export function OfflineState({ onRetry, className }: OfflineStateProps) {
  return (
    <EmptyState
      icon={WifiOff}
      title={LABELS.states.offlineTitle}
      body={LABELS.states.offlineBody}
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
