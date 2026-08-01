import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type IconTone = "primary" | "accent" | "success" | "secondary" | "warning" | "danger";

const TONE_CLASS: Record<IconTone, string> = {
  primary: "bg-primary-soft text-primary-foreground",
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  secondary: "bg-secondary-soft text-secondary",
  warning: "bg-warning-soft text-warning-foreground",
  danger: "bg-destructive-soft text-destructive",
};

interface IconTileProps {
  icon: LucideIcon;
  tone?: IconTone;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASS = {
  sm: "size-9 rounded-xl",
  md: "size-11 rounded-2xl",
  lg: "size-14 rounded-3xl",
} as const;

const ICON_SIZE = { sm: "size-4", md: "size-5", lg: "size-6" } as const;

export function IconTile({ icon: Icon, tone = "primary", className, size = "md" }: IconTileProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        SIZE_CLASS[size],
        TONE_CLASS[tone],
        className,
      )}
    >
      <Icon className={ICON_SIZE[size]} strokeWidth={2.1} />
    </span>
  );
}
