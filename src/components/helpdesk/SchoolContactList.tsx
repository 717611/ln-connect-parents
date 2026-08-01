import { Mail, Phone } from "lucide-react";

import { SCHOOL_CONTACTS } from "@/constants/helpDesk";

export function SchoolContactList() {
  return (
    <div className="space-y-3">
      {SCHOOL_CONTACTS.map((contact) => (
        <div key={contact.id} className="surface-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground">{contact.name}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{contact.role}</p>
            </div>
            <p className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-accent">
              {contact.hours.split("·")[0]}
            </p>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">{contact.hours}</p>
          <div className="mt-3 flex gap-2">
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
            >
              <Phone className="size-3.5" />
              Call
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-secondary-soft px-3 py-2 text-xs font-semibold text-secondary transition-transform active:scale-[0.98]"
            >
              <Mail className="size-3.5" />
              Email
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
