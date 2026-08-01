import { BookOpen, Paperclip } from "lucide-react";

import { IconTile } from "@/components/common/IconTile";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDayMonth } from "@/lib/format";
import { CLASSWORK_KIND_LABEL, type Classwork } from "@/models";

export function ClassworkCard({ classwork }: { classwork: Classwork }) {
  return (
    <article className="surface-card p-4">
      <div className="flex items-start gap-3">
        <IconTile icon={BookOpen} tone="accent" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
                {classwork.subjectName}
              </p>
              <h3 className="mt-0.5 truncate text-sm font-semibold text-foreground">
                {classwork.title}
              </h3>
            </div>
            <StatusBadge label={CLASSWORK_KIND_LABEL[classwork.kind]} tone="accent" />
          </div>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {classwork.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground">
              {formatDayMonth(classwork.conductedAt)}
            </span>
            <span>
              {"Taught by "}
              {classwork.teacherName}
            </span>
            {classwork.attachmentUrls.length > 0 ? (
              <span className="inline-flex items-center gap-1">
                <Paperclip className="size-3.5" />
                {classwork.attachmentUrls.length}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
