"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { HiEye, HiEyeOff, HiLockClosed, HiMail } from "react-icons/hi";
import { TOKEN_KEY } from "@/context/AuthContext";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const e: { email?: string; password?: string } = {};
    if (!email.trim()) e.email = "Email is required";
    if (!password.trim()) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ password: data.message || "Login failed" });
        setIsSubmitting(false);
        return;
      }
      if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
      window.location.href = "/";
    } catch {
      setErrors({ password: "Could not connect to server" });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background glow orbs */}
      <div className="hero-glow" style={{ top: "-10%", left: "-5%", background: "radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)" }} />
      <div className="hero-glow" style={{ bottom: "-15%", right: "-8%", background: "radial-gradient(circle, rgba(6,182,212,0.25), transparent 70%)" }} />
      <div className="hero-glow" style={{ top: "40%", left: "60%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="gradient-border rounded-2xl">
          <div
            className="relative rounded-2xl p-8 sm:p-10"
            style={{ background: "var(--color-surface)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <Image src="/StackXMINI.svg" alt="Portal Logo" width={48} height={48} className="w-12 h-12" priority />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
                Employee <span className="gradient-text">Portal</span>
              </h1>
              <p className="text-muted text-sm mt-2">Sign in to your account</p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-5"
              noValidate
            >
              {/* Email */}
              <div>
                <label htmlFor="login-email" className="block text-sm text-white font-medium mb-1.5">Email</label>
                <div className="relative">
                  <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4 pointer-events-none" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                    }}
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 text-sm text-white rounded-xl placeholder:text-muted/50 transition-all duration-300 outline-none focus:border-[rgba(139,92,246,0.45)] focus:shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                    style={{
                      background: "var(--color-surface)",
                      border: `1px solid ${errors.email ? "rgba(239,68,68,0.4)" : "rgba(139, 92, 246, 0.12)"}`,
                      backdropFilter: "blur(10px)",
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="login-password" className="block text-sm text-white font-medium mb-1.5">Password</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4 pointer-events-none" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-12 py-3 text-sm text-white rounded-xl placeholder:text-muted/50 transition-all duration-300 outline-none focus:border-[rgba(139,92,246,0.45)] focus:shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                    style={{
                      background: "var(--color-surface)",
                      border: `1px solid ${errors.password ? "rgba(239,68,68,0.4)" : "rgba(139, 92, 246, 0.12)"}`,
                      backdropFilter: "blur(10px)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-white rounded-lg transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                    {errors.password}
                  </p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 text-sm font-semibold text-white rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", boxShadow: "0 4px 24px rgba(139, 92, 246, 0.25)" }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    <HiLockClosed size={16} />
                    Sign In
                  </>
                )}
              </motion.button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8 pt-6 border-t border-surface-border text-center"
            >
              <p className="text-xs text-muted">Employee Portal · v1.0.0</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
