import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { AuthSession, LoginCredentials, UserRole } from "@/models";
import { authService } from "@/services/authService";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthContextValue {
  status: AuthStatus;
  session: AuthSession | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  // Session is read after hydration so SSR and client markup always match.
  useEffect(() => {
    const stored = authService.getSession();
    setSession(stored);
    setStatus(stored ? "authenticated" : "unauthenticated");
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const next = await authService.login(credentials);
    setSession(next);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setSession(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session,
      login,
      logout,
      hasRole: (role) => session?.user.role === role,
      hasAnyRole: (roles) => (session ? roles.includes(session.user.role) : false),
    }),
    [status, session, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>.");
  return context;
}
