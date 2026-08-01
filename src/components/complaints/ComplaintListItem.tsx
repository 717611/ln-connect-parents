import { Link } from "@tanstack/react-router";
import { ChevronRight, MessageSquare } from "lucide-react";

import { ComplaintStatusBadge } from "@/components/common/DomainBadges";
import { IconTile } from "@/components/common/IconTile";
import { LABELS } from "@/constants/labels";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/format";
import { COMPLAINT_CATEGORY_LABEL, type Complaint } from "@/models";

export function ComplaintListItem({ complaint }: { complaint: Complaint }) {
  return (
    <Link
      to={ROUTES.complaintDetail}
      params={{ complaintId: complaint.id }}
      className="surface-card flex items-start gap-3 p-4 transition-transform active:scale-[0.99]"
    >
      <IconTile icon={MessageSquare} tone="accent" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {complaint.ticketNumber} · {COMPLAINT_CATEGORY_LABEL[complaint.category]}
            </p>
            <h3 className="mt-0.5 truncate text-sm font-semibold text-foreground">
              {complaint.subject}
            </h3>
          </div>
          <ComplaintStatusBadge status={complaint.status} />
        </div>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {complaint.description}
        </p>
        <p className="mt-3 text-[11px] text-muted-foreground">
          {LABELS.complaints.createdOn} {formatDate(complaint.createdAt)} · {complaint.messageCount}{" "}
          {complaint.messageCount === 1 ? "message" : "messages"}
        </p>
      </div>
      <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}
