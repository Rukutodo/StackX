"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiEye, HiEyeOff, HiLockClosed, HiUser } from "react-icons/hi";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: { username?: string; password?: string } = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Accept HTTP-only cookie from backend
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ password: data.message || "Login failed" });
        setIsSubmitting(false);
        return;
      }

      // Store token in localStorage for the admin auth guard
      if (data.token) {
        localStorage.setItem("stackx_token", data.token);
      }

      // Login successful — hard navigate to dashboard
      window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ password: "Could not connect to server" });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* ─── Background Glow Orbs ─── */}
      <div
        className="hero-glow"
        style={{
          top: "-10%",
          left: "-5%",
          background: "radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)",
        }}
      />
      <div
        className="hero-glow"
        style={{
          bottom: "-15%",
          right: "-8%",
          background: "radial-gradient(circle, rgba(6,182,212,0.25), transparent 70%)",
        }}
      />
      <div
        className="hero-glow"
        style={{
          top: "40%",
          left: "60%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)",
        }}
      />

      {/* ─── Login Card ─── */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Gradient border wrapper */}
        <div className="gradient-border rounded-2xl">
          <div
            className="relative rounded-2xl p-8 sm:p-10"
            style={{
              background: "rgba(19, 19, 26, 0.75)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
          >
            {/* ─── Logo ─── */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <Image
                src="/StackXMINI.svg"
                alt="StackX Logo"
                width={48}
                height={48}
                className="w-12 h-12"
                priority
              />
            </motion.div>

            {/* ─── Header ─── */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1
                className="text-2xl sm:text-3xl font-bold text-white"
                style={{ fontFamily: "var(--font-poppins), sans-serif" }}
              >
                Admin <span className="gradient-text">Login</span>
              </h1>
              <p className="text-muted text-sm mt-2">
                Sign in to the StackX dashboard
              </p>
            </motion.div>

            {/* ─── Form ─── */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-5"
              noValidate
            >
              {/* Username */}
              <div>
                <label
                  htmlFor="login-username"
                  className="block text-sm text-white font-medium mb-1.5"
                >
                  Username
                </label>
                <div className="relative">
                  <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4 pointer-events-none" />
                  <input
                    id="login-username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
                    }}
                    placeholder="Enter your username"
                    autoComplete="username"
                    aria-label="Username"
                    aria-invalid={!!errors.username}
                    aria-describedby={errors.username ? "username-error" : undefined}
                    className={`w-full pl-10 pr-4 py-3 text-sm text-white rounded-xl placeholder:text-muted/50 transition-all duration-300 outline-none
                      ${errors.username
                        ? "border-red-500/60 focus:border-red-500 focus:shadow-[0_0_16px_rgba(239,68,68,0.15)]"
                        : "focus:border-[rgba(139,92,246,0.45)] focus:shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                      }`}
                    style={{
                      background: "rgba(19, 19, 26, 0.6)",
                      border: `1px solid ${errors.username ? "rgba(239,68,68,0.4)" : "rgba(139, 92, 246, 0.12)"}`,
                      backdropFilter: "blur(10px)",
                    }}
                  />
                </div>
                {errors.username && (
                  <motion.p
                    id="username-error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                    {errors.username}
                  </motion.p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm text-white font-medium mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4 pointer-events-none" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    aria-label="Password"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    className={`w-full pl-10 pr-12 py-3 text-sm text-white rounded-xl placeholder:text-muted/50 transition-all duration-300 outline-none
                      ${errors.password
                        ? "border-red-500/60 focus:border-red-500 focus:shadow-[0_0_16px_rgba(239,68,68,0.15)]"
                        : "focus:border-[rgba(139,92,246,0.45)] focus:shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                      }`}
                    style={{
                      background: "rgba(19, 19, 26, 0.6)",
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
                  <motion.p
                    id="password-error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                    {errors.password}
                  </motion.p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary-light hover:text-white transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 text-sm font-semibold text-white rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                  boxShadow: "0 4px 24px rgba(139, 92, 246, 0.25)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 8px 32px rgba(139, 92, 246, 0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 4px 24px rgba(139, 92, 246, 0.25)";
                }}
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

            {/* ─── Footer ─── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8 pt-6 border-t border-surface-border text-center"
            >
              <p className="text-xs text-muted">
                StackX Admin Panel · v1.0.0
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
