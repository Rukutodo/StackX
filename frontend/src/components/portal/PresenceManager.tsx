"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { api, API_BASE } from "@/lib/api";

const IDLE_MS = 5 * 60 * 1000; // 5 minutes → auto-away
const HEARTBEAT_MS = 60 * 1000; // keep lastSeen fresh
const CHECK_MS = 30 * 1000;

/**
 * Drives automatic presence:
 *  - heartbeat keeps the user "online" (others infer offline when it goes stale)
 *  - auto-away after 5 min idle (only when Available; restores on activity)
 *  - marks Available on connect; best-effort Offline on tab close
 * Manual Busy/Offline are respected (idle never overrides them).
 */
export default function PresenceManager() {
  const { presence, updatePresence } = useAuth();
  const presenceRef = useRef(presence);
  const lastActivity = useRef(Date.now());
  const autoAway = useRef(false);

  useEffect(() => {
    presenceRef.current = presence;
  }, [presence]);

  // Coming online: if we were offline, flip to available
  useEffect(() => {
    if (presenceRef.current === "offline") updatePresence("available");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const beat = () => api("/api/auth/heartbeat", { method: "POST" }).catch(() => {});
    beat();
    const hb = setInterval(beat, HEARTBEAT_MS);

    const onActivity = () => {
      lastActivity.current = Date.now();
      if (autoAway.current && presenceRef.current === "away") {
        autoAway.current = false;
        updatePresence("available");
      }
    };
    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    const idleCheck = setInterval(() => {
      if (Date.now() - lastActivity.current > IDLE_MS && presenceRef.current === "available") {
        autoAway.current = true;
        updatePresence("away");
      }
    }, CHECK_MS);

    // Best-effort offline on tab close (cookie-authenticated beacon)
    const onUnload = () => {
      try {
        navigator.sendBeacon(`${API_BASE}/api/auth/offline`);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("beforeunload", onUnload);

    return () => {
      clearInterval(hb);
      clearInterval(idleCheck);
      events.forEach((e) => window.removeEventListener(e, onActivity));
      window.removeEventListener("beforeunload", onUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
