"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiArrowRight, HiChevronDown, HiChevronUp } from "react-icons/hi";
import { SectionHeading } from "@/components/ui";

/* ── Team Data ─────────────────────────────────────────── */

const team = [
    {
        id: "nuraj-mani-sai",
        name: "Kandregula Nuraj Mani Sai",
        role: "Founder & CEO",
        photo: "/team/nuraj.png",
        isFounder: true,
        shortBio:
            "Visionary entrepreneur and full-stack architect who founded StackX with a mission to deliver premium technology at accessible costs.",
        fullBio: [
            "Kandregula Nuraj Mani Sai is the visionary entrepreneur and full-stack architect who built StackX from the ground up. With a deep passion for building future-focused technology, Nuraj founded the company with a singular mission: to make enterprise-grade software development accessible to every business, regardless of budget.",
            "As Founder & CEO, he leads the company\u2019s strategic direction, key client relationships, and technical innovation roadmap. His hands-on approach ensures that every project delivered under the StackX banner meets the highest standards of quality, performance, and reliability.",
            "Under his leadership, StackX has grown from a small team into a globally trusted technology partner, delivering 150+ successful projects across 8+ countries and earning the trust of 80+ clients worldwide.",
        ],
        tags: ["Strategic Leadership", "Full-Stack Architecture", "Product Vision"],
    },
    {
        id: "a-roshan",
        name: "A. Roshan",
        role: "Co-Founder",
        photo: "/team/roshan.jpeg",
        isFounder: false,
        shortBio:
            "Strategic co-founder and business development expert who builds client relationships, forges key partnerships, and drives StackX\u2019s growth engine.",
        fullBio: [
            "A. Roshan co-founded StackX alongside Nuraj with a focus on business development, partnerships, and operational excellence. He plays a critical role in scaling the company\u2019s reach and ensuring clients receive consistent, high-quality service throughout their journey with StackX.",
            "Roshan\u2019s strength lies in building long-term relationships \u2014 whether with clients, vendors, or strategic partners. He ensures that StackX\u2019s mission of accessible premium technology resonates with the right audiences across industries and geographies.",
            "His collaborative approach and operational rigor form the backbone of StackX\u2019s growth, helping the company maintain its 98% client retention rate while continuously expanding into new markets.",
        ],
        tags: ["Business Development", "Partnerships", "Operations"],
    },
    {
        id: "venu-gopal",
        name: "Venu Gopal",
        role: "Head of Technology",
        photo: "/team/venu.jpeg",
        isFounder: false,
        shortBio:
            "Engineering leader with deep expertise in scalable system design, cloud infrastructure, and modern web technologies.",
        fullBio: [
            "Venu Gopal leads StackX\u2019s engineering function as Head of Technology, bringing deep expertise in scalable system design, cloud infrastructure, and full-stack web technologies. He spearheads the company\u2019s technical roadmap to ensure every product delivered is performant, secure, and production-ready.",
            "Venu\u2019s engineering philosophy centers on clean architecture, developer efficiency, and relentless quality assurance. He mentors the engineering team and sets the technical standards that define the StackX engineering culture.",
            "From architecting complex SaaS platforms to leading Ad Tech infrastructure builds, Venu ensures that StackX consistently delivers solutions that rival the best in the industry \u2014 while keeping development agile and cost-effective.",
        ],
        tags: ["Cloud Architecture", "System Design", "Engineering Leadership"],
    },
];

