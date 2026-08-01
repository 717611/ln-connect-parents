/**
 * TEMPORARY diagnostic logging for the login flow.
 *
 * Logs only non-sensitive configuration facts (never API keys or passwords).
 * Safe to delete once Firebase connectivity has been verified.
 */
import {
  firebaseConfig,
  firestoreDatabaseId,
  isFirebaseConfigured,
  missingFirebaseEnvKeys,
  getFirestoreDb,
} from "@/config/firebase";

const tag = "[login-diagnostics]";

export const logLoginDiagnostics = (admissionNumber: string, collectionName: string): void => {
  const configured = isFirebaseConfigured();

  // eslint-disable-next-line no-console
  console.groupCollapsed?.(`${tag} login pressed`);
  console.info(`${tag} 1. Firebase config detected:`, configured);
  if (!configured) {
    console.warn(`${tag} 1b. Missing env vars:`, missingFirebaseEnvKeys().join(", ") || "none");
  }
  console.info(`${tag} 2. Firebase project ID:`, firebaseConfig.projectId || "(none)");
  console.info(`${tag} 3. Firestore database ID:`, firestoreDatabaseId);

  let firestoreOk = false;
  if (configured) {
    try {
      const db = getFirestoreDb();
      firestoreOk = Boolean(db);
    } catch (error) {
      console.error(`${tag} Firestore init failed:`, error instanceof Error ? error.message : error);
    }
  }
  console.info(`${tag} 4. Firestore initialized:`, firestoreOk);
  console.info(`${tag} 5. Collection queried for student login:`, collectionName);
  console.info(`${tag} 6. Admission number searched:`, admissionNumber);
  console.info(`${tag} 8. Data mode:`, configured ? "FIREBASE" : "MOCK");
  console.groupEnd?.();
};

export const logLoginMatchCount = (count: number): void => {
  console.info(`${tag} 7. Matching student documents returned:`, count);
};

export const logLoginError = (error: unknown): void => {
  console.error(`${tag} login failed:`, error instanceof Error ? error.message : error);
};
