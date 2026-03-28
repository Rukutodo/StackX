import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import "./admin.css";
import AdminLayoutClient from "./AdminLayoutClient";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard | StackX",
    template: "%s — Admin | StackX",
  },
  description:
    "StackX administration dashboard — manage services, portfolio, team, and client communications.",
  icons: {
    icon: "/StackXMINI.svg",
    shortcut: "/StackXMINI.svg",
    apple: "/StackXMINI.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${poppins.variable} font-body antialiased bg-background text-foreground`}
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </body>
    </html>
  );
}
