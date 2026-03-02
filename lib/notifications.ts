export async function requestOSNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notification");
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  const permission = await Notification.requestPermission();
  return permission;
}

export async function sendOSNotification(title: string, body: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  const options: NotificationOptions = {
    body,
    icon: "/icons/icon-192x192.png",
    dir: "rtl",
    lang: "ar",
  };

  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, options);
      return;
    } catch (err) {
      console.warn(
        "Failed to show notification via service worker, falling back to basic Notification",
        err,
      );
    }
  }

  // Fallback if Service Worker is not ready or fails
  new Notification(title, options);
}
