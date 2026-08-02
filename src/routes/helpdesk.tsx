import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { SectionHeading } from "@/components/common/SectionHeading";
import { ComplaintForm } from "@/components/complaints/ComplaintForm";
import { EmergencyContact } from "@/components/helpdesk/EmergencyContact";
import { FAQAccordion } from "@/components/helpdesk/FAQAccordion";
import { HelpDeskHero } from "@/components/helpdesk/HelpDeskHero";
import { PolicyModal } from "@/components/helpdesk/PolicyModal";
import { PolicyVault } from "@/components/helpdesk/PolicyVault";
import { QuickLinks } from "@/components/helpdesk/QuickLinks";
import { RequestList } from "@/components/helpdesk/RequestList";
import { SchoolContacts } from "@/components/helpdesk/SchoolContacts";
import { SupportCategoryGrid } from "@/components/helpdesk/SupportCategoryGrid";
import { AppShell } from "@/components/layout/AppShell";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LABELS } from "@/constants/labels";
import type { HelpDoc } from "@/constants/policies";
import { useComplaints, useCreateComplaint } from "@/hooks/useComplaints";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { formatClassSection, type ComplaintCategory } from "@/models";

export const Route = createFileRoute("/helpdesk")({
  head: () => ({
    meta: [
      { title: "Parent Support Centre | LN Parent Portal" },
      {
        name: "description",
        content:
          "Raise a request, reach the right school desk, read school policies and track every reply privately in the LN International School Parent Support Centre.",
      },
      { property: "og:title", content: "Parent Support Centre — LN Parent Portal" },
      {
        property: "og:description",
        content:
          "One friendly place for parents to ask, track and resolve school queries, with policies and contacts built in.",
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
  const [activeDoc, setActiveDoc] = useState<HelpDoc | null>(null);
  const { student } = useStudentProfile();
  const studentId = student?.id ?? null;

  const complaintsQuery = useComplaints(studentId);
  const createComplaint = useCreateComplaint(studentId, {
    studentName: student?.fullName || "Student",
    admissionNumber: student?.admissionNumber || "",
    className: formatClassSection(student),
  });
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
        <HelpDeskHero activeCount={activeCount} onNewRequest={() => openSheet("academics")} />

        <section>
          <SectionHeading title={LABELS.helpDesk.myRequests} />
          <RequestList
            requests={requests}
            isPending={complaintsQuery.isPending}
            onNewRequest={() => openSheet("academics")}
          />
        </section>

        <section>
          <SectionHeading title={LABELS.helpDesk.categories} />
          <SupportCategoryGrid onSelect={openSheet} />
        </section>

        <section>
          <SectionHeading title={LABELS.helpDesk.contacts} />
          <SchoolContacts />
        </section>

        <section>
          <SectionHeading title={LABELS.helpDesk.quickLinks} />
          <QuickLinks onOpen={setActiveDoc} />
        </section>

        <section>
          <SectionHeading title={LABELS.helpDesk.policyVault} />
          <PolicyVault onOpen={setActiveDoc} />
        </section>

        <section>
          <SectionHeading title={LABELS.helpDesk.faqs} />
          <FAQAccordion />
        </section>

        <section>
          <SectionHeading title={LABELS.helpDesk.emergency} />
          <EmergencyContact />
        </section>
      </div>

      <PolicyModal doc={activeDoc} onClose={() => setActiveDoc(null)} />

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
