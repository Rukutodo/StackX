"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthUser {
  id: string;
  username: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

const API_BASE = "http://localhost:4000/api/auth";

/** Routes that do NOT require authentication */
const PUBLIC_ADMIN_ROUTES = ["/login", "/forgot-password"];

/** Helper to build auth headers fallback */
function authHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("stackx_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ADMIN_ROUTES.some((r) => pathname.startsWith(r));

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Middleware handles redirects, but we still need user data for the UI
      try {
        const res = await fetch(`${API_BASE}/me`, {
          credentials: "include", // This sends the HTTP-only token cookie
          headers: authHeaders(), // Fallback to localStorage Bearer token
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
          // Only clear localStorage if we know for sure it's invalid
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

  // Client-side auto redirect as backup to Middleware
  useEffect(() => {
    if (loading) return;
    if (!user && !isPublicRoute) {
      // Forceful hard-redirect on the client side just in case middleware fails
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
      // ignore network errors
    }
    localStorage.removeItem("stackx_token");
    setUser(null);
    window.location.href = "/admin/login";
  };

  // While checking auth on protected routes, show loading spinner
  if (loading && !isPublicRoute) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-muted">Verifying session…</p>
        </div>
      </div>
    );
  }

  // On protected routes with no user, don't render children. Render redirect state.
  if (!user && !isPublicRoute) {

    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-muted">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
