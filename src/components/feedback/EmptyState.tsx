import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon | undefined;
  illustrationSrc?: string | undefined;
  title: string;
  body?: string | undefined;
  action?: ReactNode | undefined;
  className?: string | undefined;
}

export function EmptyState({
  icon: Icon,
  illustrationSrc,
  title,
  body,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-10 text-center", className)}>
      {illustrationSrc ? (
        <img
          src={illustrationSrc}
          alt=""
          loading="lazy"
          className="mb-5 size-32 object-contain sm:size-40"
        />
      ) : Icon ? (
        <span className="mb-5 inline-flex size-16 items-center justify-center rounded-3xl bg-muted text-muted-foreground">
          <Icon className="size-7" />
        </span>
      ) : null}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {body ? <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{body}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
