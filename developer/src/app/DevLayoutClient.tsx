"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopNavbar from "@/components/layout/TopNavbar";
import { useAuth } from "@/context/AuthContext";

const PUBLIC_ROUTES = ["/login", "/forgot-password"];

export default function DevLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  // Public routes (login) render bare — AuthProvider gates the rest.
  if (isPublicRoute) return <>{children}</>;
  if (!user) return null; // AuthProvider already shows the spinner/redirect

  return (
    <div className="min-h-screen bg-background">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role={user.role} />
      <div className="lg:ml-[260px] flex flex-col min-h-screen">
        <TopNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} user={user} />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
