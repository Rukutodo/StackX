"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { AuthUser } from "@/lib/types";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  /** True if the current user holds the given permission. */
  can: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  can: () => false,
});

export function useAuth() {
  return useContext(AuthContext);
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "/api/auth";

const PUBLIC_ROUTES = ["/login", "/forgot-password"];

function authHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("stackx_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function Spinner({ label }: { label: string }) {
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE}/me`, {
          credentials: "include",
          headers: authHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
          if (res.status === 401) localStorage.removeItem("stackx_token");
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user && !isPublicRoute) {
      window.location.href = "/login";
    }
  }, [user, loading, isPublicRoute]);

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/logout`, {
        method: "POST",
        credentials: "include",
        headers: authHeaders(),
      });
    } catch {
      // ignore
    }
    localStorage.removeItem("stackx_token");
    setUser(null);
    window.location.href = "/login";
  };

  const can = (permission: string) => !!user?.permissions?.includes(permission);

  if (loading && !isPublicRoute) return <Spinner label="Verifying session…" />;
  if (!user && !isPublicRoute) return <Spinner label="Redirecting to login..." />;

  return (
    <AuthContext.Provider value={{ user, loading, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
}
