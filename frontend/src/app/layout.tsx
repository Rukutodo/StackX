import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import RootShell from "./RootShell";

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
  metadataBase: new URL("https://stackx.co.in"),
  title: {
    default: "StackX — We build, validate, and scale business",
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
    "Vizag tech agency",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/StackXMINI.svg",
    shortcut: "/StackXMINI.svg",
    apple: "/StackXMINI.svg",
  },
  openGraph: {
    title: "StackX — We build, validate, and scale business ",
    description:
      "High-performance web solutions, automation systems, and ad tech platforms at industry-leading prices.",
    url: "https://stackx.co.in",
    siteName: "StackX",
    images: [
      {
        url: "/og-image.png", // Ensure this exists in public/
        width: 1200,
        height: 630,
        alt: "StackX — We build, validate, and scale business",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StackX — We build, validate, and scale business",
    description: "High-performance web development and automation at unbeatable costs.",
    images: ["/og-image.png"],
  },
  other: {
    "search:opensearch": "/opensearch.xml",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "StackX",
              url: "https://stackx.co.in",
              logo: "https://stackx.co.in/StackXhero.svg",
              description: "Professional software development, business automation, and ad tech solutions at unbeatable costs.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Visakhapatnam",
                addressRegion: "Andhra Pradesh",
                addressCountry: "IN",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-93478-58844",
                contactType: "customer service",
                email: "hello@stackx.co.in",
              },
              sameAs: [
                "https://www.linkedin.com/company/stackxin/",
                "https://www.instagram.com/stack.x_",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: "https://stackx.co.in",
              name: "StackX",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://stackx.co.in/portfolio?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "StackX",
              image: "https://stackx.co.in/og-image.png",
              "@id": "https://stackx.co.in",
              url: "https://stackx.co.in",
              telephone: "+919347858844",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Visakhapatnam",
                addressLocality: "Vizag",
                addressRegion: "Andhra Pradesh",
                postalCode: "530001",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 17.6868,
                longitude: 83.2185,
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "09:00",
                closes: "18:00",
              },
              sameAs: [
                "https://www.linkedin.com/company/stackxin/",
                "https://www.instagram.com/stack.x_",
              ],
            }),
          }}
        />
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
