import { useRouter } from "@tanstack/react-router";
import { Bell, ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

import { LABELS } from "@/constants/labels";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title?: string | undefined;
  showBack?: boolean | undefined;
  showNotifications?: boolean | undefined;
  onNotificationsClick?: (() => void) | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
}

export function AppHeader({
  title,
  showBack = false,
  showNotifications = false,
  onNotificationsClick,
  children,
  className,
}: AppHeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
        {showBack ? (
          <button
            type="button"
            onClick={() => router.history.back()}
            aria-label="Go back"
            className="inline-flex size-9 items-center justify-center rounded-full bg-card text-foreground shadow-[var(--shadow-card)] transition-transform active:scale-95"
          >
            <ChevronLeft className="size-5" />
          </button>
        ) : null}

        <div className="min-w-0 flex-1">
          {children ?? (
            <h1 className="truncate font-display text-lg font-semibold text-foreground">{title}</h1>
          )}
        </div>

        {showNotifications ? (
          <button
            type="button"
            onClick={onNotificationsClick}
            aria-label={LABELS.home.notifications}
            className="relative inline-flex size-10 items-center justify-center rounded-full bg-card text-foreground shadow-[var(--shadow-card)] transition-transform active:scale-95"
          >
            <Bell className="size-5" strokeWidth={2} />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary ring-2 ring-card" />
          </button>
        ) : null}
      </div>
    </header>
  );
}
