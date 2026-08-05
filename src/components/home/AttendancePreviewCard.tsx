import { Link } from "@tanstack/react-router";
import { CalendarCheck, ChevronRight } from "lucide-react";

import { IconTile } from "@/components/common/IconTile";
import { SectionCard } from "@/components/common/SectionCard";
import { LABELS } from "@/constants/labels";
import { ROUTES } from "@/constants/routes";
import { useAttendanceSummary } from "@/hooks/useAttendance";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { cn } from "@/lib/utils";
import { ATTENDANCE_STATUS_LABEL, type AttendanceStatus } from "@/models";

const BADGE_STYLES: Record<AttendanceStatus, string> = {
  present: "bg-emerald-50 text-emerald-700 border-emerald-200",
  absent: "bg-rose-50 text-rose-700 border-rose-200",
  late: "bg-amber-50 text-amber-700 border-amber-200",
  half_day: "bg-sky-50 text-sky-700 border-sky-200",
  holiday: "bg-slate-100 text-slate-500 border-slate-200",
  unmarked: "bg-slate-100 text-slate-500 border-slate-200",
};

const todayKey = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;
};

/** Live snapshot of today's attendance, kept in sync with the School Portal. */
export function AttendancePreviewCard({ delay = 0 }: { delay?: number | undefined }) {
  const { student } = useStudentProfile();
  const summaryQuery = useAttendanceSummary(
    student?.id ?? null,
    undefined,
    student?.admissionNumber ?? null,
  );
  const summary = summaryQuery.data;
  const today = summary?.days.find((day) => day.date === todayKey()) ?? null;
  const status: AttendanceStatus = today?.status ?? "unmarked";

  const subtitle = summaryQuery.isPending
    ? "Loading today's attendance…"
    : summary && summary.percentage !== null
      ? `${summary.percentage}% this month • ${summary.presentDays} present of ${summary.workingDays} days`
      : "No attendance marked for this month yet.";

  return (
    <SectionCard delay={delay} padded={false}>
      <Link to={ROUTES.attendance} className="flex items-center gap-4 p-5">
        <IconTile icon={CalendarCheck} tone="secondary" size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground">
              {LABELS.home.attendanceTitle}
            </p>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none",
                BADGE_STYLES[status],
              )}
            >
              {ATTENDANCE_STATUS_LABEL[status]}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </Link>
    </SectionCard>
  );
}
