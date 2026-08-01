import { IconTile } from "@/components/common/IconTile";
import { SUPPORT_CATEGORIES } from "@/constants/helpDesk";
import type { ComplaintCategory } from "@/models";

export function SupportCategoryGrid({
  onSelect,
}: {
  onSelect: (category: ComplaintCategory) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {SUPPORT_CATEGORIES.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={() => onSelect(action.category)}
          className="surface-card flex flex-col items-start gap-2.5 p-4 text-left transition-transform active:scale-[0.98]"
        >
          <IconTile icon={action.icon} tone={action.tone} />
          <span className="text-sm font-semibold text-foreground">{action.label}</span>
          <span className="text-[11px] leading-snug text-muted-foreground">
            {action.description}
          </span>
        </button>
      ))}
    </div>
  );
}
