// hooks/usePwaUpdate.ts
"use client";

import { useEffect, useState } from "react";

export function usePwaUpdate() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg?.waiting) {
          setIsUpdateAvailable(true);
        }

        reg?.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          newWorker?.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              setIsUpdateAvailable(true);
            }
          });
        });
      });
    }
  }, []);

  const updateApp = () => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg?.waiting) {
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
          // Give it a brief moment to take effect
          setTimeout(() => {
            window.location.reload();
          }, 200);
        } else {
          window.location.reload();
        }
      });
    } else {
      window.location.reload();
    }
  };

  return { isUpdateAvailable, updateApp };
}
