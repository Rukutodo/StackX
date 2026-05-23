/**
 * Shared types and icon map for the Services feature.
 * This file provides the ServiceCategory type and ICON_MAP used by admin modals and pages.
 */

import type { ComponentType } from "react";
import {
  HiCode, HiCog, HiChartBar, HiGlobe, HiLightningBolt, HiDatabase,
  HiShieldCheck, HiColorSwatch, HiCurrencyDollar, HiCloud, HiDesktopComputer,
  HiDeviceMobile, HiCube, HiTrendingUp, HiBriefcase, HiSparkles,
  HiTemplate, HiSupport,
} from "react-icons/hi";

/* ── Types ── */
export interface AccordionItem {
  title: string;
  desc: string;
}

export interface CaseStudy {
  title: string;
  href: string;
}

export interface ServiceCategory {
  _id: string;
  slug: string;
  title: string;
  icon?: string;
  tagline: string;
  pricing: string;
  techStack: string[];
  items: AccordionItem[];
  caseStudy: CaseStudy | null;
  status: "active" | "draft";
  order: number;
  featuredProjects: string[];
  testimonials: string[];
}

/* ── All available icons (name → component) ── */
export const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  HiCode, HiCog, HiChartBar, HiGlobe, HiLightningBolt, HiDatabase,
  HiShieldCheck, HiColorSwatch, HiCurrencyDollar, HiCloud, HiDesktopComputer,
  HiDeviceMobile, HiCube, HiTrendingUp, HiBriefcase, HiSparkles,
  HiTemplate, HiSupport,
};
