"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const PHONE = "919347858844";
const MESSAGE = encodeURIComponent(
  "Hi StackX! I'm interested in your services. Can we discuss my project?"
);
const WA_URL = `https://wa.me/${PHONE}?text=${MESSAGE}`;

export default function WhatsAppCTA() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:block px-4 py-2 rounded-xl text-sm font-medium text-white shadow-lg whitespace-nowrap pointer-events-none"
            style={{
              background: "rgba(19, 19, 26, 0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(37, 211, 102, 0.25)",
            }}
          >
            Chat with us on WhatsApp
          </motion.span>
        )}
      </AnimatePresence>

      {/* Button */}
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative"
      >
        {/* Ping ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping" />

        {/* Glow */}
        <span
          className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(circle, rgba(37, 211, 102, 0.35) 0%, transparent 70%)",
          }}
        />

        {/* Icon circle */}
        <motion.span
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
            boxShadow:
              "0 8px 25px rgba(37, 211, 102, 0.35), 0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          <FaWhatsapp className="text-white text-2xl" />
        </motion.span>
      </a>
    </div>
  );
}
