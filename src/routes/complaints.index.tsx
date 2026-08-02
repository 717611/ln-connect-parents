import { createFileRoute } from "@tanstack/react-router";
import { MessageSquarePlus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { SectionCard } from "@/components/common/SectionCard";
import { ComplaintForm } from "@/components/complaints/ComplaintForm";
import { ComplaintListItem } from "@/components/complaints/ComplaintListItem";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ListSkeleton } from "@/components/feedback/skeletons";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LABELS } from "@/constants/labels";
import { useComplaints, useCreateComplaint } from "@/hooks/useComplaints";
import { useStudentProfile } from "@/hooks/useStudentProfile";

export const Route = createFileRoute("/complaints/")({
  head: () => ({
    meta: [
      { title: "Complaint Portal | LN Parent Portal" },
      {
        name: "description",
        content:
          "Raise a concern with LN International School and track every reply privately in one conversation thread.",
      },
      { property: "og:title", content: "Complaint Portal — LN Parent Portal" },
      {
        property: "og:description",
        content: "Private, tracked communication between parents and the school office.",
      },
    ],
  }),
  component: ComplaintsRoute,
});

function ComplaintsRoute() {
  const [isOpen, setIsOpen] = useState(false);
  const { student } = useStudentProfile();
  const studentId = student?.id ?? null;

  const complaintsQuery = useComplaints(studentId);
  const createComplaint = useCreateComplaint(studentId, {
    studentName: student?.fullName || "Student",
    admissionNumber: student?.admissionNumber || "",
    className: formatClassSection(student),
  });
  const complaints = complaintsQuery.data ?? [];

  return (
    <AppShell title={LABELS.complaints.title} showBack>
      <div className="space-y-4">
        <SectionCard className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">{LABELS.complaints.listTitle}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {complaints.length} {complaints.length === 1 ? "complaint" : "complaints"} raised
            </p>
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-2xl bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" />
            New
          </Button>
        </SectionCard>

        {complaintsQuery.isPending ? (
          <ListSkeleton count={3} />
        ) : complaints.length === 0 ? (
          <div className="surface-card">
            <EmptyState
              icon={MessageSquarePlus}
              title={LABELS.complaints.emptyTitle}
              body={LABELS.complaints.emptyBody}
              action={
                <Button variant="secondary" className="rounded-2xl" onClick={() => setIsOpen(true)}>
                  {LABELS.complaints.newComplaint}
                </Button>
              }
            />
          </div>
        ) : (
          <div className="space-y-3">
            {complaints.map((complaint) => (
              <ComplaintListItem key={complaint.id} complaint={complaint} />
            ))}
          </div>
        )}
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl">
          <SheetHeader className="px-0 text-left">
            <SheetTitle className="font-display text-lg">
              {LABELS.complaints.newComplaint}
            </SheetTitle>
          </SheetHeader>
          <ComplaintForm
            isSubmitting={createComplaint.isPending}
            onSubmit={(input) => {
              createComplaint.mutate(input, {
                onSuccess: () => {
                  setIsOpen(false);
                  toast.success("Complaint raised. The school will respond shortly.");
                },
                onError: () => toast.error("Could not raise the complaint. Please try again."),
              });
            }}
          />
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
