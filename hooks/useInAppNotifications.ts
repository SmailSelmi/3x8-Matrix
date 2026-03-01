// hooks/useInAppNotifications.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

const LS_KEY = "dismissed_notifications";

interface Broadcast {
  id: string;
  message: string;
  created_at: string;
}

interface UseInAppNotificationsReturn {
  notifications: Broadcast[];
  dismissNotification: (id: string) => void;
  isLoading: boolean;
}

export function useInAppNotifications(): UseInAppNotificationsReturn {
  const [notifications, setNotifications] = useState<Broadcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBroadcasts() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("broadcasts")
          .select("id, message, created_at")
          .order("created_at", { ascending: false })
          .limit(3);

        if (error || !data) {
          console.error("[useInAppNotifications] fetch error:", error);
          return;
        }

        // Filter out any IDs the user already dismissed
        const dismissed: string[] = JSON.parse(
          localStorage.getItem(LS_KEY) ?? "[]",
        );
        const visible = data.filter((b) => !dismissed.includes(b.id));
        setNotifications(visible);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBroadcasts();
  }, []);

  const dismissNotification = useCallback((id: string) => {
    // Persist to localStorage
    const dismissed: string[] = JSON.parse(
      localStorage.getItem(LS_KEY) ?? "[]",
    );
    if (!dismissed.includes(id)) {
      localStorage.setItem(LS_KEY, JSON.stringify([...dismissed, id]));
    }
    // Immediately remove from UI state
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { notifications, dismissNotification, isLoading };
}
