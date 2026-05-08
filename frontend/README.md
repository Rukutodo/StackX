<p align="center">
  <img src="public/stackx.svg" alt="StackX Logo" width="260" />
</p>

<h1 align="center">StackX — We build, validate, and scale business</h1>

<p align="center">
  A modern, premium, conversion-focused agency website for <strong>StackX</strong> — a software development company specializing in Web Development, Business Automation, and Advertising Technology solutions.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-ff0050?logo=framer" alt="Framer Motion" />
</p>

---

## 📑 Quick Navigation

<p align="center">
  <a href="#-project-description">Description</a> · 
  <a href="#-features">Features</a> · 
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> · 
  <a href="#-project-structure">Project Structure</a> · 
  <a href="#-pages-overview">Pages Overview</a> · 
  <a href="#-reusable-components">Components</a> · 
  <a href="#-design-system">Design System</a> · 
  <a href="#-getting-started">Getting Started</a> · 
  <a href="#-api-overview">API</a> · 
  <a href="#-seo">SEO</a> · 
  <a href="#%E2%99%BF%EF%B8%8F-accessibility">Accessibility</a> · 
  <a href="#%E2%9A%A0%EF%B8%8F-notes--limitations">Notes</a>
</p>

---

## 📖 Project Description

StackX is a premium SaaS agency website designed to showcase the company's services, portfolio, team, and client testimonials. Built with a **dark glassmorphism aesthetic**, it features rich micro-animations, scroll-triggered reveals, a custom animated cursor, and a fully responsive layout across all devices. The website is engineered as a conversion funnel — guiding visitors from the hero section through social proof, service details, and case studies toward the consultation form.

> **Note:** The frontend connects to a Node.js backend API for managing services and portfolio projects. Forms (contact, careers) remain frontend-only with client-side validation until further backend integration.

---

## ✨ Features

### Core
- **10 fully-designed pages** — Home, Services, About, Portfolio, Careers, Testimonials, Contact, dynamic case studies, Privacy Policy, and Terms of Service
- **Responsive design** — Mobile-first, optimized for 375px to 1280px+ screens
- **Dark mode** — Glassmorphism UI with deep purple/cyan accents

### UX & Animations
- **Custom animated cursor** — Dual-ring cursor with spring physics, hover/click states, and automatic touch-device fallback
- **Scroll-triggered animations** — Framer Motion `whileInView` viewport reveals on every section
- **Animated counters** — Scroll-triggered count-up stats using `requestAnimationFrame`
- **3D tilt cards** — `rotateX`/`rotateY` hover transforms on service cards
- **Testimonial carousel** — Auto-play with manual navigation and dot indicators
- **Floating shapes** — CSS animated decorative shapes in hero sections
- **Marquee client logos** — Infinite horizontal scroll strip
- **Expandable accordions** — Animated expand/collapse on services and job listings
- **Leadership section** — Compact (homepage) and expanded (about page) variants with real team photos

### Forms & Validation
- **Career application form** — Full name, email, phone, position, resume upload, portfolio link, LinkedIn, cover letter with validation
- **Contact/consultation form** — Name, email, phone, company, service interest, budget range, project description, timeline, reCAPTCHA checkbox
- **Client-side validation** — Real-time error messages and success confirmation states

### SEO & Accessibility
- **Page-level metadata** — Title, description, and OpenGraph tags on every route via Next.js Metadata API
- **Semantic HTML5** — `<nav>`, `<main>`, `<section>`, `<footer>` structure
- **Single `<h1>` per page** with proper heading hierarchy
- **ARIA labels** — On icon-only buttons, menu toggles, social links, carousel controls
- **Focus-visible outlines** — Purple ring on all interactive elements
- **Keyboard navigable** — Full keyboard support throughout
- **Zero-layout-shift fonts** — `next/font/google` for Poppins + Inter

---

## 🛠️ Tech Stack

