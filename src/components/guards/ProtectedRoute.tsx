import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { ListSkeleton } from "@/components/feedback/skeletons";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

/**
 * Gate for authenticated screens. Backed by a demo session today; switching to
 * Firebase Authentication only changes AuthRepository — no UI change needed.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "unauthenticated") {
      void navigate({ to: ROUTES.login, replace: true });
    }
  }, [status, navigate]);

  if (status !== "authenticated") {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-8">
        <ListSkeleton count={4} />
      </div>
    );
  }

  return <>{children}</>;
}
