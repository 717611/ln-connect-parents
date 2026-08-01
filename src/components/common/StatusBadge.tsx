import { cn } from "@/lib/utils";

export type BadgeTone = "primary" | "accent" | "success" | "warning" | "danger" | "neutral";

const TONE_CLASS: Record<BadgeTone, string> = {
  primary: "bg-primary-soft text-primary-foreground",
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning-foreground",
  danger: "bg-destructive-soft text-destructive",
  neutral: "bg-muted text-muted-foreground",
};

interface StatusBadgeProps {
  label: string;
  tone?: BadgeTone;
  className?: string;
}

export function StatusBadge({ label, tone = "neutral", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none",
        TONE_CLASS[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