/* ── Fade-in wrapper ───────────────────────────────────── */
function FadeIn({
    children,
    delay = 0,
    className = "",
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════
   COMPACT — Homepage: big image cards + "Know More" link
   ═══════════════════════════════════════════════════════════ */

function CompactLayout() {
    return (
        <section className="py-20 relative overflow-hidden">
            {/* Soft background glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse at center, rgba(139,92,246,0.05) 0%, transparent 70%)",
                }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <SectionHeading
                    badge="Our Leadership"
                    title="The Minds Behind StackX"
                    subtitle="Visionary leaders building world-class technology solutions with precision and purpose."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {team.map((member, i) => (
                        <FadeIn key={member.id} delay={i * 0.12} className="h-full">
                            <div
                                className="group relative flex flex-col rounded-2xl overflow-hidden h-full transition-all duration-300"
                                style={{
                                    background: "rgba(19,19,26,0.7)",
                                    border: `1px solid ${member.isFounder
                                        ? "rgba(139,92,246,0.3)"
                                        : "rgba(139,92,246,0.12)"
                                        }`,
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor =
                                        "rgba(139,92,246,0.45)";
                                    (e.currentTarget as HTMLElement).style.boxShadow =
                                        "0 8px 32px rgba(139,92,246,0.12)";
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor =
                                        member.isFounder
                                            ? "rgba(139,92,246,0.3)"
                                            : "rgba(139,92,246,0.12)";
                                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                                }}
                            >
                                {/* ── Large Image Area ── */}
                                <div
                                    className="relative w-full overflow-hidden"
                                    style={{
                                        height: member.isFounder ? 320 : 300,
                                        background: "rgba(10,10,16,0.4)",
                                    }}
                                >
                                    <Image
                                        src={member.photo}
                                        alt={member.name}
                                        fill
                                        className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                    {/* Gradient fade at bottom */}
                                    <div
                                        className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
                                        style={{
                                            background:
                                                "linear-gradient(to top, rgba(19,19,26,0.95), transparent)",
                                        }}
                                    />

                                    {/* Founder badge overlay */}
                                    {member.isFounder && (
                                        <div className="absolute top-3 left-3 z-10">
                                            <span
                                                className="px-2.5 py-1 text-[10px] font-semibold tracking-[0.15em] uppercase rounded-full"
                                                style={{
                                                    background: "rgba(139,92,246,0.25)",
                                                    border: "1px solid rgba(139,92,246,0.5)",
                                                    color: "#A78BFA",
                                                    backdropFilter: "blur(8px)",
                                                }}
                                            >
                                                Founder
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* ── Card Content ── */}
                                <div className="flex flex-col flex-1 p-6">
                                    {/* Name */}
                                    <h3
                                        className="font-semibold leading-snug mb-1"
                                        style={{
                                            fontFamily: "var(--font-poppins), sans-serif",
                                            fontSize: member.isFounder ? "1.15rem" : "1.05rem",
                                            color: "#ededed",
                                        }}
                                    >
                                        {member.name}
                                    </h3>

                                    {/* Role */}
                                    <span
                                        className="inline-block self-start px-3 py-0.5 text-xs font-medium rounded-full mb-3 tracking-wide"
                                        style={{
                                            background: "rgba(139,92,246,0.12)",
                                            border: "1px solid rgba(139,92,246,0.22)",
                                            color: "#A78BFA",
                                        }}
                                    >
                                        {member.role}
                                    </span>

                                    {/* Short bio */}
                                    <p
                                        className="text-sm leading-relaxed flex-1"
                                        style={{ color: "#9ca3af" }}
                                    >
                                        {member.shortBio}
                                    </p>

                                    {/* Know More link → anchors to about page */}
                                    <Link
                                        href={`/about#${member.id}`}
                                        className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium transition-colors duration-200"
                                        style={{ color: "#A78BFA" }}
                                        onMouseEnter={(e) =>
                                            ((e.currentTarget as HTMLElement).style.color = "#c4b5fd")
                                        }
                                        onMouseLeave={(e) =>
                                            ((e.currentTarget as HTMLElement).style.color = "#A78BFA")
                                        }
                                    >
                                        Know More
                                        <HiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════
   EXPANDED — About Page: zig-zag + "Read More" toggle
   ═══════════════════════════════════════════════════════════ */

function ExpandedCard({
    member,
    index,
}: {
    member: (typeof team)[0];
    index: number;
}) {
    const [expanded, setExpanded] = useState(false);
    const isEven = index % 2 === 0;

    return (
        <FadeIn delay={0.1}>
            <div
                id={member.id}
                className={`scroll-mt-28 flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                    } gap-8 lg:gap-14 items-center rounded-2xl p-8 lg:p-12`}
                style={{
                    background: "rgba(19,19,26,0.55)",
                    border: `1px solid ${member.isFounder
                        ? "rgba(139,92,246,0.25)"
                        : "rgba(139,92,246,0.1)"
                        }`,
                }}
            >
                {/* ── Photo ── */}
                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <div
                        className="relative rounded-2xl overflow-hidden"
                        style={{
                            width: member.isFounder ? 260 : 220,
                            height: member.isFounder ? 300 : 260,
                            border: `2px solid ${member.isFounder
                                ? "rgba(139,92,246,0.4)"
                                : "rgba(139,92,246,0.15)"
                                }`,
                            boxShadow: member.isFounder
                                ? "0 12px 40px rgba(139,92,246,0.15)"
                                : "0 8px 24px rgba(0,0,0,0.3)",
                        }}
                    >
                        <Image
                            src={member.photo}
                            alt={member.name}
                            fill
                            className="object-cover object-center"
                            sizes="260px"
                        />
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="flex-1">
                    {/* Role badge */}
                    <span
                        className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 tracking-widest uppercase"
                        style={{
                            background: "rgba(139,92,246,0.12)",
                            border: "1px solid rgba(139,92,246,0.25)",
                            color: "#A78BFA",
                        }}
                    >
                        {member.role}
                    </span>

                    {/* Name */}
                    <h3
                        className="font-bold mb-2 leading-tight"
                        style={{
                            fontFamily: "var(--font-poppins), sans-serif",
                            fontSize: member.isFounder ? "1.75rem" : "1.5rem",
                            color: "#ededed",
                        }}
                    >
                        {member.name}
                    </h3>

                    {/* Accent line */}
                    <div
                        className="h-0.5 w-16 mb-5 rounded-full"
                        style={{
                            background:
                                "linear-gradient(90deg, rgba(139,92,246,0.8), rgba(6,182,212,0.5))",
                        }}
                    />

                    {/* Bio — first paragraph always visible */}
                    <p
                        className="text-sm leading-relaxed mb-3"
                        style={{ color: "#9ca3af" }}
                    >
                        {member.fullBio[0]}
                    </p>

                    {/* Additional paragraphs — shown on expand */}
                    {expanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="space-y-3 mb-3"
                        >
                            {member.fullBio.slice(1).map((para, pi) => (
                                <p
                                    key={pi}
                                    className="text-sm leading-relaxed"
                                    style={{ color: "#9ca3af" }}
                                >
                                    {para}
                                </p>
                            ))}
                        </motion.div>
                    )}

                    {/* Read More / Read Less toggle */}
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium mb-5 transition-colors duration-200 cursor-pointer"
                        style={{ color: "#A78BFA" }}
                        onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLElement).style.color = "#c4b5fd")
                        }
                        onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLElement).style.color = "#A78BFA")
                        }
                    >
                        {expanded ? "Read Less" : "Read More"}
                        {expanded ? (
                            <HiChevronUp className="w-4 h-4" />
                        ) : (
                            <HiChevronDown className="w-4 h-4" />
                        )}
                    </button>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {member.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 text-xs rounded-lg"
                                style={{
                                    background: "rgba(139,92,246,0.08)",
                                    border: "1px solid rgba(139,92,246,0.18)",
                                    color: "#A78BFA",
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </FadeIn>
    );
}

function ExpandedLayout() {
    return (
        <section className="py-20 relative overflow-hidden">
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse at 30% 50%, rgba(139,92,246,0.04) 0%, transparent 70%)",
                }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <SectionHeading
                    badge="Leadership Team"
                    title="Meet the Leadership"
                    subtitle="The people who drive StackX\u2019s vision, technology, and growth \u2014 united by a shared mission to build exceptional software."
                />

                <div className="space-y-16 lg:space-y-24">
                    {team.map((member, i) => (
                        <ExpandedCard key={member.id} member={member} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ── Main Export ───────────────────────────────────────── */

interface LeadershipSectionProps {
    variant?: "compact" | "expanded";
}

export default function LeadershipSection({
    variant = "compact",
}: LeadershipSectionProps) {
    return variant === "expanded" ? <ExpandedLayout /> : <CompactLayout />;
}
