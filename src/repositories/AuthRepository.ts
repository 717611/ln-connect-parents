import { getFirebaseAuth } from "@/config/firebase";
import { COLLECTIONS } from "@/constants/config";
import { mockParent } from "@/data/mockData";
import {
  logLoginDiagnostics,
  logLoginError,
  logLoginMatchCount,
} from "@/lib/login-diagnostics";
import type { AuthSession, LoginCredentials, Parent } from "@/models";

import { getDocById, listDocs, useFirebase, where } from "./firestore/firestore.utils";
import { mapParent, mapStudent } from "./firestore/mappers";

/** Password reset still needs an email; resolve it from the student/parent records. */
const resolveLoginEmail = async (admissionNumber: string): Promise<string> => {
  if (admissionNumber.includes("@")) return admissionNumber;
  const students = await listDocs(COLLECTIONS.students, [
    where("admissionNo", "==", admissionNumber),
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
import { resolveMock } from "./repository.utils";


export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  logout(): Promise<void>;
  getCurrentParent(parentId: string): Promise<Parent>;
  requestPasswordReset(admissionNumber: string): Promise<void>;
  changePassword(currentPassword: string, newPassword: string): Promise<void>;
}

/** SHA-256 hex digest (lowercase) — same hashing the School Portal uses. */
const sha256Hex = async (value: string): Promise<string> => {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toLowerCase();
};

/** Accepts plain-text (legacy), lowercase hex hash, and uppercase hex hash. */
const isPasswordValid = (
  storedPassword: unknown,
  inputPlain: string,
  computedHash: string,
): boolean => {
  if (typeof storedPassword !== "string") return false;
  const stored = storedPassword.trim();
  if (!stored) return false;
  return (
    stored === inputPlain ||
    stored.toLowerCase() === computedHash ||
    stored === computedHash.toUpperCase()
  );
};

export const AuthRepository: IAuthRepository = {
  async login(credentials) {
    const cleanUsername = credentials.admissionNumber.trim();
    const cleanInput = credentials.password.trim();
    // TEMPORARY: diagnostics for verifying the live Firebase connection.
    logLoginDiagnostics(cleanUsername, "users");

    if (!cleanUsername || !cleanInput) {
      throw new Error("Admission number and password are required.");
    }

    // Production must never silently fall back to mock data.
    if (!useFirebase()) {
      throw new Error(
        "Firebase is not configured. Set the VITE_FIREBASE_* environment variables to sign in.",
      );
    }

    const admission = cleanUsername;

    try {
      // 1. School Portal contract: users/username.
      let docs = await listDocs("users", [where("username", "==", cleanUsername)]);
      let fromUsers = docs.length > 0;
      // 2. Fallback: students/admissionNo.
      if (docs.length === 0) {
        docs = await listDocs(COLLECTIONS.students, [where("admissionNo", "==", cleanUsername)]);
      }
      logLoginMatchCount(docs.length);
      const userDoc = docs[0];
      if (!userDoc) throw new Error("No student found for this admission number.");

      const computedHash = await sha256Hex(cleanInput);
      let valid = isPasswordValid(userDoc["password"], cleanInput, computedHash);

      // Fallback: check the student record's password when users/ fails or lacks one.
      if (!valid && fromUsers) {
        const students = await listDocs(COLLECTIONS.students, [
          where("admissionNo", "==", cleanUsername),
        ]);
        valid = students.some((s) => isPasswordValid(s["password"], cleanInput, computedHash));
      }

      if (!valid) {
        throw new Error("Invalid password.");
      }


      const parentId =
        (typeof userDoc["parentId"] === "string" && userDoc["parentId"]) ||
        (typeof userDoc["studentId"] === "string" && userDoc["studentId"]) ||
        userDoc.id;
      const displayName =
        (typeof userDoc["fullName"] === "string" && userDoc["fullName"]) ||
        (typeof userDoc["name"] === "string" && userDoc["name"]) ||
        "Parent";

      return {
        user: {
          uid: userDoc.id,
          parentId,
          role: "parent",
          admissionNumber: admission,
          displayName,
        },
        issuedAt: new Date().toISOString(),
      };
    } catch (error) {
      logLoginError(error);
      throw error;
    }
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
