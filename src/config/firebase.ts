/**
 * SINGLE Firebase integration point.
 *
 * The Parent Portal is only another frontend for the SAME Firebase project used
 * by the School Portal (Google AI Studio) — same project, same custom Firestore
 * database ID. No other file may import the Firebase SDK directly.
 *
 * All values come from Vite environment variables (`.env.local` locally,
 * Vercel project env vars in production). Nothing is hardcoded.
 */
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  vapidKey?: string;
}

const env = import.meta.env as Record<string, string | undefined>;
/** Reads VITE_* first, then falls back to the NEXT_PUBLIC_* name (School Portal parity). */
const read = (key: string): string =>
  env[key]?.trim() || env[key.replace(/^VITE_/, "NEXT_PUBLIC_")]?.trim() || "";

/**
 * Custom Firestore database ID shared with the School Portal. It can be
 * overridden per environment, but defaults to the School Portal's database so
 * both frontends always read and write the same data.
 */
export const DEFAULT_FIRESTORE_DATABASE_ID =
  "ai-studio-lninternationals-5d0a906a-852c-4dc9-8b16-611cc88a1568";

export const firestoreDatabaseId =
  read("VITE_FIRESTORE_DATABASE_ID") || DEFAULT_FIRESTORE_DATABASE_ID;

export const firebaseConfig: FirebaseConfig = {
  apiKey: read("VITE_FIREBASE_API_KEY"),
  authDomain: read("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: read("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: read("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: read("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: read("VITE_FIREBASE_APP_ID"),
  ...(read("VITE_FIREBASE_MEASUREMENT_ID")
    ? { measurementId: read("VITE_FIREBASE_MEASUREMENT_ID") }
    : {}),
  ...(read("VITE_FIREBASE_VAPID_KEY") ? { vapidKey: read("VITE_FIREBASE_VAPID_KEY") } : {}),
};

const REQUIRED_KEYS = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
] as const;

/** True only when every required env var is present. */
export const isFirebaseConfigured = (): boolean =>
  REQUIRED_KEYS.every((key) => Boolean(firebaseConfig[key]));

/** Names of the env vars that still need to be provided (used for diagnostics). */
export const missingFirebaseEnvKeys = (): string[] =>
  REQUIRED_KEYS.filter((key) => !firebaseConfig[key]).map(
    (key) => `VITE_FIREBASE_${key.replace(/[A-Z]/g, (c) => `_${c}`).toUpperCase()}`,
  );

const notConfigured = (service: string): never => {
  throw new Error(
    `[firebase] ${service} is unavailable: missing env vars ${missingFirebaseEnvKeys().join(", ")}.`,
  );
};

export const getFirebaseApp = (): FirebaseApp => {
  if (!isFirebaseConfigured()) notConfigured("app");
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
};

export const getFirebaseAuth = (): Auth => getAuth(getFirebaseApp());

let firestore: Firestore | null = null;

/** Firestore bound to the SAME custom database ID as the School Portal. */
export const getFirestoreDb = (): Firestore => {
  if (!firestore) {
    firestore = getFirestore(getFirebaseApp(), firestoreDatabaseId);
  }
  return firestore;
};

export const getFirebaseStorage = (): FirebaseStorage => getStorage(getFirebaseApp());

export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  if (!isFirebaseConfigured()) return null;
  if (typeof window === "undefined") return null;
  if (!(await isSupported())) return null;
  return getMessaging(getFirebaseApp());
};
