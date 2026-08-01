import { Link } from "@tanstack/react-router";
import { CalendarCheck, ChevronRight } from "lucide-react";

import { IconTile } from "@/components/common/IconTile";
import { StatusBadge } from "@/components/common/StatusBadge";
import { SectionCard } from "@/components/common/SectionCard";
import { LABELS } from "@/constants/labels";
import { ROUTES } from "@/constants/routes";

/** Attendance is intentionally a placeholder until the backend exposes it. */
export function AttendancePreviewCard({ delay = 0 }: { delay?: number | undefined }) {
  return (
    <SectionCard delay={delay} padded={false}>
      <Link to={ROUTES.attendance} className="flex items-center gap-4 p-5">
        <IconTile icon={CalendarCheck} tone="secondary" size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground">
              {LABELS.home.attendanceTitle}
            </p>
            <StatusBadge label="Coming Soon" tone="primary" />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Daily and monthly attendance will appear here soon.
          </p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </Link>
    </SectionCard>
  );
}
