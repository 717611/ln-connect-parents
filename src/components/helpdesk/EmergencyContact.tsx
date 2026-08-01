import { Phone, ShieldAlert } from "lucide-react";

import { IconTile } from "@/components/common/IconTile";
import { EMERGENCY_CONTACT } from "@/constants/helpDesk";

export function EmergencyContact() {
  return (
    <div className="surface-card border border-destructive/25 bg-destructive/5 p-5">
      <div className="flex items-start gap-3">
        <IconTile icon={ShieldAlert} tone="danger" size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground">{EMERGENCY_CONTACT.name}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {EMERGENCY_CONTACT.description}
          </p>
          <p className="mt-2 text-[11px] font-semibold text-muted-foreground">
            {EMERGENCY_CONTACT.hours}
          </p>
        </div>
      </div>
      <a
        href={`tel:${EMERGENCY_CONTACT.phone.replace(/\s/g, "")}`}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive px-4 py-2.5 text-xs font-semibold text-destructive-foreground transition-transform active:scale-[0.98]"
      >
        <Phone className="size-3.5" />
        Call {EMERGENCY_CONTACT.phone}
      </a>
    </div>
  );
}
