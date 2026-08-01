import type { ReactNode } from "react";

import { ErrorState } from "@/components/feedback/ErrorState";
import type { UserRole } from "@/models";
import { useAuth } from "@/hooks/useAuth";

interface RoleGuardProps {
  roles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode | undefined;
}

/** Renders children only for the allowed roles. Ready for future role expansion. */
export function RoleGuard({ roles, children, fallback }: RoleGuardProps) {
  const { hasAnyRole } = useAuth();

  if (!hasAnyRole(roles)) {
    return <>{fallback ?? <ErrorState title="Not available" body="This section is not available for your account." />}</>;
  }

  return <>{children}</>;
}
