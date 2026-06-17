"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function ComingSoon({ title, subtitle, icon }: { title: string; subtitle: string; icon: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
        {title}
      </h1>
      <p className="text-muted text-sm mt-1">{subtitle}</p>

      <div className="admin-glass mt-8 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center text-primary-light mb-5 [&>svg]:w-8 [&>svg]:h-8">
          {icon}
        </div>
        <p className="text-white font-semibold text-lg">Coming Soon</p>
        <p className="text-sm text-muted mt-1 max-w-sm">This module is part of an upcoming phase and will be available shortly.</p>
        <span className="mt-4 text-[11px] px-3 py-1 rounded-full bg-primary/10 text-primary-light border border-primary/20">In development</span>
      </div>
    </motion.div>
  );
}
