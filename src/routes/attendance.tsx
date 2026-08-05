import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, CalendarX2, CircleSlash, Percent } from "lucide-react";

import { SectionCard } from "@/components/common/SectionCard";
import { SectionHeading } from "@/components/common/SectionHeading";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { ListSkeleton } from "@/components/feedback/skeletons";
import { AppShell } from "@/components/layout/AppShell";
import { LABELS } from "@/constants/labels";
import { useAttendanceSummary } from "@/hooks/useAttendance";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { cn } from "@/lib/utils";
import { ATTENDANCE_STATUS_LABEL, type AttendanceStatus } from "@/models";

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance | LN Parent Portal" },
      {
        name: "description",
        content:
          "Track your child's monthly attendance percentage, working days, present and absent days on a clear day-by-day calendar.",
      },
      { property: "og:title", content: "Attendance — LN Parent Portal" },
      {
        property: "og:description",
        content: "Daily and monthly attendance for LN International School parents.",
      },
    ],
  }),
  component: AttendanceRoute,
});

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;

/** Status badge palette shared by the calendar tiles and the history list. */
const BADGE_STYLES: Record<AttendanceStatus, string> = {
  present: "bg-emerald-50 text-emerald-700 border-emerald-200",
  absent: "bg-rose-50 text-rose-700 border-rose-200",
  late: "bg-amber-50 text-amber-700 border-amber-200",
  half_day: "bg-sky-50 text-sky-700 border-sky-200",
  holiday: "bg-slate-100 text-slate-500 border-slate-200",
  unmarked: "bg-transparent text-slate-400 border-transparent",
};

const DOT_STYLES: Record<AttendanceStatus, string> = {
  present: "bg-emerald-500",
  absent: "bg-rose-500",
  late: "bg-amber-500",
  half_day: "bg-sky-500",
  holiday: "bg-slate-300",
  unmarked: "bg-transparent",
};

/** `YYYY-MM-DD` -> "02 Aug 2026" without going through a timezone-shifted Date. */
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const formatDayKey = (key: string): string => {
  const [year, month, day] = key.split("-");
  const monthName = MONTH_NAMES[Number(month) - 1] ?? month;
  return `${day} ${monthName} ${year}`;
};

function StatCard({
  icon: Icon,
  label,
  value,
  delay = 0,
}: {
  icon: typeof Percent;
  label: string;
  value: string;
  delay?: number;
}) {
  return (
    <SectionCard delay={delay} className="px-4 py-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-3.5" />
        <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 font-display text-2xl font-semibold text-foreground">{value}</p>
    </SectionCard>
  );
}

function StatusPill({ status }: { status: AttendanceStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none",
        BADGE_STYLES[status],
      )}
    >
      {ATTENDANCE_STATUS_LABEL[status]}
    </span>
  );
}

function AttendanceRoute() {
  const { student, isError: profileError, refetch } = useStudentProfile();
  const summaryQuery = useAttendanceSummary(
    student?.id ?? null,
    undefined,
    student?.admissionNumber ?? null,
  );
  const summary = summaryQuery.data;

  const today = new Date();
  const year = today.getFullYear();
  const monthIndex = today.getMonth();
  const monthPrefix = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingBlanks = new Date(year, monthIndex, 1).getDay();
  const monthLabel = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(
    today,
  );

  const dayKey = (dayNumber: number) => `${monthPrefix}-${String(dayNumber).padStart(2, "0")}`;

  const statusByDay = new Map<string, AttendanceStatus>();
  (summary?.days ?? []).forEach((day) => statusByDay.set(day.date, day.status));

  const statusFor = (dayNumber: number): AttendanceStatus => {
    const marked = statusByDay.get(dayKey(dayNumber));
    if (marked) return marked;
    const weekday = new Date(year, monthIndex, dayNumber).getDay();
    if (weekday === 0 || weekday === 6) return "holiday";
    return "unmarked";
  };

  const flagged = (summary?.days ?? []).filter(
    (day) => day.status === "absent" || day.status === "late" || day.status === "half_day",
  );

  return (
    <AppShell title={LABELS.attendance.title} showBack>
      {profileError || summaryQuery.isError ? (
        <div className="surface-card">
          <ErrorState onRetry={refetch} />
        </div>
      ) : summaryQuery.isPending || !summary ? (
        <ListSkeleton count={4} />
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={Percent}
              label={LABELS.attendance.overall}
              value={summary.percentage === null ? "—" : `${summary.percentage}%`}
            />
            <StatCard
              icon={CalendarCheck}
              label={LABELS.attendance.workingDays}
              value={String(summary.workingDays)}
              delay={0.03}
            />
            <StatCard
              icon={CalendarCheck}
              label={LABELS.attendance.daysPresent}
              value={String(summary.presentDays + summary.lateDays)}
              delay={0.06}
            />
            <StatCard
              icon={CalendarX2}
              label={LABELS.attendance.daysAbsent}
              value={String(summary.absentDays)}
              delay={0.09}
            />
          </div>

          <section>
            <SectionHeading title={LABELS.attendance.calendar} />
            <SectionCard delay={0.12}>
              <p className="text-sm font-semibold text-foreground">{monthLabel}</p>
              <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
                {WEEKDAYS.map((day, index) => (
                  <span
                    key={`${day}-${index}`}
                    className="text-[10px] font-semibold uppercase text-muted-foreground"
                  >
                    {day}
                  </span>
                ))}
                {Array.from({ length: leadingBlanks }).map((_, index) => (
                  <span key={`blank-${index}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const dayNumber = index + 1;
                  const status = statusFor(dayNumber);
                  const isToday = dayNumber === today.getDate();
                  return (
                    <div
                      key={dayNumber}
                      title={ATTENDANCE_STATUS_LABEL[status]}
                      className={cn(
                        "flex aspect-square flex-col items-center justify-center rounded-xl border text-xs font-semibold",
                        BADGE_STYLES[status],
                        isToday ? "ring-2 ring-primary/50" : "",
                      )}
                    >
                      {dayNumber}
                      <span className={cn("mt-0.5 size-1.5 rounded-full", DOT_STYLES[status])} />
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                {(["present", "absent", "late", "half_day", "holiday"] as const).map((status) => (
                  <span key={status} className="flex items-center gap-1.5">
                    <span className={cn("size-2 rounded-full", DOT_STYLES[status])} />
                    {ATTENDANCE_STATUS_LABEL[status]}
                  </span>
                ))}
              </div>
            </SectionCard>
          </section>

          <section>
            <SectionHeading title={LABELS.attendance.history} />
            {!summary.isAvailable ? (
              <div className="surface-card">
                <EmptyState
                  icon={CircleSlash}
                  title={LABELS.attendance.emptyTitle}
                  body={LABELS.attendance.emptyBody}
                />
              </div>
            ) : flagged.length === 0 ? (
              <SectionCard delay={0.15}>
                <p className="text-xs text-muted-foreground">{LABELS.attendance.allPresent}</p>
              </SectionCard>
            ) : (
              <SectionCard delay={0.15}>
                <ul className="divide-y divide-border">
                  {flagged.map((day) => (
                    <li key={day.date} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {formatDayKey(day.date)}
                        </p>
                        {day.remark ? (
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {day.remark}
                          </p>
                        ) : null}
                      </div>
                      <StatusPill status={day.status} />
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}
          </section>
        </div>
      )}
    </AppShell>
  );
}
