import { mockParent, mockSession } from "@/data/mockData";
import type { AuthSession, LoginCredentials, Parent } from "@/models";

import { resolveMock } from "./repository.utils";

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  logout(): Promise<void>;
  getCurrentParent(parentId: string): Promise<Parent>;
  requestPasswordReset(admissionNumber: string): Promise<void>;
  changePassword(currentPassword: string, newPassword: string): Promise<void>;
}

export const AuthRepository: IAuthRepository = {
  // TODO(firebase): signInWithEmailAndPassword using the admission-number
  // identity mapping defined by SchoolOS, then read the parent claim.
  async login(credentials) {
    if (!credentials.admissionNumber.trim() || !credentials.password.trim()) {
      throw new Error("Admission number and password are required.");
    }
    return resolveMock({
      ...mockSession,
      user: { ...mockSession.user, admissionNumber: credentials.admissionNumber },
    });
  },

  // TODO(firebase): signOut(getFirebaseAuth())
  async logout() {
    await resolveMock(null);
  },

  // TODO(firebase): getDoc(doc(db, COLLECTIONS.parents, parentId))
  async getCurrentParent(parentId) {
    if (parentId !== mockParent.id) {
      return resolveMock(mockParent);
    }
    return resolveMock(mockParent);
  },

  // TODO(firebase): sendPasswordResetEmail via the SchoolOS parent identity
  async requestPasswordReset(admissionNumber) {
    if (!admissionNumber.trim()) throw new Error("Admission number is required.");
    await resolveMock(null);
  },

  // TODO(firebase): reauthenticateWithCredential + updatePassword
  async changePassword(currentPassword, newPassword) {
    if (!currentPassword || !newPassword) throw new Error("Both passwords are required.");
    await resolveMock(null);
  },
};
