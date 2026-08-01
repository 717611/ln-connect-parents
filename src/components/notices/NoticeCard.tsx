import { Megaphone } from "lucide-react";

import { PriorityBadge } from "@/components/common/DomainBadges";
import { IconTile } from "@/components/common/IconTile";
import { StatusBadge } from "@/components/common/StatusBadge";
import { relativeTime } from "@/lib/format";
import { NOTICE_CATEGORY_LABEL, type Notice } from "@/models";
import { cn } from "@/lib/utils";

export function NoticeCard({ notice, compact = false }: { notice: Notice; compact?: boolean | undefined }) {
  return (
    <article className="surface-card p-4">
      <div className="flex items-start gap-3">
        <IconTile
          icon={Megaphone}
          tone={notice.priority === "high" ? "danger" : notice.scope === "school" ? "primary" : "accent"}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 text-sm font-semibold text-foreground">{notice.title}</h3>
            <PriorityBadge priority={notice.priority} />
          </div>
          <p
            className={cn(
              "mt-2 text-xs leading-relaxed text-muted-foreground",
              compact ? "line-clamp-2" : "",
            )}
          >
            {notice.body}
          </p>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
            <StatusBadge label={NOTICE_CATEGORY_LABEL[notice.category]} tone="neutral" />
            <span>{relativeTime(notice.publishedAt)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
