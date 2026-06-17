import { useEffect, useRef } from "react";

/**
 * Calls `fn` on an interval while the tab is visible. Pauses when the tab is
 * hidden and fires immediately on re-focus so the view stays fresh without
 * hammering the API in the background.
 */
export function usePolling(fn: () => void, intervalMs = 15000, enabled = true) {
  const saved = useRef(fn);
  saved.current = fn;

  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      stop();
      timer = setInterval(() => {
        if (document.visibilityState === "visible") saved.current();
      }, intervalMs);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        saved.current();
        start();
      } else {
        stop();
      }
    };

    start();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [intervalMs, enabled]);
}