| Layer         | Technology                                                                 |
| ------------- | -------------------------------------------------------------------------- |
| **Framework** | [Next.js 16](https://nextjs.org/) — App Router, TypeScript, Server/Client components |
| **UI Library**| [React 19](https://react.dev/)                                            |
| **Styling**   | [Tailwind CSS v4](https://tailwindcss.com/) with custom design tokens via `@theme inline` |
| **Animations**| [Framer Motion 12](https://www.framer.com/motion/) — Scroll reveals, layout animations, spring physics |
| **Icons**     | [React Icons](https://react-icons.github.io/react-icons/) — HeroIcons (`Hi*`) + Font Awesome (`Fa*`) |
| **Fonts**     | [Poppins](https://fonts.google.com/specimen/Poppins) (headings) + [Inter](https://fonts.google.com/specimen/Inter) (body) via `next/font/google` |
| **Language**  | [TypeScript 5](https://www.typescriptlang.org/)                           |
| **Linting**   | ESLint 9 with `eslint-config-next`                                         |
| **Deployment**| Vercel-ready / Static export compatible                                     |

---

## 📁 Project Structure

```
stackx-website/
├── public/
│   ├── stackx.svg                 # Full logo
│   ├── StackXMINI.svg             # Favicon / mini logo
│   └── team/                      # Team member photos
│       ├── nuraj.png
│       ├── roshan.jpeg
│       └── venu.jpeg
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout — fonts, metadata, Navbar, Footer, CustomCursor
│   │   ├── globals.css            # Design system — color tokens, glassmorphism, animations
│   │   ├── page.tsx               # Homepage — hero, stats, services, testimonials, CTA
│   │   ├── services/
│   │   │   ├── layout.tsx         # SEO metadata for /services
│   │   │   ├── page.tsx           # Services page (SSR) — fetches from backend
│   │   │   └── ServicesClient.tsx  # Client component — accordions, pricing, tech stacks
│   │   ├── about/
│   │   │   ├── layout.tsx         # SEO metadata for /about
│   │   │   └── page.tsx           # About page — story, team stats, values, timeline, leadership
│   │   ├── portfolio/
│   │   │   ├── layout.tsx         # SEO metadata for /portfolio
│   │   │   ├── page.tsx           # Portfolio page (SSR) — fetches from backend
│   │   │   ├── PortfolioClient.tsx # Client component — project grid, category filters
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # Dynamic case study page — fetches by slug
│   │   ├── careers/
│   │   │   ├── layout.tsx         # SEO metadata for /careers
│   │   │   └── page.tsx           # Careers — benefits, job listings, application form
│   │   ├── testimonials/
│   │   │   ├── layout.tsx         # SEO metadata for /testimonials
│   │   │   └── page.tsx           # Testimonials — 8-card grid, average rating
│   │   ├── contact/
│   │   │   ├── layout.tsx         # SEO metadata for /contact
│   │   │   └── page.tsx           # Contact — consultation form, info sidebar
│   │   ├── privacy-policy/
│   │   │   └── page.tsx           # Privacy Policy — static legal page with metadata
│   │   └── terms-of-service/
│   │       └── page.tsx           # Terms of Service — static legal page with metadata
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Sticky navbar — backdrop-blur, scroll detection, mobile hamburger menu
│   │   │   └── Footer.tsx         # Multi-column footer — nav links, contact info, social icons
│   │   ├── sections/
│   │   │   └── LeadershipSection.tsx  # Team section — compact (home) & expanded (about) variants
│   │   ├── admin/modals/
│   │   │   ├── ServiceCategoryModal.tsx  # Admin modal — service CRUD form
│   │   │   └── PortfolioProjectModal.tsx # Admin modal — portfolio CRUD + image upload + case study
│   │   └── ui/
│   │       ├── index.tsx          # Reusable UI primitives (SectionHeading, GlassCard, Button, etc.)
│   │       └── CustomCursor.tsx   # Custom animated cursor with spring physics
│   └── context/                   # Auth context for admin authentication
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── README.md
```

---

## 📄 Pages Overview

| Route | Page | Highlights |
| ----- | ---- | ---------- |
| `/` | **Homepage** | Hero with animated gradient background, floating shapes, 2 CTAs · Scroll-triggered stat counters (150+ projects, 80+ clients, 99.9% uptime, 40% cost savings) · Client logo marquee · 3 glassmorphism service cards with 3D tilt · 4 "Why StackX" value cards · Testimonial carousel · CTA banner |
| `/services` | **Services** | 3 service categories (Web Dev, Automation, Ad Tech) · Expandable accordion sub-services · Tech stack badges · Starting-from pricing · Related case study links · "Get a Quote" CTA |
| `/about` | **About Us** | Company story · Team stats grid (25+ members, 8+ countries) · Mission & Vision cards · Core values · Milestone timeline (2020–2025) · Expanded leadership section with zig-zag layout |
| `/portfolio` | **Portfolio** | SSR-fetched from backend API · Filterable project grid (dynamic categories) · Project cards with uploaded images, tech stacks, results, featured badges · "View Details" links for case studies |
| `/portfolio/[slug]` | **Case Study** | Dynamic route fetching by slug · Problem & solution cards · Result metrics · Technologies used · Key features checklist · Client testimonial · Works for any project with case study data |
| `/careers` | **Careers** | Benefits overview (Remote-First, Growth, Flexible Hours, Competitive Pay) · SSR Job listings fetched from backend API · Full application form with validation and resume upload to backend |
| `/testimonials` | **Testimonials** | 8 testimonial cards in 3-column grid · Star ratings · Project type badges · Average rating display (4.9/5) |
| `/contact` | **Contact** | Lead-generation form with service interest, budget range, timeline, reCAPTCHA · Contact info sidebar · 2-hour response time guarantee |
| `/privacy-policy` | **Privacy Policy** | Full privacy policy with data collection, usage, cookies, and contact sections |
| `/terms-of-service` | **Terms of Service** | Full terms covering usage, intellectual property, liability, and governing law |

---

## 🧩 Reusable Components

| Component | File | Description |
| --------- | ---- | ----------- |
| `SectionHeading` | `ui/index.tsx` | Badge + title + subtitle with scroll-reveal animation |
| `GlassCard` | `ui/index.tsx` | Glassmorphism card with optional hover glow effect |
| `Button` | `ui/index.tsx` | 3 variants — `primary` (gradient), `secondary` (subtle), `outline` |
| `AnimatedCounter` | `ui/index.tsx` | Scroll-triggered count-up with configurable duration |
| `TestimonialCard` | `ui/index.tsx` | Star rating, feedback quote, client info, project type badge |
| `CustomCursor` | `ui/CustomCursor.tsx` | Dual-ring animated cursor with spring physics and hover/click states |
| `LeadershipSection` | `sections/LeadershipSection.tsx` | Team display — `compact` (homepage image cards) and `expanded` (about page zig-zag) |
| `Navbar` | `layout/Navbar.tsx` | Sticky with backdrop-blur, scroll detection, mobile hamburger with Framer Motion |
| `Footer` | `layout/Footer.tsx` | Multi-column with nav links, contact info, social icons, copyright |

---

## 🎨 Design System

### Color Palette

| Token | Hex | Usage |
| ----- | --- | ----- |
| `background` | `#0A0A0F` | Dark page background |
| `foreground` | `#EDEDED` | Primary text color |
| `primary` | `#8B5CF6` | Purple — primary actions, accents |
| `primary-light` | `#A78BFA` | Light purple — highlights, links |
| `primary-deep` | `#6D28D9` | Deep purple — gradients |
| `accent` | `#06B6D4` | Cyan — secondary accent |
| `surface` | `#13131A` | Card / section backgrounds |
| `muted` | `#9CA3AF` | Secondary / placeholder text |
| `success` | `#10B981` | Success states |
| `error` | `#EF4444` | Error states |
| `warning` | `#F59E0B` | Star ratings, warnings |

### UI Effects

- **Glassmorphism** — Semi-transparent cards with `backdrop-blur(20px)` and subtle purple borders
- **Gradient borders** — CSS `mask-composite` based gradient border technique
- **Gradient text** — Purple-to-cyan gradient text for headings and highlights
- **3D tilt cards** — `rotateX`/`rotateY` hover transforms on service cards
- **Floating shapes** — CSS keyframe animated decorative shapes in hero sections
- **Marquee** — Infinite horizontal scroll logo strip (`30s linear infinite`)
- **Pulse glow** — Subtle box-shadow animation on primary CTA buttons
- **Scroll reveal** — Framer Motion `whileInView` viewport-triggered fade/slide animations
- **Custom scrollbar** — Slim 6px purple scrollbar on WebKit browsers
- **Selection highlight** — Purple-tinted text selection

### Typography

| Usage | Font | Weights |
| ----- | ---- | ------- |
| Headings | Poppins | 400, 500, 600, 700, 800 |
| Body | Inter | Regular (variable) |

### Responsive Breakpoints

| Breakpoint | Width | Layout |
| ---------- | ----- | ------ |
| Mobile | 375px+ | Single column, hamburger menu |
| Tablet | 640px+ / 768px+ | 2-column grids |
| Desktop | 1024px+ | Full layout, side-by-side sections |
| Wide | 1280px+ | Max-width container |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** (bundled with Node.js)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

This generates an optimized production build in the `.next/` directory.

### Start Production Server

```bash
npm run start
```

### Lint

```bash
npm run lint
```

---

## 📡 API Overview

> **Status:** Services and Portfolio are managed via the Node.js backend API.

The website interacts with a companion Node.js backend to fetch dynamic content. Other sections (testimonials, job listings, team info) remain static arrays defined within page components but are planned for future backend migration.

| Area | Current State | To Connect |
| ---- | ------------- | ---------- |
| **Services** | ✅ Fetched from Backend API / Admin Dashboard | Connected |
| **Portfolio** | ✅ Fetched from Backend API / Admin Dashboard | Connected (with image uploads + case studies) |
| **Careers (Jobs)** | ✅ Fetched from Backend API / Admin Dashboard | Connected (with full CRUD) |
| **Career Application** | ✅ Submits to Backend API / Admin Dashboard | Connected (with resume upload) |
| **Dashboard Stats** | ✅ Real-time data aggregation via Backend API | Connected (fetching live counts + recent activity) |
| **Contact Form** | Client-side validation + success UI | Add Next.js API route → email service (Resend, SendGrid) or form backend (Formspree) |
| **reCAPTCHA** | Checkbox placeholder | Integrate Google reCAPTCHA v2/v3 |
| **Testimonials** | ✅ Fetched from Backend API / Admin Dashboard | Connected |

---

## 📊 SEO

### Implemented
- **Metadata API** — Page-level `<title>` and `<meta description>` on most routes via Next.js `metadata` export and a root title template (`%s | StackX`)
- **Partial OpenGraph** — `og:title`, `og:description`, `og:type`, and `og:site_name` set on root layout (no `og:image` or `metadataBase` yet)
- **Semantic HTML5** — `<nav>`, `<main>`, `<section>`, `<footer>` throughout
- **Single `<h1>`** per page with proper heading hierarchy (h1 → h2 → h3)
- **ARIA labels** on interactive elements
- **Zero-layout-shift fonts** — `next/font/google` for optimized font loading
- **Keywords meta** — Relevant keywords defined in root metadata

### Known Gaps
- **No `robots.txt`** — Search engines receive no crawl directives
- **No `sitemap.ts`** — Pages must be manually discovered by crawlers
- **No `metadataBase`** — OpenGraph URLs are relative and break on social shares
- **No `og:image`** — Social media link previews render blank cards
- **No Twitter card metadata** — Poor appearance when shared on X/Twitter
- **No structured data (JSON-LD)** — Missing Organization, LocalBusiness, JobPosting, and Review schemas that enable rich results in Google
- **`/portfolio/[slug]` is client-rendered** — Search engines cannot read case study titles or descriptions; needs `generateMetadata()` + SSR conversion
- **Duplicate metadata** — `/services`, `/portfolio`, and `/testimonials` define metadata in both `layout.tsx` and `page.tsx`
- **No canonical URLs** — Duplicate content risk if the site is reachable at multiple URLs

---

## ♿ Accessibility

- **Focus-visible outlines** — 2px purple ring on all interactive elements
- **ARIA labels** — On icon-only buttons (menu toggle, social links, carousel controls)
- **Semantic heading hierarchy** — h1 → h2 → h3
- **Color contrast** — Meets WCAG 2.1 AA standards
- **Keyboard navigable** — Full keyboard support throughout the site
- **Touch device detection** — Custom cursor auto-disabled on mobile/tablet

---

## ⚠️ Notes & Limitations

- **Forms are mostly frontend-only** — Contact form validates on the client and shows success states, but does not submit to any backend yet. (Career application form is now fully connected to the backend).
- **reCAPTCHA** — Implemented as a checkbox placeholder; replace with Google reCAPTCHA v2/v3 for production
- **Client logos** — Text-based placeholders in the marquee; replace with actual SVG/PNG logos
- **Project thumbnails** — Gradient placeholders; replace with real project screenshots
- **Social links** — Footer social icons link to `#`; update with actual social media URLs
- **SEO infrastructure incomplete** — `robots.txt`, `sitemap.ts`, `metadataBase`, `og:image`, and JSON-LD structured data are not yet implemented (see SEO section for full list)
- **Case study pages not indexable** — `/portfolio/[slug]` uses client-side rendering; metadata is not readable by search engine crawlers until converted to SSR with `generateMetadata()`

---

## 📜 License

© 2025 StackX. All rights reserved.
