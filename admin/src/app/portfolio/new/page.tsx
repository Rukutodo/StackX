"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HiArrowLeft } from "react-icons/hi";
import PortfolioForm from "@/components/admin/PortfolioForm";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

export default function NewPortfolioPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/services`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data.map((s: any) => s.title) : []);
    } catch (err) {
      console.error("Failed to load services:", err);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-6">

      {/* Page Header */}
      <div>
        <button onClick={() => router.push("/portfolio")}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition mb-3">
          <HiArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
        </button>
        <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
          Add New Project
        </h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details below to create a new portfolio entry.</p>
      </div>

      {/* Form */}
      <PortfolioForm initial={null} categories={categories} isEdit={false} />
    </motion.div>
  );
}
