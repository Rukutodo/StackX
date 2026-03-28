"use client";

import { useState, type FormEvent, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HiMail, HiLockClosed, HiArrowLeft, HiCheckCircle, HiEye, HiEyeOff } from "react-icons/hi";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [errors, setErrors] = useState<{ email?: string; code?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for the 5-digit code inputs
  const codeRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call to send code
    setTimeout(() => {
      setIsSubmitting(false);
      setErrors({});
      setStep(2);
    }, 1000);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setErrors({});

    // Auto-advance to next input
    if (value && index < 4) {
      codeRefs[index + 1].current?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current is empty
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeRefs[index - 1].current?.focus();
    }
  };

  const handleCodeSubmit = (e: FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length < 5) {
      setErrors({ code: "Please enter the 5-digit code" });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call to verify code
    setTimeout(() => {
      setIsSubmitting(false);
      if (fullCode === "12345") { // Mock validation, let's accept anything for UX demo though
         setErrors({});
         setStep(3);
      } else {
         setErrors({});
         setStep(3); // Moving to step 3 anyway for frontend demo purposes
      }
    }, 1000);
  };

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrors({ password: "Password must be at least 6 characters" });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call to reset password
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Password reset successfully! You can now log in.");
      window.location.href = "/login";
    }, 1000);
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

      {/* ─── Card ─── */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="gradient-border rounded-2xl">
          <div
            className="relative rounded-2xl p-8 sm:p-10"
            style={{
              background: "rgba(19, 19, 26, 0.75)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
          >
            {/* ─── Back to Login ─── */}
            <Link
              href="/login"
              className="absolute top-6 left-6 text-muted hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              <HiArrowLeft size={14} /> Back
            </Link>

            {/* ─── Logo ─── */}
            <div className="flex justify-center mb-8 mt-4">
              <Image
                src="/StackXMINI.svg"
                alt="StackX Logo"
                width={48}
                height={48}
                className="w-12 h-12"
                priority
              />
            </div>

            {/* ─── Dynamic Content using AnimatePresence ─── */}
            <div className="min-h-[280px]">
              <AnimatePresence mode="wait">
                {/* ─── STEP 1: EMAIL ─── */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-8">
                      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
                        Reset <span className="gradient-text">Password</span>
                      </h1>
                      <p className="text-muted text-sm">
                        Enter your email address and we&apos;ll send you a 5-digit verification code.
                      </p>
                    </div>

                    <form onSubmit={handleEmailSubmit} className="space-y-6" noValidate>
                      <div>
                        <label htmlFor="email" className="block text-sm text-white font-medium mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setErrors({});
                            }}
                            placeholder="admin@stackx.dev"
                            className={`w-full pl-10 pr-4 py-3 text-sm text-white rounded-xl placeholder:text-muted/50 transition-all duration-300 outline-none
                              ${errors.email ? "border-red-500/60 focus:border-red-500" : "focus:border-[rgba(139,92,246,0.45)]"}`}
                            style={{
                              background: "rgba(19, 19, 26, 0.6)",
                              border: `1px solid ${errors.email ? "rgba(239,68,68,0.4)" : "rgba(139, 92, 246, 0.12)"}`,
                            }}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
                        )}
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3.5 text-sm font-semibold text-white rounded-xl transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                        style={{
                          background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                          boxShadow: "0 4px 24px rgba(139, 92, 246, 0.25)",
                        }}
                      >
                        {isSubmitting ? "Sending..." : "Send Verification Code"}
                      </motion.button>
                    </form>
                  </motion.div>
                )}

                {/* ─── STEP 2: 5-DIGIT CODE ─── */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-8">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary-light flex items-center justify-center mx-auto mb-4">
                        <HiMail size={24} />
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
                        Check your <span className="gradient-text">Email</span>
                      </h1>
                      <p className="text-muted text-sm">
                        We sent a 5-digit code to <span className="text-white font-medium">{email}</span>.
                      </p>
                    </div>

                    <form onSubmit={handleCodeSubmit} className="space-y-6">
                      <div>
                        <div className="flex justify-center gap-3">
                          {code.map((digit, index) => (
                            <input
                              key={index}
                              ref={codeRefs[index]}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleCodeChange(index, e.target.value)}
                              onKeyDown={(e) => handleCodeKeyDown(index, e)}
                              className={`w-12 h-14 text-center text-xl font-bold text-white rounded-xl transition-all outline-none
                                ${errors.code ? "border-red-500/60 focus:border-red-500" : "focus:border-[rgba(139,92,246,0.45)]"}`}
                              style={{
                                background: "rgba(19, 19, 26, 0.6)",
                                border: `1px solid ${errors.code ? "rgba(239,68,68,0.4)" : "rgba(139, 92, 246, 0.3)"}`,
                              }}
                            />
                          ))}
                        </div>
                        {errors.code && (
                          <p className="text-red-400 text-xs mt-3 text-center">{errors.code}</p>
                        )}
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isSubmitting || code.join("").length < 5}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3.5 text-sm font-semibold text-white rounded-xl transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                        style={{
                          background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                          boxShadow: "0 4px 24px rgba(139, 92, 246, 0.25)",
                        }}
                      >
                        {isSubmitting ? "Verifying..." : "Verify Code"}
                      </motion.button>

                      <div className="text-center mt-6">
                        <button type="button" onClick={() => { setStep(1); setCode(["", "", "", "", ""]); }} className="text-xs text-muted hover:text-white transition-colors">
                          Didn&apos;t receive it? <span className="text-primary-light">Resend or change email</span>
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* ─── STEP 3: NEW PASSWORD ─── */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-8">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                        <HiCheckCircle size={24} />
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
                        Set New <span className="gradient-text">Password</span>
                      </h1>
                      <p className="text-muted text-sm">
                        Create a strong, new password for your account.
                      </p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm text-white font-medium mb-1.5">
                          New Password
                        </label>
                        <div className="relative">
                          <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              setErrors({});
                            }}
                            placeholder="Enter new password"
                            className={`w-full pl-10 pr-12 py-3 text-sm text-white rounded-xl placeholder:text-muted/50 transition-all duration-300 outline-none
                              ${errors.password ? "border-red-500/60 focus:border-red-500" : "focus:border-[rgba(139,92,246,0.45)]"}`}
                            style={{
                              background: "rgba(19, 19, 26, 0.6)",
                              border: `1px solid ${errors.password ? "rgba(239,68,68,0.4)" : "rgba(139, 92, 246, 0.12)"}`,
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-white rounded-lg transition-colors"
                          >
                            {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>
                        )}
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3.5 text-sm font-semibold text-white rounded-xl transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                        style={{
                          background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                          boxShadow: "0 4px 24px rgba(139, 92, 246, 0.25)",
                        }}
                      >
                        {isSubmitting ? "Updating..." : "Update Password"}
                      </motion.button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
