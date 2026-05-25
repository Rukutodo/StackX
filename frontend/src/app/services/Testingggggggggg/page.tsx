"use client";
import { motion } from "framer-motion";
import { LuCode as Code, LuArrowRight as ArrowRight } from "react-icons/lu";
import Link from "next/link";

export default function TestinggggggggggPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8 border border-primary/20">
            <Code className="w-10 h-10 text-primary-light" />
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 italic underline decoration-primary/30">Testingggggggggg</h1>
          <p className="text-xl text-muted max-w-2xl mx-auto mb-10">Testingggggggggg</p>
          <div className="p-12 rounded-3xl glass-card border-white/5 bg-white/[0.02] text-left">
            <h2 className="text-2xl font-bold mb-4 text-white">Project Overview</h2>
            <p className="text-muted leading-relaxed">This page was automatically generated for the <strong>Testingggggggggg</strong> service.</p>
          </div>
          <div className="mt-12 flex justify-center gap-4">
             <Link href="/contact" className="px-8 py-4 rounded-xl bg-primary text-white font-semibold flex items-center gap-2">
                Get Started <ArrowRight className="w-5 h-5" />
             </Link>
             <Link href="/services" className="px-8 py-4 rounded-xl glass-card text-white font-semibold">Back to Services</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}