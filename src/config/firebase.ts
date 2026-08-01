/**
 * SINGLE Firebase integration point.
 *
 * The Parent Portal is only another frontend for the SAME Firebase project used
 * by SchoolOS. Nothing here is implemented yet — the keys will be added later.
 *
 * TODO(firebase): install `firebase`, paste the shared project config below and
 * implement the accessors. No other file should import the Firebase SDK.
 */

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

/** TODO(firebase): replace placeholders with the shared SchoolOS project config. */
export const firebaseConfig: FirebaseConfig = {
  apiKey: "__FIREBASE_API_KEY__",
  authDomain: "__FIREBASE_AUTH_DOMAIN__",
  projectId: "__FIREBASE_PROJECT_ID__",
  storageBucket: "__FIREBASE_STORAGE_BUCKET__",
  messagingSenderId: "__FIREBASE_MESSAGING_SENDER_ID__",
  appId: "__FIREBASE_APP_ID__",
};

export const isFirebaseConfigured = (): boolean =>
  !Object.values(firebaseConfig).some(
    (value) => typeof value === "string" && value.startsWith("__FIREBASE_"),
  );

const notConfigured = (service: string): never => {
  throw new Error(
    `[firebase] ${service} is not configured yet. Add the shared project config in src/config/firebase.ts.`,
  );
};

/** TODO(firebase): return initializeApp(firebaseConfig) (memoised). */
export const getFirebaseApp = (): unknown => notConfigured("app");

/** TODO(firebase): return getAuth(getFirebaseApp()). */
export const getFirebaseAuth = (): unknown => notConfigured("auth");

/** TODO(firebase): return getFirestore(getFirebaseApp()). */
export const getFirestoreDb = (): unknown => notConfigured("firestore");

/** TODO(firebase): return getStorage(getFirebaseApp()). */
export const getFirebaseStorage = (): unknown => notConfigured("storage");

/** TODO(firebase): return getMessaging(getFirebaseApp()) + token registration. */
export const getFirebaseMessaging = (): unknown => notConfigured("messaging");
