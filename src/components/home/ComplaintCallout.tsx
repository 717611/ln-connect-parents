import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { SectionCard } from "@/components/common/SectionCard";
import { IconTile } from "@/components/common/IconTile";
import { COMPLAINT_FEATURE_NAV } from "@/constants/navigation";
import { LABELS } from "@/constants/labels";
import { ROUTES } from "@/constants/routes";

export function ComplaintCallout({
  activeCount,
  delay = 0,
}: {
  activeCount: number;
  delay?: number | undefined;
}) {
  return (
    <SectionCard delay={delay} className="bg-secondary text-secondary-foreground">
      <div className="flex items-start gap-4">
        <IconTile icon={COMPLAINT_FEATURE_NAV.icon} tone="primary" size="lg" />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">{LABELS.home.complaintCardTitle}</h2>
          <p className="mt-1 text-xs leading-relaxed text-secondary-foreground/75">
            {LABELS.home.complaintCardBody}
          </p>
          <p className="mt-3 text-xs font-semibold text-primary">
            {activeCount > 0
              ? `${activeCount} active ${activeCount === 1 ? "complaint" : "complaints"}`
              : "No active complaints"}
          </p>
        </div>
      </div>
      <Link
        to={ROUTES.complaints}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
      >
        Open Complaint Portal
        <ArrowRight className="size-3.5" />
      </Link>
    </SectionCard>
  );
}
