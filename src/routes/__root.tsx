import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { ErrorState } from "@/components/feedback/ErrorState";
import { Toaster } from "@/components/ui/sonner";
import { LABELS } from "@/constants/labels";
import { ROUTES } from "@/constants/routes";
import { AuthProvider } from "@/hooks/useAuth";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm text-center">
        <p className="font-display text-6xl font-bold text-primary">404</p>
        <h1 className="mt-4 text-xl font-semibold text-foreground">{LABELS.states.notFoundTitle}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{LABELS.states.notFoundBody}</p>
        <Link
          to={ROUTES.home}
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform active:scale-95"
        >
          {LABELS.states.goHome}
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <ErrorState
        onRetry={() => {
          void router.invalidate();
          reset();
        }}
      />
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#F8FAFC" },
      { name: "author", content: "LN International School" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Login | LN Parent Portal — LN International School" },
      { property: "og:title", content: "Login | LN Parent Portal — LN International School" },
      { name: "twitter:title", content: "Login | LN Parent Portal — LN International School" },
      { name: "description", content: "Sign in to the LN International School Parent Portal to follow homework, classwork, notices and school updates for your child." },
      { property: "og:description", content: "Sign in to the LN International School Parent Portal to follow homework, classwork, notices and school updates for your child." },
      { name: "twitter:description", content: "Sign in to the LN International School Parent Portal to follow homework, classwork, notices and school updates for your child." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2c7f0e94-dc65-497e-ae5e-c651e4acc1ac/id-preview-0ee0e02d--117ad633-1338-4900-b9a5-ce338ec11715.lovable.app-1785574688656.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2c7f0e94-dc65-497e-ae5e-c651e4acc1ac/id-preview-0ee0e02d--117ad633-1338-4900-b9a5-ce338ec11715.lovable.app-1785574688656.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Toaster position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
