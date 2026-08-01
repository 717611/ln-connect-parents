import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

/** Public screens (login). Signed-in parents are sent to Home. */
export function PublicRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "authenticated") {
      void navigate({ to: ROUTES.home, replace: true });
    }
  }, [status, navigate]);

  return <>{children}</>;
}
