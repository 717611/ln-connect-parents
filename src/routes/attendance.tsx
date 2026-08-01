import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, CalendarRange, Layers } from "lucide-react";
import { toast } from "sonner";

import { ASSETS } from "@/assets";
import { SectionCard } from "@/components/common/SectionCard";
import { IconTile } from "@/components/common/IconTile";
import { EmptyState } from "@/components/feedback/EmptyState";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { LABELS } from "@/constants/labels";

const UPCOMING = [
  { icon: BarChart3, title: LABELS.attendance.monthlySummary, body: "Present, absent and late days at a glance." },
  { icon: CalendarRange, title: LABELS.attendance.calendar, body: "A day-by-day calendar for every month." },
  { icon: Layers, title: LABELS.attendance.subjectWise, body: "Subject-level attendance percentages." },
] as const;

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance | LN Parent Portal" },
      {
        name: "description",
        content:
          "Attendance tracking is coming soon: monthly summaries, a day-by-day calendar and subject-wise insights.",
      },
      { property: "og:title", content: "Attendance — LN Parent Portal" },
      {
        property: "og:description",
        content: "Daily attendance updates for LN International School parents, coming soon.",
      },
    ],
  }),
  component: AttendanceRoute,
});

function AttendanceRoute() {
  return (
    <AppShell title={LABELS.attendance.title} showBack>
      <div className="space-y-5">
        <SectionCard padded={false}>
          <EmptyState
            illustrationSrc={ASSETS.attendancePlaceholder}
            title={LABELS.attendance.comingSoonTitle}
            body={LABELS.attendance.comingSoonBody}
            action={
              <Button
                variant="secondary"
                className="rounded-2xl"
                onClick={() => toast.success("We will notify you as soon as attendance goes live.")}
              >
                {LABELS.attendance.notifyMe}
              </Button>
            }
          />
        </SectionCard>

        <SectionCard delay={0.04}>
          <h2 className="mb-4 text-sm font-semibold text-foreground">What you will get</h2>
          <ul className="space-y-4">
            {UPCOMING.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <IconTile icon={item.icon} tone="secondary" size="sm" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </AppShell>
  );
}
