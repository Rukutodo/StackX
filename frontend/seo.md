# StackX — SEO Architecture Documentation

> **Domain**: `https://stackx.co.in`  
> **Stack**: Next.js 16 (App Router) · React 19 · TailwindCSS 4 · Framer Motion  
> **Last Updated**: May 2026

---

## Table of Contents

1. [Metadata Architecture](#1-metadata-architecture)
2. [Canonical URLs](#2-canonical-urls)
3. [Open Graph & Social Cards](#3-open-graph--social-cards)
4. [JSON-LD Structured Data](#4-json-ld-structured-data)
5. [Sitemap](#5-sitemap)
6. [Robots.txt & AI Crawler Rules](#6-robotstxt--ai-crawler-rules)
7. [Rendering Strategy (SSR / ISR / SSG)](#7-rendering-strategy-ssr--isr--ssg)
8. [Image Optimization](#8-image-optimization)
9. [Internal Linking & Navigation](#9-internal-linking--navigation)
10. [Font Optimization](#10-font-optimization)
11. [Semantic HTML & Accessibility](#11-semantic-html--accessibility)
12. [AI Search Optimization (LLM SEO)](#12-ai-search-optimization-llm-seo)
13. [Technical SEO Files](#13-technical-seo-files)
14. [Per-Page Metadata Reference](#14-per-page-metadata-reference)

---

## 1. Metadata Architecture

### How It Works

Next.js App Router uses the **Metadata API** — you export a `metadata` object (or `generateMetadata` function for dynamic routes) from any `page.tsx` or `layout.tsx`. Metadata is **server-rendered** directly into the HTML `<head>`, making it fully crawlable without JavaScript.

### Where It Lives

| Layer | File | Purpose |
|---|---|---|
| **Root (global)** | `src/app/layout.tsx` | Default title, description, keywords, OG, Twitter, icons |
| **Per page (static)** | Each `src/app/*/page.tsx` | Page-specific title, description, canonical |
| **Per page (dynamic)** | `src/app/portfolio/[slug]/page.tsx` | Uses `generateMetadata()` for API-driven metadata |

### Key Implementation Details

**Root layout** (`src/app/layout.tsx`):
```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://stackx.co.in"),
  title: {
    default: "StackX — We build, validate, and scale business",
    template: "%s | StackX",  // Child pages auto-append brand
  },
  description: "StackX delivers high-performance web development...",
  keywords: ["web development", "software development", ...],
};
```

- **`metadataBase`** — Resolves all relative URLs (canonicals, OG images) to `https://stackx.co.in`.
- **`title.template`** — When a child page sets `title: "About Us"`, the rendered `<title>` becomes `About Us | StackX`.
- **`title.default`** — Used when no child page overrides the title.

**Dynamic metadata** (`src/app/portfolio/[slug]/page.tsx`):
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  return {
    title: `${project.title} | Case Study`,
    description: project.description,
    alternates: { canonical: `/portfolio/${slug}` },
    openGraph: { ... },
    twitter: { ... },
  };
}
```

This fetches the project from the API at build/request time and generates unique metadata per portfolio slug.

---

## 2. Canonical URLs

### How It Works

Every page defines a self-referencing canonical URL via `alternates.canonical`. Since `metadataBase` is set to `https://stackx.co.in`, relative paths like `/about` resolve to `https://stackx.co.in/about`.

### Where It Lives

| Page | File | Canonical Value |
|---|---|---|
| Homepage | `src/app/page.tsx` | `/` |
| About | `src/app/about/page.tsx` | `/about` |
| Services | `src/app/services/page.tsx` | `/services` |
| Portfolio | `src/app/portfolio/page.tsx` | `/portfolio` |
| Portfolio Detail | `src/app/portfolio/[slug]/page.tsx` | `/portfolio/${slug}` (dynamic) |
| Careers | `src/app/careers/page.tsx` | `/careers` |
| Testimonials | `src/app/testimonials/page.tsx` | `/testimonials` |
| Contact | `src/app/contact/page.tsx` | `/contact` |
| Privacy Policy | `src/app/privacy-policy/page.tsx` | `/privacy-policy` |
| Terms of Service | `src/app/terms-of-service/page.tsx` | `/terms-of-service` |

### Why It Matters

Canonical tags tell Google which version of a URL is the "master copy." Without them, query-parameter variants or trailing-slash variants could be indexed as separate pages, diluting ranking signals.

---

## 3. Open Graph & Social Cards

### How It Works

Open Graph (`og:*`) and Twitter Card meta tags control how the site appears when shared on LinkedIn, Twitter/X, Facebook, Slack, Discord, etc.

### Where It Lives

**Global defaults** — `src/app/layout.tsx`:
```typescript
openGraph: {
  title: "StackX — We build, validate, and scale business",
  description: "High-performance web solutions...",
  url: "https://stackx.co.in",
  siteName: "StackX",
  images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  locale: "en_US",
  type: "website",
},
twitter: {
  card: "summary_large_image",
  title: "StackX — We build, validate, and scale business",
  description: "High-performance web development...",
  images: ["/og-image.png"],
},
```

**Dynamic OG** — `src/app/portfolio/[slug]/page.tsx` overrides OG tags per project with the project's own title, description, and image.

### Image Spec

- **Dimensions**: 1200×630px (standard for `summary_large_image`)
- **File**: `public/og-image.png`

---

## 4. JSON-LD Structured Data

### How It Works

JSON-LD scripts are injected directly into the server-rendered HTML `<body>`. Google, Bing, and AI systems parse these to understand the entity relationships on the site.

### Where It Lives

#### Global Schemas — `src/app/layout.tsx`

A single `@graph` array containing two connected entities:

**Organization** (`@id: "#organization"`):
- Business name, URL, logo, description
- Address, geo coordinates (Visakhapatnam)
- Contact point (phone, email)
- Opening hours (Mon–Fri, 9am–6pm)
- Social profiles (LinkedIn, Instagram)

**WebSite** (`@id: "#website"`):
- Linked to Organization via `publisher.@id`
- `SearchAction` enabling Google Sitelinks Search Box targeting `/portfolio?q=`

#### Portfolio Detail Schemas — `src/app/portfolio/[slug]/page.tsx`

**BreadcrumbList**:
```
Home → Portfolio → {Project Title}
```
Enables breadcrumb rich results in Google SERPs.

**CreativeWork**:
- Project name, description, URL, image
- `author` and `publisher` reference back to `#organization` via `@id`

### Schema Relationship Diagram

```
Organization (#organization)
  ├── WebSite (#website)  →  publisher: #organization
  └── CreativeWork (per portfolio page)
        ├── author: #organization
        └── publisher: #organization
```

---

## 5. Sitemap

### How It Works

Next.js generates `/sitemap.xml` dynamically at build time (and re-generates on ISR revalidation) by exporting an async function from `sitemap.ts`.

### Where It Lives

`src/app/sitemap.ts`

### What It Contains

**Static Routes** (9 pages):
```
/, /about, /services, /portfolio, /careers,
/testimonials, /contact, /privacy-policy, /terms-of-service
```
- `priority`: Homepage = 1.0, others = 0.8
- `changeFrequency`: weekly
- `lastModified`: Fixed date (`2026-05-01`) — **not** `new Date()`, to prevent Google from ignoring stale lastmod signals

**Dynamic Routes** (portfolio projects):
- Fetched from `GET /api/portfolio`
- Each project mapped to `/portfolio/{slug}`
- `lastModified`: Uses `project.updatedAt` from the database, falling back to the static date
- `priority`: 0.6
- `changeFrequency`: monthly

---

## 6. Robots.txt & AI Crawler Rules

### How It Works

The `robots.ts` file generates `/robots.txt` dynamically via the Next.js Metadata Route API. This replaced a static `public/robots.txt` to avoid build conflicts.

### Where It Lives

`src/app/robots.ts`

### Rules Defined

| User-Agent | Allow | Disallow |
|---|---|---|
| `*` (all crawlers) | `/` | `/admin/`, `/api/` |
| `GPTBot` (ChatGPT) | `/`, `/llms.txt` | `/admin/`, `/api/` |
| `ChatGPT-User` | `/`, `/llms.txt` | `/admin/`, `/api/` |
| `ClaudeBot` (Anthropic) | `/`, `/llms.txt` | `/admin/`, `/api/` |
| `PerplexityBot` | `/`, `/llms.txt` | `/admin/`, `/api/` |
| `Google-Extended` (Gemini) | `/`, `/llms.txt` | `/admin/`, `/api/` |

The sitemap is declared at `https://stackx.co.in/sitemap.xml`.

### Why AI-Specific Rules Exist

AI crawlers (GPTBot, ClaudeBot, etc.) are explicitly allowed so that LLMs like ChatGPT, Claude, and Perplexity can cite and surface StackX content in AI search results. The `/llms.txt` path is also explicitly allowed to make sure AI bots can find the structured content summary.

---

## 7. Rendering Strategy (SSR / ISR / SSG)

### How It Works

Next.js App Router uses React Server Components by default. Every `page.tsx` file is a Server Component unless marked with `"use client"`. Server-rendered HTML is fully crawlable.

### Where Each Strategy Is Used

| Page | Strategy | Revalidation | File |
|---|---|---|---|
| Homepage | SSG | — | `src/app/page.tsx` (server) → `HomePageClient.tsx` (client) |
| About | SSG | — | `src/app/about/page.tsx` |
| Services | ISR | 1 hour | `src/app/services/page.tsx` (`revalidate: 3600`) |
| Portfolio | ISR | 1 hour | `src/app/portfolio/page.tsx` (`revalidate: 3600`) |
| Portfolio Detail | ISR + SSG | 1 hour | `src/app/portfolio/[slug]/page.tsx` (`revalidate: 3600`, `generateStaticParams`) |
| Careers | ISR | 1 hour | `src/app/careers/page.tsx` (`revalidate: 3600`) |
| Testimonials | ISR | 1 minute | `src/app/testimonials/page.tsx` (`revalidate: 60`) |
| Contact | SSG | — | `src/app/contact/page.tsx` |
| Privacy / Terms | SSG | — | Static content, no API calls |

### Client vs Server Component Boundary

All `page.tsx` files are **Server Components** (SSR/SSG). Interactive parts are isolated into `*Client.tsx` files marked with `"use client"` (e.g., `HomePageClient.tsx`, `PortfolioClient.tsx`). This means:

- **Crawlers see full HTML** in the initial response (no JavaScript needed)
- **Users get interactivity** via client-side hydration

---

## 8. Image Optimization

### How It Works

Next.js `<Image>` component automatically:
- Converts images to WebP/AVIF formats
- Generates responsive `srcset` variants
- Lazy-loads below-the-fold images
- Preloads images marked with `priority`

### Where It Lives

**Config** — `next.config.ts`:
```typescript
images: {
  remotePatterns: [
    { protocol: "http", hostname: "localhost", port: "4000" },
    { protocol: "https", hostname: "**.stackx.co.in" },
    { protocol: "https", hostname: "stackx.co.in" },
  ],
},
```

**Usage**:

| Component | Image Type | Props Used |
|---|---|---|
| `HomePageClient.tsx` — Hero (mobile) | Local SVG | `priority`, `width`, `height` |
| `HomePageClient.tsx` — Hero (desktop) | Local SVG | `priority`, `width`, `height` |
| `Navbar.tsx` — Logo | Local SVG | `priority`, `width`, `height` |
| `Footer.tsx` — Logo | Local SVG | `width`, `height` |
| `PortfolioClient.tsx` — Card thumbnails | Remote API | `fill`, `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"` |
| `PortfolioDetailClient.tsx` — Hero image | Remote API | `fill`, `sizes` |
| `PortfolioDetailClient.tsx` — Gallery carousel | Remote API | `fill`, `sizes` |
| `PortfolioDetailClient.tsx` — Thumbnails | Remote API | `fill`, `sizes="80px"` |

---

## 9. Internal Linking & Navigation

### How It Works

All internal links use the Next.js `<Link>` component, which enables **client-side navigation** (no full page reload). This preserves React state, avoids re-parsing JS bundles, and improves Core Web Vitals.

### Where It Lives

| Component | File | Links |
|---|---|---|
| **Navbar** | `src/components/layout/Navbar.tsx` | Home, Services, About, Portfolio, Careers, Testimonials, Contact + CTA button |
| **Footer** | `src/components/layout/Footer.tsx` | Company links, Services links, Privacy, Terms |
| **Button (CTA)** | `src/components/ui/index.tsx` | All CTA buttons use `<Link>` when `href` is provided |
| **Portfolio cards** | `src/app/portfolio/PortfolioClient.tsx` | "View Details" links to `/portfolio/{slug}` |
| **Portfolio detail** | `src/app/portfolio/[slug]/PortfolioDetailClient.tsx` | "Back to Portfolio" link |

### Link Equity Flow

```
Homepage
 ├── /services
 ├── /about
 ├── /portfolio
 │    ├── /portfolio/project-a
 │    ├── /portfolio/project-b
 │    └── ...
 ├── /careers
 ├── /testimonials
 ├── /contact
 ├── /privacy-policy
 └── /terms-of-service
```

All pages are reachable within **2 clicks** from the homepage via the navbar.

---

## 10. Font Optimization

### How It Works

Next.js `next/font/google` self-hosts Google Fonts. Fonts are downloaded at build time and served from the same domain — no external requests to `fonts.googleapis.com` at runtime.

### Where It Lives

`src/app/layout.tsx`:
```typescript
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",        // Prevents invisible text during load (FOIT)
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});
```

### Why It Matters

- **`display: "swap"`** — Text is immediately visible with a fallback font, then swaps to the custom font once loaded. This prevents CLS (Cumulative Layout Shift) penalties.
- **Self-hosting** — Eliminates render-blocking external CSS requests. Fonts are served with optimal caching headers from the same CDN as the site.

---

## 11. Semantic HTML & Accessibility

### How It Works

The component tree uses semantic HTML5 elements that help search engines understand the page structure.

### Where It Lives

`src/app/RootShell.tsx`:
```tsx
<Navbar />                         ← renders <nav>
<main className="min-h-screen">    ← semantic <main> landmark
  {children}
</main>
<Footer />                         ← renders <footer>
```

### Semantic Elements Used

| Element | Location | Purpose |
|---|---|---|
| `<html lang="en">` | `layout.tsx` | Document language for search engines and screen readers |
| `<nav>` | `Navbar.tsx` | Navigation landmark |
| `<main>` | `RootShell.tsx` | Primary content area |
| `<footer>` | `Footer.tsx` | Footer landmark |
| `<section>` | All page components | Content sectioning |
| `<h1>` | Each page (1 per page) | Primary heading |
| `<h2>` | Section headings | Via `SectionHeading` component |
| `<h3>` | Sub-sections | Card titles, feature titles |
| `<ul>/<li>` | Footer links, feature lists | List semantics |
| `aria-label` | Navbar toggle, testimonial nav | Screen reader accessibility |

### Focus Styles

`src/app/globals.css`:
```css
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

---

## 12. AI Search Optimization (LLM SEO)

### How It Works

AI search engines (ChatGPT, Perplexity, Gemini, Claude) crawl websites to build knowledge. StackX provides a dedicated `llms.txt` file that gives AI a concise, structured summary of the business.

### Where It Lives

`public/llms.txt`:
```markdown
# StackX

StackX is a professional software development agency based in
Visakhapatnam, India. We specialize in web development, business
automation, and ad tech solutions.

## Core Services
- Web Development
- Business Automation
- Ad Tech Solutions

## Contact Information
- Website: https://stackx.co.in
- Email: hello@stackx.co.in
- Phone: +91 93478 58844

## Technologies
- React, Next.js, TypeScript, Node.js, TailwindCSS, MongoDB/PostgreSQL.
```

### How AI Bots Find It

1. `robots.ts` explicitly allows `/llms.txt` for GPTBot, ClaudeBot, PerplexityBot, etc.
2. The file is served as static content from `/llms.txt`
3. AI crawlers can parse the Markdown structure for entity extraction

---

## 13. Technical SEO Files

All files served from `public/`:

| File | Path | Purpose |
|---|---|---|
| `llms.txt` | `/llms.txt` | AI crawler content summary |
| `ads.txt` | `/ads.txt` | Authorized digital sellers (placeholder) |
| `humans.txt` | `/humans.txt` | Team and technology credits |
| `opensearch.xml` | `/opensearch.xml` | Browser search bar integration — points to `/portfolio?q={searchTerms}` |
| `favicon.ico` | `/favicon.ico` | Browser tab icon |
| `StackXMINI.svg` | `/StackXMINI.svg` | SVG favicon + apple touch icon |

### OpenSearch

`public/opensearch.xml` lets browsers add StackX as a search engine:
```xml
<Url type="text/html" template="https://stackx.co.in/portfolio?q={searchTerms}"/>
```

---

## 14. Per-Page Metadata Reference

| Route | Title | Description | Canonical | Rendering |
|---|---|---|---|---|
| `/` | StackX — We build, validate, and scale business | High-performance web development, business automation, and ad tech solutions in Vizag... | `/` | SSG |
| `/about` | About Us \| StackX | Learn about StackX's mission, vision, and the team... | `/about` | SSG |
| `/services` | Services \| StackX | Explore StackX's web development, business automation, and ad tech services... | `/services` | ISR (1h) |
| `/portfolio` | Portfolio & Case Studies \| StackX | Explore StackX's portfolio of successful web development... | `/portfolio` | ISR (1h) |
| `/portfolio/[slug]` | {Project Title} \| Case Study \| StackX | {project.description} | `/portfolio/{slug}` | ISR (1h) + SSG |
| `/careers` | Careers \| StackX | Join StackX and help us build the next generation... | `/careers` | ISR (1h) |
| `/testimonials` | Testimonials \| StackX | Read what our clients say about StackX... | `/testimonials` | ISR (1m) |
| `/contact` | Contact Us \| StackX | Get a free consultation with StackX... | `/contact` | SSG |
| `/privacy-policy` | Privacy Policy \| StackX | Learn how StackX collects, uses, and protects... | `/privacy-policy` | SSG |
| `/terms-of-service` | Terms of Service \| StackX | Read the terms and conditions governing... | `/terms-of-service` | SSG |

---

## Architecture Diagram

```
src/app/
├── layout.tsx              ← Global metadata, JSON-LD (@graph), fonts, icons
├── page.tsx                ← Homepage metadata + canonical
├── robots.ts               ← Dynamic robots.txt (AI crawler rules)
├── sitemap.ts              ← Dynamic XML sitemap (static + API routes)
├── globals.css             ← Focus-visible styles, scroll-behavior: smooth
├── RootShell.tsx           ← <nav>, <main>, <footer> semantic structure
├── HomePageClient.tsx      ← "use client" — hero, animations, testimonials
├── about/page.tsx          ← Static metadata + canonical
├── services/page.tsx       ← ISR metadata + canonical
├── portfolio/
│   ├── page.tsx            ← ISR metadata + canonical
│   └── [slug]/page.tsx     ← generateMetadata() + BreadcrumbList + CreativeWork JSON-LD
├── careers/page.tsx        ← ISR metadata + canonical
├── testimonials/page.tsx   ← ISR metadata + canonical
├── contact/page.tsx        ← Static metadata + canonical
├── privacy-policy/page.tsx ← Static metadata + canonical
└── terms-of-service/page.tsx ← Static metadata + canonical

next.config.ts              ← Remote image patterns for Image optimization
public/
├── llms.txt                ← AI search optimization
├── ads.txt                 ← Authorized sellers
├── humans.txt              ← Team credits
├── opensearch.xml          ← Browser search integration
├── StackXMINI.svg          ← Favicon
└── StackXhero.svg          ← Hero logo
```
