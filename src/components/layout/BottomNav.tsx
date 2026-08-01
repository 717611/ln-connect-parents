import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";

import { BOTTOM_NAV_ITEMS } from "@/constants/navigation";
import { MOTION } from "@/constants/theme";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/95 backdrop-blur-md"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <li key={item.id} className="flex-1">
              <Link
                to={item.to}
                aria-current={isActive ? "page" : undefined}
                className="relative flex flex-col items-center gap-1 rounded-2xl px-2 py-1.5 transition-colors"
              >
                {isActive ? (
                  <motion.span
                    layoutId="bottom-nav-active"
                    transition={{ duration: MOTION.fast, ease: MOTION.ease }}
                    className="absolute inset-0 rounded-2xl bg-primary-soft"
                  />
                ) : null}
                <Icon
                  className={cn(
                    "relative size-5 transition-colors",
                    isActive ? "text-primary-foreground" : "text-muted-foreground",
                  )}
                  strokeWidth={isActive ? 2.4 : 1.9}
                />
                <span
                  className={cn(
                    "relative text-[11px] font-semibold",
                    isActive ? "text-primary-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
