import { Check } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { HelpDoc } from "@/constants/policies";

/** Premium scrollable modal used by both the Policy Vault and the Quick Links. */
export function PolicyModal({
  doc,
  onClose,
}: {
  doc: HelpDoc | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={Boolean(doc)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] w-[calc(100vw-2rem)] max-w-md overflow-y-auto rounded-3xl p-6">
        {doc ? (
          <>
            <DialogHeader className="text-left">
              <DialogTitle className="font-display text-lg leading-snug text-foreground">
                {doc.title}
              </DialogTitle>
              <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
                {doc.summary}
              </DialogDescription>
            </DialogHeader>

            <ul className="mt-2 space-y-3">
              {doc.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2.5">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                    <Check className="size-3 text-primary-foreground" />
                  </span>
                  <p className="text-xs leading-relaxed text-foreground">{bullet}</p>
                </li>
              ))}
            </ul>

            {doc.lastUpdated ? (
              <p className="mt-4 text-[11px] font-medium text-muted-foreground">
                Last updated · {doc.lastUpdated}
              </p>
            ) : null}

            <Button
              onClick={onClose}
              variant="secondary"
              className="mt-4 h-11 w-full rounded-2xl text-xs font-semibold"
            >
              Close
            </Button>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
