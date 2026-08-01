import { APP_CONFIG } from "@/constants/config";
import type { AuthSession, LoginCredentials, Parent } from "@/models";
import { AuthRepository } from "@/repositories/AuthRepository";

const readStoredSession = (): AuthSession | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(APP_CONFIG.session.storageKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    window.localStorage.removeItem(APP_CONFIG.session.storageKey);
    return null;
  }
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const session = await AuthRepository.login(credentials);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(APP_CONFIG.session.storageKey, JSON.stringify(session));
    }
    return session;
  },

  async logout(): Promise<void> {
    await AuthRepository.logout();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(APP_CONFIG.session.storageKey);
    }
  },

  getSession(): AuthSession | null {
    return readStoredSession();
  },

  getParent(parentId: string): Promise<Parent> {
    return AuthRepository.getCurrentParent(parentId);
  },

  requestPasswordReset(admissionNumber: string): Promise<void> {
    return AuthRepository.requestPasswordReset(admissionNumber);
  },

  changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return AuthRepository.changePassword(currentPassword, newPassword);
  },
};
