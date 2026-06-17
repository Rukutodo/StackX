import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — Employee Portal",
  description: "Sign in to the Employee Portal.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
