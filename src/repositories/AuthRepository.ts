import { getFirebaseAuth } from "@/config/firebase";
import { COLLECTIONS } from "@/constants/config";
import { mockParent, mockSession } from "@/data/mockData";
import {
  logLoginDiagnostics,
  logLoginError,
  logLoginMatchCount,
} from "@/lib/login-diagnostics";
import type { AuthSession, LoginCredentials, Parent } from "@/models";

import { getDocById, listDocs, useFirebase, where } from "./firestore/firestore.utils";
import { mapParent, mapStudent } from "./firestore/mappers";
import { resolveMock } from "./repository.utils";


export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  logout(): Promise<void>;
  getCurrentParent(parentId: string): Promise<Parent>;
  requestPasswordReset(admissionNumber: string): Promise<void>;
  changePassword(currentPassword: string, newPassword: string): Promise<void>;
}

/**
 * The School Portal identifies parents by admission number. Firebase Auth needs
 * an email, so we resolve it from the student document (falling back to the
 * admission number itself when the school issues email logins).
 */
const resolveLoginEmail = async (admissionNumber: string): Promise<string> => {
  if (admissionNumber.includes("@")) return admissionNumber;
  const students = await listDocs(COLLECTIONS.students, [
    where("admissionNumber", "==", admissionNumber),
  ]);
  const first = students[0];
  if (!first) throw new Error("No student found for this admission number.");
  const student = mapStudent(first);
  const parentRaw = student.parentId
    ? await getDocById(COLLECTIONS.parents, student.parentId)
    : null;
  const email = parentRaw ? mapParent(parentRaw).email : null;
  if (!email) throw new Error("No login email is linked to this admission number.");
  return email;
};

export const AuthRepository: IAuthRepository = {
  async login(credentials) {
    const admission = credentials.admissionNumber.trim();
    // TEMPORARY: diagnostics for verifying the live Firebase connection.
    logLoginDiagnostics(admission, String(COLLECTIONS.students));

    if (!admission || !credentials.password.trim()) {
      throw new Error("Admission number and password are required.");
    }

    if (useFirebase()) {
      try {
        const { signInWithEmailAndPassword } = await import("firebase/auth");
        const matches = await listDocs(COLLECTIONS.students, [
          where("admissionNumber", "==", admission),
        ]);
        logLoginMatchCount(matches.length);
        const email = await resolveLoginEmail(admission);
        const cred = await signInWithEmailAndPassword(
          getFirebaseAuth(),
          email,
          credentials.password,
        );
        const student = matches[0] ? mapStudent(matches[0]) : null;
        return {
          user: {
            uid: cred.user.uid,
            parentId: student?.parentId ?? cred.user.uid,
            role: "parent",
            admissionNumber: admission,
            displayName: cred.user.displayName ?? student?.fullName ?? "Parent",
          },
          issuedAt: new Date().toISOString(),
        };
      } catch (error) {
        logLoginError(error);
        throw error;
      }
    }

    logLoginMatchCount(0);
    return resolveMock({
      ...mockSession,
      user: { ...mockSession.user, admissionNumber: credentials.admissionNumber },
    });
  },


  async logout() {
    if (useFirebase()) {
      const { signOut } = await import("firebase/auth");
      await signOut(getFirebaseAuth());
      return;
    }
    await resolveMock(null);
  },

  async getCurrentParent(parentId) {
    if (useFirebase()) {
      const raw = await getDocById(COLLECTIONS.parents, parentId);
      if (!raw) throw new Error("Parent record not found.");
      return mapParent(raw);
    }
    return resolveMock(mockParent);
  },

  async requestPasswordReset(admissionNumber) {
    if (!admissionNumber.trim()) throw new Error("Admission number is required.");
    if (useFirebase()) {
      const { sendPasswordResetEmail } = await import("firebase/auth");
      const email = await resolveLoginEmail(admissionNumber.trim());
      await sendPasswordResetEmail(getFirebaseAuth(), email);
      return;
    }
    await resolveMock(null);
  },

  async changePassword(currentPassword, newPassword) {
    if (!currentPassword || !newPassword) throw new Error("Both passwords are required.");
    if (useFirebase()) {
      const { EmailAuthProvider, reauthenticateWithCredential, updatePassword } = await import(
        "firebase/auth"
      );
      const user = getFirebaseAuth().currentUser;
      if (!user?.email) throw new Error("You need to sign in again before changing the password.");
      await reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(user.email, currentPassword),
      );
      await updatePassword(user, newPassword);
      return;
    }
    await resolveMock(null);
  },
};
