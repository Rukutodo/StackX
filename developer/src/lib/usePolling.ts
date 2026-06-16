"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface PollingOptions {
  /** poll interval in ms (default 20s) */
  interval?: number;
  /** refetch when the tab/window regains focus (default true) */
  refetchOnFocus?: boolean;
  /** pause polling */
  enabled?: boolean;
}

/**
 * Fetches data on mount, on a background interval, and on window focus.
 * This is how concurrent users see each other's changes without WebSockets.
 */
export function usePolling<T>(
  fetcher: () => Promise<T>,
  { interval = 20000, refetchOnFocus = true, enabled = true }: PollingOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const refetch = useCallback(async () => {
    try {
      const result = await fetcherRef.current();
      setData(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    refetch();
    const id = setInterval(refetch, interval);

    const onFocus = () => refetch();
    if (refetchOnFocus) window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(id);
      if (refetchOnFocus) window.removeEventListener("focus", onFocus);
    };
  }, [enabled, interval, refetchOnFocus, refetch]);

  // allow optimistic local updates
  return { data, setData, loading, error, refetch };
}
