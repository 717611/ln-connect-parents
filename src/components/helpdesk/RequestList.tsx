import { Link } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";

import { ComplaintStatusBadge } from "@/components/common/DomainBadges";
import { IconTile } from "@/components/common/IconTile";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ListSkeleton } from "@/components/feedback/skeletons";
import { Button } from "@/components/ui/button";
import { LABELS } from "@/constants/labels";
import { ROUTES } from "@/constants/routes";
import { formatDate, relativeTime } from "@/lib/format";
import { COMPLAINT_CATEGORY_LABEL, type Complaint } from "@/models";

function RequestCard({ request }: { request: Complaint }) {
  // Future ready: replace with request.unreadCount once Firestore tracks read receipts.
  const unreadCount = 0;

  return (
    <article className="surface-card p-4">
      <div className="flex items-start gap-3">
        <IconTile icon={MessageSquare} tone="accent" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {request.ticketNumber} · {COMPLAINT_CATEGORY_LABEL[request.category]}
              </p>
              <h3 className="mt-0.5 truncate text-sm font-semibold text-foreground">
                {request.subject}
              </h3>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {unreadCount > 0 ? (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                  {unreadCount}
                </span>
              ) : null}
              <ComplaintStatusBadge status={request.status} />
            </div>
          </div>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {request.description}
          </p>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Created {formatDate(request.createdAt)} · Latest activity{" "}
            {relativeTime(request.updatedAt)}
          </p>
        </div>
      </div>
      <Button
        asChild
        variant="secondary"
        className="mt-3 h-10 w-full rounded-2xl text-xs font-semibold"
      >
        <Link to={ROUTES.complaintDetail} params={{ complaintId: request.id }}>
          Open Conversation
        </Link>
      </Button>
    </article>
  );
}

export function RequestList({
  requests,
  isPending,
  onNewRequest,
}: {
  requests: readonly Complaint[];
  isPending: boolean;
  onNewRequest: () => void;
}) {
  if (isPending) return <ListSkeleton count={2} />;

  if (requests.length === 0) {
    return (
      <div className="surface-card">
        <EmptyState
          icon={MessageSquare}
          title={LABELS.helpDesk.emptyTitle}
          body={LABELS.helpDesk.emptyBody}
          action={
            <Button variant="secondary" className="rounded-2xl" onClick={onNewRequest}>
              {LABELS.helpDesk.newRequest}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request} />
      ))}
    </div>
  );
}
