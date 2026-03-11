"use client";

import { SectionHeading, TestimonialCard } from "@/components/ui";
import { motion } from "framer-motion";

const testimonials = [
    {
        name: "Rajesh Kumar",
        company: "Communize VIZAG",
        feedback:
            "StackX transformed our digital presence completely. Their attention to detail and cost-effective approach saved us over 35% compared to other agencies while delivering superior quality.",
        rating: 5,
        projectType: "Web Development",
    },
    {
        name: "Sarah Mitchell",
        company: "AdScale Inc.",
        feedback:
            "The ad tech platform they built handles millions of impressions daily without breaking a sweat. Their technical expertise is truly world-class.",
        rating: 5,
        projectType: "Ad Tech",
    },
    {
        name: "Amit Patel",
        company: "FlowSync",
        feedback:
            "Our business processes are now 60% more efficient thanks to the automation solutions StackX implemented. Truly a game-changer for our operations.",
        rating: 5,
        projectType: "Automation",
    },
    {
        name: "Emily Chen",
        company: "TechNova",
        feedback:
            "Working with StackX was a breath of fresh air. They understood our vision from day one and delivered a product that exceeded all expectations.",
        rating: 4,
        projectType: "Web Development",
    },
    {
        name: "David Rodriguez",
        company: "DataBridge",
        feedback:
            "The data sync platform StackX built for us has 99.9% accuracy and handles thousands of records seamlessly. Their Python expertise is exceptional.",
        rating: 5,
        projectType: "Automation",
    },
    {
        name: "Priya Sharma",
        company: "NexGen Digital",
        feedback:
            "StackX's unified campaign management tool consolidated our Google, Meta, and TikTok ads into one sleek interface. ROAS improved by 35% in just 3 months.",
        rating: 5,
        projectType: "Ad Tech",
    },
    {
        name: "Michael Torres",
        company: "CloudPeak",
        feedback:
            "They migrated our entire legacy system to a modern cloud architecture in record time. Downtime was virtually zero. Incredible execution.",
        rating: 5,
        projectType: "Web Development",
    },
    {
        name: "Lisa Wang",
        company: "Finora",
        feedback:
            "The fintech dashboard StackX built processes real-time data feeds with sub-second latency. Their attention to performance optimization is remarkable.",
        rating: 4,
        projectType: "Web Development",
    },
];

export default function TestimonialsPage() {
    return (
        <div className="pt-24 pb-20">
            {/* Hero */}
            <section className="py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.08),transparent_60%)]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <SectionHeading
                        badge="Testimonials"
                        title="Trusted by Teams Worldwide"
                        subtitle="Don't take our word for it — hear from the clients who have experienced the StackX difference."
                    />
                </div>
            </section>

            {/* Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                        >
                            <TestimonialCard {...t} />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Average Rating */}
            <section className="py-20 mt-12">
                <div className="max-w-lg mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-6xl font-heading font-bold gradient-text mb-2">4.9</p>
                        <div className="flex items-center justify-center gap-1 mb-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                    key={i}
                                    className="w-6 h-6 star-filled"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <p className="text-muted text-sm">Average rating across 80+ clients</p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
