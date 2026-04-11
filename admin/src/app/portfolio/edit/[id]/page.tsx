"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HiArrowLeft, HiExternalLink } from "react-icons/hi";
import PortfolioForm from "@/components/admin/PortfolioForm";
import type { PortfolioProject } from "@/types/portfolio";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

export default function EditPortfolioPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [projRes, servRes] = await Promise.all([
        fetch(`${API}/api/portfolio/id/${id}`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
        }),
        fetch(`${API}/api/services`),
      ]);

      if (!projRes.ok) { setNotFound(true); return; }

      const proj = await projRes.json();
      const servs = await servRes.json();

      setProject(proj);
      setCategories(Array.isArray(servs) ? servs.map((s: any) => s.title) : []);
    } catch (err) {
      console.error("Failed to load project:", err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 rounded-lg bg-white/5" />
        <div className="h-48 rounded-xl bg-white/5" />
        <div className="h-48 rounded-xl bg-white/5" />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
          <span className="text-2xl">🔍</span>
        </div>
        <h2 className="text-lg font-semibold text-white mb-2">Project Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">The project you&apos;re looking for doesn&apos;t exist or was deleted.</p>
        <button onClick={() => router.push("/portfolio")}
          className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition">
          <HiArrowLeft className="w-4 h-4" /> Back to Portfolio
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-6">

      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <button onClick={() => router.push("/portfolio")}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition mb-3">
            <HiArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
          </button>
          <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            Edit Project
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            {project.title}
          </p>
        </div>
        <a
          href={`/portfolio/${project.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition px-4 py-2 rounded-xl border border-white/[0.08] hover:border-white/20"
        >
          <HiExternalLink className="w-4 h-4" /> Preview
        </a>
      </div>

      {/* Form */}
      <PortfolioForm initial={project} categories={categories} isEdit={true} />
    </motion.div>
  );
}
