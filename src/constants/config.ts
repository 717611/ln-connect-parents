/**
 * Application configuration.
 *
 * DATA_SOURCE stays "mock" until the shared Firebase project is wired in.
 * Repositories are the only layer that reads this flag.
 */
export const APP_CONFIG = {
  appName: "LN Parent",
  version: "1.0.0",
  supportEmail: "support@lnisranchi.in",
  supportPhone: "+91 90000 00000",
  dataSource: "mock" as "mock" | "firebase",
  simulatedLatencyMs: 220,
  queryStaleTimeMs: 60_000,
  session: {
    storageKey: "ln-parent.session",
  },
} as const;

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
  complaints: "complaints",
  complaintMessages: "messages",
  attendance: "attendance",
  gallery: "gallery",
} as const;
