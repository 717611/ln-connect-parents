/*
 * RUNTIME Firebase configuration (optional).
 *
 * Values here are read by the app at runtime, AFTER the bundle is built.
 * Use this when a host (e.g. Vercel) was deployed without the VITE_FIREBASE_*
 * build-time environment variables: fill the values below, redeploy the static
 * files and the app connects to the shared School Portal backend.
 *
 * Build-time VITE_* / NEXT_PUBLIC_* env vars always win over these values.
 * Firebase web config values are publishable (they are visible in any web
 * client), so keeping them here is safe. Never put private keys in this file.
 */
window.__LN_FIREBASE__ = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
  vapidKey: "",
  // Custom Firestore database ID shared with the School Portal.
  databaseId: "ai-studio-lninternationals-5d0a906a-852c-4dc9-8b16-611cc88a1568",
};
