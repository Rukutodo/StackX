"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { usePathname } from "next/navigation";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  jobTitle?: string;
  presence?: "available" | "busy" | "away" | "offline";
  role: { id: string; name: string };
  permissions: string[];
  managerId: string | null;
  managerName?: string | null;
}

type Presence = "available" | "busy" | "away" | "offline";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  hasPermission: (key: string) => boolean;
  presence: Presence;
  updatePresence: (p: Presence) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  hasPermission: () => false,
  presence: "available",
  updatePresence: () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/auth";
const PUBLIC_ROUTES = ["/login"];
export const TOKEN_KEY = "devportal_token";

function authHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [presence, setPresence] = useState<Presence>("available");
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  useEffect(() => {
    if (isPublicRoute) {
      setLoading(false);
      return;
    }
    const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    fetch(`${API}/me`, { headers: authHeaders(), credentials: "include", signal: controller.signal })
      .then(async (res) => {
        clearTimeout(timeout);
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setPresence((data.user?.presence as Presence) || "available");
          setLoading(false);
        } else {
          localStorage.removeItem(TOKEN_KEY);
          window.location.href = "/login";
        }
      })
      .catch(() => {
        clearTimeout(timeout);
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = "/login";
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [isPublicRoute]);

  const hasPermission = useCallback(
    (key: string) => !!user?.permissions.includes(key),
    [user]
  );

  const updatePresence = useCallback((p: Presence) => {
    setPresence(p);
    fetch(`${API}/me`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      credentials: "include",
      body: JSON.stringify({ presence: p }),
    }).catch(() => {
      /* ignore */
    });
  }, []);

  const logout = async () => {
    try {
      await fetch(`${API}/logout`, { method: "POST", credentials: "include", headers: authHeaders() });
    } catch {
      /* ignore */
    }
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    window.location.href = "/login";
  };

  // Spinner while verifying on protected routes
  if (loading && !isPublicRoute) {
    return <FullScreenSpinner label="Verifying session…" />;
  }
  if (!user && !isPublicRoute) {
    return <FullScreenSpinner label="Redirecting to login…" />;
  }

  return (
    <AuthContext.Provider value={{ user, loading, hasPermission, presence, updatePresence, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function FullScreenSpinner({ label }: { label: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}
