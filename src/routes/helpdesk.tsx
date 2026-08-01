import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy, MessageSquarePlus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { IconTile } from "@/components/common/IconTile";
import { SectionCard } from "@/components/common/SectionCard";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ComplaintForm } from "@/components/complaints/ComplaintForm";
import { ComplaintListItem } from "@/components/complaints/ComplaintListItem";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ListSkeleton } from "@/components/feedback/skeletons";
import { HelpDeskFaqs } from "@/components/helpdesk/HelpDeskFaqs";
import { HelpDeskQuickActions } from "@/components/helpdesk/HelpDeskQuickActions";
import { SchoolContactList } from "@/components/helpdesk/SchoolContactList";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LABELS } from "@/constants/labels";
import { useComplaints, useCreateComplaint } from "@/hooks/useComplaints";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import type { ComplaintCategory } from "@/models";

export const Route = createFileRoute("/helpdesk")({
  head: () => ({
    meta: [
      { title: "Parents Help Desk | LN Parent Portal" },
      {
        name: "description",
        content:
          "Raise a request, reach the right school desk and track every reply privately in the LN International School Parents Help Desk.",
      },
      { property: "og:title", content: "Parents Help Desk — LN Parent Portal" },
      {
        property: "og:description",
        content: "One friendly place for parents to ask, track and resolve school queries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HelpDeskRoute,
});

function HelpDeskRoute() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<ComplaintCategory>("academics");
  const { student } = useStudentProfile();
  const studentId = student?.id ?? null;

  const complaintsQuery = useComplaints(studentId);
  const createComplaint = useCreateComplaint(studentId);
  const requests = complaintsQuery.data ?? [];
  const activeCount = requests.filter(
    (item) => item.status === "open" || item.status === "in_progress",
  ).length;

  const openSheet = (next: ComplaintCategory) => {
    setCategory(next);
    setIsOpen(true);
  };

  return (
    <AppShell title={LABELS.helpDesk.title}>
      <div className="space-y-6">
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
                  ? `${activeCount} active ${activeCount === 1 ? "request" : "requests"}`
                  : "No active requests"}
              </p>
            </div>
          </div>
          <Button
            onClick={() => openSheet("academics")}
            className="mt-4 h-11 w-full rounded-2xl bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" />
            {LABELS.helpDesk.newRequest}
          </Button>
        </SectionCard>

        <section>
          <SectionHeading title={LABELS.helpDesk.quickActions} />
          <HelpDeskQuickActions onSelect={openSheet} />
        </section>

        <section>
          <SectionHeading title={LABELS.helpDesk.myRequests} />
          {complaintsQuery.isPending ? (
            <ListSkeleton count={2} />
          ) : requests.length === 0 ? (
            <div className="surface-card">
              <EmptyState
                icon={MessageSquarePlus}
                title={LABELS.helpDesk.emptyTitle}
                body={LABELS.helpDesk.emptyBody}
                action={
                  <Button
                    variant="secondary"
                    className="rounded-2xl"
                    onClick={() => openSheet("academics")}
                  >
                    {LABELS.helpDesk.newRequest}
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <ComplaintListItem key={request.id} complaint={request} />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeading title={LABELS.helpDesk.contacts} />
          <SchoolContactList />
        </section>

        <section>
          <SectionHeading title={LABELS.helpDesk.faqs} />
          <HelpDeskFaqs />
        </section>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl">
          <SheetHeader className="px-0 text-left">
            <SheetTitle className="font-display text-lg">{LABELS.helpDesk.newRequest}</SheetTitle>
          </SheetHeader>
          <ComplaintForm
            key={category}
            defaultCategory={category}
            isSubmitting={createComplaint.isPending}
            onSubmit={(input) => {
              createComplaint.mutate(input, {
                onSuccess: () => {
                  setIsOpen(false);
                  toast.success("Request sent. The school will respond shortly.");
                },
                onError: () => toast.error("Could not send the request. Please try again."),
              });
            }}
          />
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
