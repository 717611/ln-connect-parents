import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { LABELS } from "@/constants/labels";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  actionTo?: string | undefined;
  actionSearch?: Record<string, string> | undefined;
  actionLabel?: string | undefined;
  className?: string | undefined;
}

export function SectionHeading({
  title,
  actionTo,
  actionSearch,
  actionLabel = LABELS.home.seeAll,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-3", className)}>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {actionTo ? (
        <Link
          to={actionTo}
          {...(actionSearch ? { search: actionSearch } : {})}
          className="inline-flex items-center gap-0.5 text-xs font-semibold text-accent transition-opacity hover:opacity-75"
        >
          {actionLabel}
          <ChevronRight className="size-3.5" />
        </Link>
      ) : null}
    </div>
  );
}
