import { IconTile } from "@/components/common/IconTile";
import { QUICK_LINK_DOCS, type HelpDoc } from "@/constants/policies";

export function QuickLinks({ onOpen }: { onOpen: (doc: HelpDoc) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {QUICK_LINK_DOCS.map((doc) => (
        <button
          key={doc.id}
          type="button"
          onClick={() => onOpen(doc)}
          className="surface-card flex items-center gap-2.5 p-3 text-left transition-transform active:scale-[0.98]"
        >
          <IconTile icon={doc.icon} tone={doc.tone} />
          <span className="min-w-0 text-xs font-semibold leading-snug text-foreground">
            {doc.title}
          </span>
        </button>
      ))}
    </div>
  );
}
