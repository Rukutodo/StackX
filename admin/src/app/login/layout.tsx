import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — Admin | StackX",
  description: "Sign in to the StackX admin dashboard.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Standalone layout — no Sidebar or TopNavbar
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
