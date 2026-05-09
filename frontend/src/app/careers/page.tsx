import CareersClient from "./CareersClient";
import type { JobPosting } from "./CareersClient";
import type { Metadata } from "next";

const SERVER_API = process.env.INTERNAL_API_URL || "http://localhost:4000";

async function getJobs(): Promise<JobPosting[]> {
  try {
    const res = await fetch(`${SERVER_API}/api/jobs`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: "Careers",
  description: "Join StackX and help us build the next generation of business software.",
  alternates: {
    canonical: "/careers",
  },
};

export default async function CareersPage() {
  const jobs = await getJobs();
  return <CareersClient jobs={jobs} />;
}
