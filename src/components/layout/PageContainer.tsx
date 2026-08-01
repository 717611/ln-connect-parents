import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Consistent page gutters and safe-area padding above the bottom navigation. */
export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-lg px-4 pb-28 pt-4", className)}>{children}</div>
  );
}
