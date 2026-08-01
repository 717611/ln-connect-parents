/**
 * Push notifications via Firebase Cloud Messaging.
 * Requires VITE_FIREBASE_VAPID_KEY plus a service worker to be enabled.
 */
import { firebaseConfig, getFirebaseMessaging, isFirebaseConfigured } from "@/config/firebase";
import { COLLECTIONS } from "@/constants/config";

export const notificationService = {
  async isSupported(): Promise<boolean> {
    if (!isFirebaseConfigured() || !firebaseConfig.vapidKey) return false;
    return Boolean(await getFirebaseMessaging());
  },

  async register(parentId: string): Promise<void> {
    const messaging = await getFirebaseMessaging();
    if (!messaging || !firebaseConfig.vapidKey) return;
    const { getToken } = await import("firebase/messaging");
    const token = await getToken(messaging, { vapidKey: firebaseConfig.vapidKey });
    if (!token) return;
    const { arrayUnion, doc, setDoc } = await import("firebase/firestore");
    const { getFirestoreDb } = await import("@/config/firebase");
    await setDoc(
      doc(getFirestoreDb(), COLLECTIONS.parents, parentId),
      { fcmTokens: arrayUnion(token) },
      { merge: true },
    );
  },
};
