"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/portal/layout/Sidebar";
import TopNavbar from "@/components/portal/layout/TopNavbar";
import PresenceManager from "@/components/portal/PresenceManager";
import { useAuth } from "@/context/AuthContext";

const PUBLIC_ROUTES = ["/login"];

export default function PortalLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  // Login (and other public pages) render bare — no chrome
  if (isPublicRoute) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <PresenceManager />
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-[260px] flex flex-col min-h-screen">
        <TopNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} user={user} />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
