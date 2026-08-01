import { LifeBuoy, Plus } from "lucide-react";

import { IconTile } from "@/components/common/IconTile";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { LABELS } from "@/constants/labels";

export function HelpDeskHero({
  activeCount,
  onNewRequest,
}: {
  activeCount: number;
  onNewRequest: () => void;
}) {
  return (
    <SectionCard className="bg-secondary text-secondary-foreground">
      <div className="flex items-start gap-4">
        <IconTile icon={LifeBuoy} tone="primary" size="lg" />
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-semibold">{LABELS.helpDesk.intro}</h1>
          <p className="mt-1 text-xs leading-relaxed text-secondary-foreground/75">
            {LABELS.helpDesk.introBody}
          </p>
          <p className="mt-3 text-xs font-semibold text-primary">
            {activeCount > 0
              ? `${activeCount} Active ${activeCount === 1 ? "Request" : "Requests"}`
              : "No active requests"}
          </p>
        </div>
      </div>
      <Button
        onClick={onNewRequest}
        className="mt-4 h-11 w-full rounded-2xl bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="size-4" />
        {LABELS.helpDesk.newRequest}
      </Button>
    </SectionCard>
  );
}
