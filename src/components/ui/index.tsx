"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionHeadingProps {
    badge?: string;
    title: string;
    subtitle?: string;
    center?: boolean;
}

export function SectionHeading({
    badge,
    title,
    subtitle,
    center = true,
}: SectionHeadingProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className={`mb-14 ${center ? "text-center" : ""}`}
        >
            {badge && (
                <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-wider uppercase rounded-full bg-primary/10 text-primary-light border border-primary/20 mb-4">
                    {badge}
                </span>
            )}
            <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold leading-tight"
                style={{ fontFamily: "var(--font-poppins), sans-serif" }}
            >
                {title}
            </h2>
            {subtitle && (
                <p className="mt-4 text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                    {subtitle}
                </p>
            )}
        </motion.div>
    );
}

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export function GlassCard({
    children,
    className = "",
    hover = true,
}: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className={`glass-card ${hover ? "glass-card-hover" : ""} p-6 sm:p-8 transition-all duration-300 ${className}`}
        >
            {children}
        </motion.div>
    );
}

interface ButtonProps {
    children: ReactNode;
    variant?: "primary" | "secondary" | "outline";
    href?: string;
    className?: string;
    type?: "button" | "submit";
    onClick?: () => void;
}

export function Button({
    children,
    variant = "primary",
    href,
    className = "",
    type = "button",
    onClick,
}: ButtonProps) {
    const base =
        "inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 cursor-pointer";
    const variants: Record<string, string> = {
        primary:
            "bg-gradient-to-r from-primary to-primary-deep text-white hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5",
        secondary:
            "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-primary/30",
        outline:
            "border border-primary/30 text-primary-light hover:bg-primary/10 hover:border-primary/50",
    };

    const classes = `${base} ${variants[variant]} ${className}`;

    if (href) {
        return (
            <a href={href} className={classes}>
                {children}
            </a>
        );
    }
    return (
        <button type={type} onClick={onClick} className={classes}>
            {children}
        </button>
    );
}

interface AnimatedCounterProps {
    end: number;
    suffix?: string;
    prefix?: string;
    label: string;
    duration?: number;
}

export function AnimatedCounter({
    end,
    suffix = "",
    prefix = "",
    label,
    duration = 2,
}: AnimatedCounterProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
        >
            <motion.div
                className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold gradient-text"
                style={{ fontFamily: "var(--font-poppins), sans-serif" }}
            >
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    {prefix}
                </motion.span>
                <Counter from={0} to={end} duration={duration} />
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    {suffix}
                </motion.span>
            </motion.div>
            <p className="mt-2 text-sm text-muted uppercase tracking-wider">
                {label}
            </p>
        </motion.div>
    );
}

function Counter({
    from,
    to,
    duration,
}: {
    from: number;
    to: number;
    duration: number;
}) {
    const [count, setCount] = useState(from);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        let start = from;
        const increment = (to - from) / (duration * 60);
        const timer = setInterval(() => {
            start += increment;
            if (start >= to) {
                setCount(to);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [inView, from, to, duration]);

    return <span ref={ref}>{count}</span>;
}

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

interface TestimonialCardProps {
    name: string;
    company: string;
    feedback: string;
    rating: number;
    projectType: string;
    image?: string;
}

export function TestimonialCard({
    name,
    company,
    feedback,
    rating,
    projectType,
}: TestimonialCardProps) {
    return (
        <GlassCard className="flex flex-col h-full">
            <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                        key={i}
                        className={`w-4 h-4 ${i < rating ? "star-filled" : "star-empty"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
            <p className="text-muted text-sm leading-relaxed flex-1 mb-4">
                &ldquo;{feedback}&rdquo;
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-surface-border">
                <div>
                    <p className="text-sm font-medium text-white">{name}</p>
                    <p className="text-xs text-muted">{company}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary-light border border-primary/20">
                    {projectType}
                </span>
            </div>
        </GlassCard>
    );
}
