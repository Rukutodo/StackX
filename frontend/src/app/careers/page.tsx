import CareersClient from "./CareersClient";
import type { JobPosting } from "./CareersClient";

async function getJobs(): Promise<JobPosting[]> {
  try {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "/api/jobs", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function CareersPage() {
  const jobs = await getJobs();
  return <CareersClient jobs={jobs} />;
}
