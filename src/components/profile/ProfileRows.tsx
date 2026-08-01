import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

import { IconTile } from "@/components/common/IconTile";
import type { IconTone } from "@/components/common/IconTile";

export function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

export function ProfileAction({
  icon,
  label,
  tone = "accent",
  onClick,
  danger = false,
}: {
  icon: LucideIcon;
  label: string;
  tone?: IconTone | undefined;
  onClick?: (() => void) | undefined;
  danger?: boolean | undefined;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 py-3 text-left transition-opacity active:opacity-70"
    >
      <IconTile icon={icon} tone={danger ? "danger" : tone} size="sm" />
      <span
        className={
          danger
            ? "flex-1 text-sm font-semibold text-destructive"
            : "flex-1 text-sm font-semibold text-foreground"
        }
      >
        {label}
      </span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </button>
  );
}
