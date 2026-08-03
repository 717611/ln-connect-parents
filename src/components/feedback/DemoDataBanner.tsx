import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

import { isFirebaseConfigured, missingFirebaseEnvKeys } from "@/config/firebase";

/**
 * Visible only when the deployed build has no Firebase configuration, i.e. the
 * portal is showing local demo data instead of School Portal data. Client-only
 * so build-time-less hosts (Vercel without VITE_* env vars) are obvious.
 */
export function DemoDataBanner() {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      console.warn(
        "[firebase] running on demo data — missing config:",
        missingFirebaseEnvKeys().join(", "),
      );
      setShowing(true);
    }
  }, []);

  if (!showing) return null;

  return (
    <div className="flex items-start gap-2 border-b border-amber-300/60 bg-amber-50 px-4 py-2 text-[11px] leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
      <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
      <span>
        Demo data — this deployment has no school backend configuration, so live tickets, notices and
        attendance are not loading.
      </span>
    </div>
  );
}
