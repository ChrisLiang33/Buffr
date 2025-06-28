import { useState, useEffect } from "react";

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isServiceWorkerRegistered, setIsServiceWorkerRegistered] =
    useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
          setIsServiceWorkerRegistered(true);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const syncOfflineData = async () => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      try {
        await navigator.serviceWorker.ready;
        await navigator.serviceWorker.controller.postMessage({
          type: "SYNC_OFFLINE_DATA",
        });
        return true;
      } catch (error) {
        console.error("Failed to sync offline data:", error);
        return false;
      }
    }
    return false;
  };

  return {
    isOnline,
    isOffline: !isOnline,
    isServiceWorkerRegistered,
    syncOfflineData,
  };
};
