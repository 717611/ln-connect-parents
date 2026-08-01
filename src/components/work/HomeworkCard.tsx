import { Clock, NotebookPen, Paperclip } from "lucide-react";

import { HomeworkStatusBadge } from "@/components/common/DomainBadges";
import { IconTile } from "@/components/common/IconTile";
import { formatDayMonth, formatTime } from "@/lib/format";
import type { Homework } from "@/models";

export function HomeworkCard({ homework }: { homework: Homework }) {
  return (
    <article className="surface-card p-4">
      <div className="flex items-start gap-3">
        <IconTile icon={NotebookPen} tone="primary" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
                {homework.subjectName}
              </p>
              <h3 className="mt-0.5 truncate text-sm font-semibold text-foreground">
                {homework.title}
              </h3>
            </div>
            <HomeworkStatusBadge status={homework.status} />
          </div>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {homework.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-semibold text-foreground">
              <Clock className="size-3.5" />
              Due {formatDayMonth(homework.dueAt)}, {formatTime(homework.dueAt)}
            </span>
            <span>
              {"Assigned by "}
              {homework.teacherName}
            </span>
            {homework.attachmentUrls.length > 0 ? (
              <span className="inline-flex items-center gap-1">
                <Paperclip className="size-3.5" />
                {homework.attachmentUrls.length}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
