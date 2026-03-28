import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password — Admin | StackX",
  description: "Reset your StackX admin password.",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
