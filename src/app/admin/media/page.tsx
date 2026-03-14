"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HiUpload, HiTrash, HiPhotograph, HiFilm, HiDocument, HiSearch } from "react-icons/hi";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  AdminButton,
} from "@/components/admin/ui";

const mediaFiles = [
  { id: 1, name: "hero-banner.jpg", type: "image", size: "2.4 MB", date: "Mar 12, 2026", dimensions: "1920×1080" },
  { id: 2, name: "team-nuraj.png", type: "image", size: "580 KB", date: "Mar 10, 2026", dimensions: "800×800" },
  { id: 3, name: "team-roshan.jpeg", type: "image", size: "420 KB", date: "Mar 10, 2026", dimensions: "800×800" },
  { id: 4, name: "team-venu.jpeg", type: "image", size: "390 KB", date: "Mar 10, 2026", dimensions: "800×800" },
  { id: 5, name: "stackx-logo.svg", type: "image", size: "7 KB", date: "Feb 28, 2026", dimensions: "SVG" },
  { id: 6, name: "stackx-mini.svg", type: "image", size: "12 KB", date: "Feb 28, 2026", dimensions: "SVG" },
  { id: 7, name: "case-study-communize.mp4", type: "video", size: "18.2 MB", date: "Feb 20, 2026", dimensions: "1920×1080" },
  { id: 8, name: "service-brochure.pdf", type: "document", size: "3.1 MB", date: "Feb 15, 2026", dimensions: "—" },
  { id: 9, name: "portfolio-autoflow.jpg", type: "image", size: "1.8 MB", date: "Feb 10, 2026", dimensions: "1600×900" },
  { id: 10, name: "portfolio-adpulse.jpg", type: "image", size: "2.1 MB", date: "Feb 8, 2026", dimensions: "1600×900" },
  { id: 11, name: "client-logos.png", type: "image", size: "340 KB", date: "Jan 25, 2026", dimensions: "2400×200" },
  { id: 12, name: "onboarding-guide.pdf", type: "document", size: "1.5 MB", date: "Jan 15, 2026", dimensions: "—" },
];

const typeIcons: Record<string, typeof HiPhotograph> = {
  image: HiPhotograph,
  video: HiFilm,
  document: HiDocument,
};

const typeColors: Record<string, string> = {
  image: "from-primary/30 to-accent/20 text-primary-light",
  video: "from-red-500/20 to-amber-500/15 text-red-400",
  document: "from-cyan-500/20 to-blue-500/15 text-cyan-400",
};

const filters = ["All", "Images", "Videos", "Documents"];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function MediaAdminPage() {
  const [filter, setFilter] = useState("All");

  const filtered = mediaFiles.filter((f) => {
    if (filter === "All") return true;
    if (filter === "Images") return f.type === "image";
    if (filter === "Videos") return f.type === "video";
    if (filter === "Documents") return f.type === "document";
    return true;
  });

  const totalSize = "30.8 MB";

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            Media Library
          </h1>
          <p className="text-muted text-sm mt-1">{mediaFiles.length} files · {totalSize} total</p>
        </div>
        <AdminButton variant="primary" className="gap-1.5">
          <HiUpload size={16} /> Upload Files
        </AdminButton>
      </motion.div>

      {/* Upload drop zone */}
      <motion.div variants={item}>
        <div className="border-2 border-dashed border-surface-border rounded-2xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
          <HiUpload size={32} className="text-muted/40 mx-auto mb-3" />
          <p className="text-sm text-muted">Drag and drop files here, or <span className="text-primary-light">browse</span></p>
          <p className="text-xs text-muted/50 mt-1">PNG, JPG, SVG, MP4, PDF up to 50MB</p>
        </div>
      </motion.div>

      {/* Filters + Search */}
      <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 text-xs rounded-lg transition-all font-medium cursor-pointer ${
                filter === f
                  ? "bg-primary/15 text-primary-light border border-primary/30"
                  : "bg-white/5 text-muted border border-transparent hover:bg-white/10 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Search files…"
            className="admin-search w-48 pl-9 pr-3 py-1.5 text-xs text-white rounded-lg placeholder:text-muted/60"
          />
        </div>
      </motion.div>

      {/* Media grid */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
        {filtered.map((file) => {
          const Icon = typeIcons[file.type] || HiDocument;
          return (
            <DashboardGlassCard key={file.id} className="p-3 group relative">
              {/* Thumbnail */}
              <div className={`aspect-square rounded-lg bg-gradient-to-br ${typeColors[file.type]} flex items-center justify-center mb-3`}>
                <Icon size={28} className="opacity-60" />
              </div>

              {/* File info */}
              <p className="text-xs text-white font-medium truncate">{file.name}</p>
              <p className="text-[10px] text-muted mt-0.5">{file.size} · {file.dimensions}</p>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"><HiPhotograph size={16} /></button>
                <button className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"><HiTrash size={16} /></button>
              </div>
            </DashboardGlassCard>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
