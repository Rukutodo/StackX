import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import "./portal.css";
import { AuthProvider } from "@/context/AuthContext";
import PortalLayoutClient from "./PortalLayoutClient";

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
    default: "Employee Portal",
    template: "%s — Employee Portal",
  },
  description: "Organization employee portal — tasks, leave, directory, and analytics.",
  icons: {
    icon: "/StackXMINI.svg",
    shortcut: "/StackXMINI.svg",
    apple: "/StackXMINI.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('devportal_theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`,
          }}
        />
        <AuthProvider>
          <PortalLayoutClient>{children}</PortalLayoutClient>
        </AuthProvider>
      </body>
    </html>
  );
}
