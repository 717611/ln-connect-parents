import type { ReactNode } from "react";

import { DemoDataBanner } from "@/components/feedback/DemoDataBanner";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
import { OfflineState } from "@/components/feedback/OfflineState";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageContainer } from "@/components/layout/PageContainer";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

interface AppShellProps {
  children: ReactNode;
  /** Simple header title. Ignored when `header` is provided. */
  title?: string | undefined;
  /** Custom header content (e.g. the Home greeting block). */
  header?: ReactNode | undefined;
  showBack?: boolean | undefined;
  showNotifications?: boolean | undefined;
  /** Set for full-bleed pages that render their own gutters. */
  bare?: boolean | undefined;
}

/**
 * The single authenticated layout: header + page + bottom navigation.
 * Navigation is never duplicated inside a page component.
 */
export function AppShell({
  children,
  title,
  header,
  showBack = false,
  showNotifications = false,
  bare = false,
}: AppShellProps) {
  const isOnline = useOnlineStatus();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DemoDataBanner />
        <AppHeader title={title} showBack={showBack} showNotifications={showNotifications}>
          {header}
        </AppHeader>
        <main>
          <ErrorBoundary>
            {!isOnline ? (
              <PageContainer>
                <div className="surface-card">
                  <OfflineState onRetry={() => window.location.reload()} />
                </div>
              </PageContainer>
            ) : bare ? (
              children
            ) : (
              <PageContainer>{children}</PageContainer>
            )}
          </ErrorBoundary>
        </main>
        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}
