/**
 * Notification placeholder.
 * TODO(firebase): request permission, get the FCM token via
 * getFirebaseMessaging() and register it against the parent document.
 */
export const notificationService = {
  async isSupported(): Promise<boolean> {
    return false;
  },
  async register(_parentId: string): Promise<void> {
    // TODO(firebase): getToken(messaging, { vapidKey }) + persist to Firestore
  },
};
