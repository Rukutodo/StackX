"use client";

import { motion } from "framer-motion";
import { SectionHeading, GlassCard, Button } from "@/components/ui";
import LeadershipSection from "@/components/sections/LeadershipSection";
import {
    HiEye,
    HiHeart,
    HiLightningBolt,
    HiUserGroup,
    HiGlobe,
    HiArrowRight,
} from "react-icons/hi";

const values = [
    {
        icon: HiLightningBolt,
        title: "Innovation First",
        desc: "We stay ahead of the curve, constantly exploring new technologies and methodologies to deliver cutting-edge solutions.",
    },
    {
        icon: HiHeart,
        title: "Client-Centric",
        desc: "Your success is our success. We collaborate closely with every client, treating each project as a true partnership.",
    },
    {
        icon: HiEye,
        title: "Transparency",
        desc: "No hidden fees, no surprises. We maintain complete transparency in pricing, timelines, and project progress.",
    },
    {
        icon: HiUserGroup,
        title: "Team Excellence",
        desc: "Our team of passionate developers, designers, and strategists brings diverse expertise to every project.",
    },
];

const milestones = [
    { year: "2020", title: "Founded", desc: "StackX started with a vision to make premium development accessible." },
    { year: "2021", title: "First 25 Clients", desc: "Delivered solutions for startups across India and South-East Asia." },
    { year: "2022", title: "Ad Tech Division", desc: "Launched our specialized advertising technology solutions practice." },
    { year: "2023", title: "100+ Projects", desc: "Crossed the milestone of 100 successfully delivered projects." },
    { year: "2024", title: "Global Expansion", desc: "Extended services to clients in North America and Europe." },
    { year: "2025", title: "150+ Projects", desc: "Growing strong with 80+ happy clients and expanding into AI-powered solutions." },
];

const teamStats = [
    { value: "25+", label: "Team Members" },
    { value: "8+", label: "Countries Served" },
    { value: "5+", label: "Years Experience" },
    { value: "98%", label: "Client Retention" },
];

export default function AboutPage() {
    return (
        <div className="pt-24 pb-20">
            {/* Hero */}
            <section className="py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.08),transparent_60%)]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <SectionHeading
                        badge="About Us"
                        title="Building the Future, One Line at a Time"
                        subtitle="We're a team of passionate technologists dedicated to delivering premium software solutions at costs that make enterprise-quality accessible to everyone."
                    />
                </div>
            </section>

            {/* Our Story */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-wider uppercase rounded-full bg-primary/10 text-primary-light border border-primary/20 mb-4">
                            Our Story
                        </span>
                        <h3
                            className="text-3xl font-heading font-bold mb-6"
                            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                        >
                            From a Small Team to a{" "}
                            <span className="gradient-text">Global Agency</span>
                        </h3>
                        <div className="space-y-4 text-muted leading-relaxed">
                            <p>
                                StackX was founded in 2020 with a simple yet ambitious mission: to bridge the gap
                                between premium software quality and affordability. We saw too many startups and
                                growing businesses struggle with overpriced development that delivered underwhelming
                                results.
                            </p>
                            <p>
                                Our approach is different. By leveraging modern technologies, agile methodologies,
                                and a globally distributed team of experts, we deliver solutions that rival those
                                of top-tier agencies — at a fraction of the cost.
                            </p>
                            <p>
                                Today, we serve 80+ clients across 8 countries, covering everything from custom
                                web applications and SaaS products to business automation and advertising
                                technology platforms.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        {teamStats.map((stat, i) => (
                            <GlassCard key={i} className="text-center">
                                <p className="text-3xl font-heading font-bold gradient-text mb-1">{stat.value}</p>
                                <p className="text-sm text-muted">{stat.label}</p>
                            </GlassCard>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-surface/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <GlassCard>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-deep flex items-center justify-center">
                                    <HiEye className="w-5 h-5 text-white" />
                                </div>
                                <h3
                                    className="text-xl font-heading font-semibold"
                                    style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                                >
                                    Our Vision
                                </h3>
                            </div>
                            <p className="text-muted text-sm leading-relaxed">
                                To become the world&apos;s most trusted technology partner for cost-conscious
                                businesses that refuse to compromise on quality. We envision a future where premium
                                software development is accessible to every company, regardless of budget.
                            </p>
                        </GlassCard>
                        <GlassCard>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center">
                                    <HiGlobe className="w-5 h-5 text-white" />
                                </div>
                                <h3
                                    className="text-xl font-heading font-semibold"
                                    style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                                >
                                    Our Mission
                                </h3>
                            </div>
                            <p className="text-muted text-sm leading-relaxed">
                                To deliver enterprise-grade software solutions at industry-leading prices by
                                optimizing every aspect of the development lifecycle — from planning to deployment
                                — without cutting corners on quality, security, or performance.
                            </p>
                        </GlassCard>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeading
                        badge="Our Values"
                        title="What Drives Us"
                        subtitle="The principles that guide every decision, every line of code, and every client interaction."
                    />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((val, i) => (
                            <GlassCard key={i} className="text-center group">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                                    <val.icon className="w-7 h-7 text-primary-light" />
                                </div>
                                <h4
                                    className="text-lg font-heading font-semibold mb-2"
                                    style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                                >
                                    {val.title}
                                </h4>
                                <p className="text-muted text-sm leading-relaxed">{val.desc}</p>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20 bg-surface/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeading
                        badge="Our Journey"
                        title="Milestones Along the Way"
                    />
                    <div className="max-w-3xl mx-auto relative">
                        {/* Vertical line */}
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-primary-deep" />

                        {milestones.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className={`relative flex items-start gap-6 mb-10 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                    }`}
                            >
                                {/* Dot */}
                                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background z-10 mt-2" />

                                {/* Content */}
                                <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                                    <span className="text-xs font-medium text-primary-light">{m.year}</span>
                                    <h4
                                        className="text-lg font-heading font-semibold mt-1"
                                        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                                    >
                                        {m.title}
                                    </h4>
                                    <p className="text-sm text-muted mt-1">{m.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ LEADERSHIP TEAM ═══ */}
            <LeadershipSection variant="expanded" />

            {/* CTA */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2
                            className="text-3xl sm:text-4xl font-heading font-bold mb-4"
                            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                        >
                            Want to Be Part of Our Story?
                        </h2>
                        <p className="text-muted text-lg mb-8">
                            Whether as a client or a team member, we&apos;d love to connect with you.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button href="/contact" variant="primary">
                                Start a Project <HiArrowRight />
                            </Button>
                            <Button href="/careers" variant="outline">
                                Join Our Team <HiArrowRight />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
