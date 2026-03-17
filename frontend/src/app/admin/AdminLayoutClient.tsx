"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/layout/Sidebar";
import TopNavbar from "@/components/admin/layout/TopNavbar";

const API_BASE = "http://localhost:4000/api/auth";

/** Routes that skip authentication */
const PUBLIC_ROUTES = ["/admin/login", "/admin/forgot-password"];

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  useEffect(() => {
    // Skip auth check for public routes (login, forgot-password)
    if (isPublicRoute) {
      setAuthChecked(true);
      setIsAuthed(false);
      return;
    }

    const token = localStorage.getItem("stackx_token");

    // No token at all → redirect immediately
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }

    // Has token → verify it with the backend
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000); // 4s timeout

    fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then((res) => {
        clearTimeout(timeout);
        if (res.ok) {
          setIsAuthed(true);
          setAuthChecked(true);
        } else {
          // Token is invalid/expired
          localStorage.removeItem("stackx_token");
          window.location.href = "/admin/login";
        }
      })
      .catch(() => {
        clearTimeout(timeout);
        // Backend unreachable or timed out → token is stale, redirect
        localStorage.removeItem("stackx_token");
        window.location.href = "/admin/login";
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [isPublicRoute]);

  // Public routes (login, forgot-password) render immediately without chrome
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Protected route: show spinner while verifying
  if (!authChecked || !isAuthed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin w-8 h-8 text-primary"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="text-sm text-muted">Verifying session…</p>
        </div>
      </div>
    );
  }

  // Authenticated → render full admin chrome
  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:ml-[260px] flex flex-col min-h-screen">
        <TopNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
