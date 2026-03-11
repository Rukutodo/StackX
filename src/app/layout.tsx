import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";

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
    default: "StackX — Professional Web Development at Unbeatable Costs",
    template: "%s | StackX",
  },
  description:
    "StackX delivers high-performance web development, business automation, and ad tech solutions at unbeatable costs. Your trusted technology partner for startups, marketing teams, and enterprises.",
  keywords: [
    "web development",
    "software development",
    "business automation",
    "ad tech",
    "SaaS development",
    "StackX",
    "cost-effective development",
  ],
  icons: {
    icon: "/StackXMINI.svg",
    shortcut: "/StackXMINI.svg",
    apple: "/StackXMINI.svg",
  },
  openGraph: {
    title: "StackX — Professional Web Development at Unbeatable Costs",
    description:
      "High-performance web solutions, automation systems, and ad tech platforms at industry-leading prices.",
    type: "website",
    siteName: "StackX",
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
        <CustomCursor />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
