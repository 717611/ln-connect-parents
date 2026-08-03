import { createFileRoute } from "@tanstack/react-router";
import { SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ComplaintStatusBadge } from "@/components/common/DomainBadges";
import { SectionCard } from "@/components/common/SectionCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ComplaintMessageBubble } from "@/components/complaints/ComplaintMessageBubble";
import { ErrorState } from "@/components/feedback/ErrorState";
import { ComplaintThreadSkeleton } from "@/components/feedback/skeletons";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LABELS } from "@/constants/labels";
import { useComplaintThread, useSendComplaintMessage } from "@/hooks/useComplaints";

import { useStudentProfile } from "@/hooks/useStudentProfile";
import { formatDate } from "@/lib/format";
import { COMPLAINT_CATEGORY_LABEL } from "@/models";

export const Route = createFileRoute("/complaints/$complaintId")({
  head: () => ({
    meta: [
      { title: "Complaint Thread | LN Parent Portal" },
      {
        name: "description",
        content:
          "Follow the conversation on your complaint with the LN International School office and reply in the thread.",
      },
      { property: "og:title", content: "Complaint Thread — LN Parent Portal" },
      {
        property: "og:description",
        content: "Private complaint conversation between parent and school.",
      },
    ],
  }),
  component: ComplaintDetailRoute,
});

function ComplaintDetailRoute() {
  const { complaintId } = Route.useParams();
  const { parent, student } = useStudentProfile();
  const [draft, setDraft] = useState("");

  const { complaint, messages, isPending } = useComplaintThread(complaintId);
  const sendMessage = useSendComplaintMessage(
    complaintId,
    student?.id ?? null,
    parent?.fullName ?? student?.parentName ?? "Parent",
  );


  const onSend = () => {
    const body = draft.trim();
    if (!body) return;
    sendMessage.mutate(body, {
      onSuccess: () => setDraft(""),
      onError: () => toast.error("Message could not be sent. Please try again."),
    });
  };

  return (
    <AppShell title={LABELS.helpDesk.threadTitle} showBack>
      {isPending ? (
        <ComplaintThreadSkeleton />
      ) : !complaint ? (
        <div className="surface-card">
          <ErrorState
            title="Complaint not found"
            body="This complaint may have been closed or removed."
          />
        </div>
      ) : (
        <div className="space-y-4">
          <SectionCard>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {complaint.ticketNumber}
                </p>
                <h1 className="mt-0.5 text-base font-semibold text-foreground">
                  {complaint.subject}
                </h1>
              </div>
              <ComplaintStatusBadge status={complaint.status} />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {complaint.description}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <StatusBadge label={COMPLAINT_CATEGORY_LABEL[complaint.category]} tone="neutral" />
              <span className="text-[11px] text-muted-foreground">
                {LABELS.complaints.createdOn} {formatDate(complaint.createdAt)}
              </span>
            </div>
          </SectionCard>

          <div className="space-y-3">
            {messages.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">
                No replies yet. The school will respond in this thread.
              </p>
            ) : (
              messages.map((message) => (
                <ComplaintMessageBubble key={message.id} message={message} />
              ))
            )}
          </div>

          <div className="sticky bottom-24 flex items-center gap-2 rounded-3xl bg-card p-2 shadow-[var(--shadow-raised)]">
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onSend();
                }
              }}
              placeholder={LABELS.complaints.composerPlaceholder}
              className="h-11 flex-1 rounded-2xl border-0 bg-background text-sm"
            />
            <Button
              type="button"
              onClick={onSend}
              disabled={sendMessage.isPending || draft.trim().length === 0}
              aria-label={LABELS.complaints.send}
              className="size-11 shrink-0 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <SendHorizontal className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
