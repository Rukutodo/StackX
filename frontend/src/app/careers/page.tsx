import CareersClient from "./CareersClient";
import type { JobPosting } from "./CareersClient";

async function getJobs(): Promise<JobPosting[]> {
  try {
    const res = await fetch("http://129.159.236.176:4000/api/jobs", {
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
