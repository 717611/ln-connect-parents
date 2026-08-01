import { ArrowRight } from "lucide-react";

import { IconTile } from "@/components/common/IconTile";
import { POLICY_DOCS, type HelpDoc } from "@/constants/policies";

export function PolicyVault({ onOpen }: { onOpen: (doc: HelpDoc) => void }) {
  return (
    <div className="space-y-3">
      {POLICY_DOCS.map((doc) => (
        <div key={doc.id} className="surface-card p-4">
          <div className="flex items-start gap-3">
            <IconTile icon={doc.icon} tone={doc.tone} />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-foreground">{doc.title}</h3>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{doc.summary}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpen(doc)}
            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-2xl bg-secondary-soft px-3 py-2 text-xs font-semibold text-secondary transition-transform active:scale-[0.98]"
          >
            Read Policy
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
