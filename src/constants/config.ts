/**
 * Application configuration.
 *
 * The data source is decided by the environment: when the Firebase env vars are
 * present the repositories talk to the shared School Portal backend, otherwise
 * they fall back to local mock data. Repositories are the only layer that reads
 * this flag.
 */
import { isFirebaseConfigured } from "@/config/firebase";

export const APP_CONFIG = {
  appName: "LN Parent",
  version: "1.0.0",
  supportEmail: "support@lnisranchi.in",
  supportPhone: "+91 90000 00000",
  simulatedLatencyMs: 220,
  queryStaleTimeMs: 60_000,
  session: {
    storageKey: "ln-parent.session",
  },
} as const;

export type DataSource = "mock" | "firebase";

/** "firebase" once the VITE_FIREBASE_* env vars are configured. */
export const getDataSource = (): DataSource => (isFirebaseConfigured() ? "firebase" : "mock");


/**
 * Firestore collection names — fixed by the existing SchoolOS backend contract.
 * Do NOT invent or rename collections here.
 */
export const COLLECTIONS = {
  students: "students",
  parents: "parents",
  teachers: "teachers",
  classrooms: "classrooms",
  subjects: "subjects",
  homework: "homework",
  classwork: "classwork",
  notices: "notices",
  helpdesk: "helpdesk",
  complaints: "complaints",
  complaintMessages: "messages",
  attendance: "attendance",
  gallery: "gallery",
} as const;
