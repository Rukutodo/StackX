import Link from "next/link";
import Image from "next/image";
import { FaTwitter, FaLinkedinIn, FaGithub, FaInstagram } from "react-icons/fa";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";

const footerLinks = {
    Company: [
        { href: "/about", label: "About Us" },
        { href: "/careers", label: "Careers" },
        { href: "/testimonials", label: "Testimonials" },
        { href: "/contact", label: "Contact" },
    ],
    Services: [
        { href: "/services#web-development", label: "Web Development" },
        { href: "/services#automation", label: "Business Automation" },
        { href: "/services#adtech", label: "Ad Tech Solutions" },
        { href: "/portfolio", label: "Case Studies" },
    ],
};

const socials = [
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
    { icon: FaGithub, href: "#", label: "GitHub" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
];

export default function Footer() {
    return (
        <footer className="border-t border-surface-border bg-surface/50">
            {/* Gradient accent line */}
            <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center mb-4">
                            <Image
                                src="/stackx.svg"
                                alt="StackX"
                                width={120}
                                height={48}
                                className="h-8 w-auto"
                            />
                        </Link>
                        <p className="text-muted text-sm leading-relaxed mb-6">
                            Professional software development at unbeatable costs.
                            We build high-performance web solutions, automation systems, and ad tech platforms.
                        </p>
                        <div className="flex gap-3">
                            {socials.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-muted hover:text-primary hover:bg-white/10 transition-all"
                                >
                                    <s.icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-white mb-4">
                                {title}
                            </h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted hover:text-primary-light transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-white mb-4">
                            Contact
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm text-muted">
                                <HiMail className="text-primary-light shrink-0" />
                                hello@stackx.dev
                            </li>
                            <li className="flex items-center gap-3 text-sm text-muted">
                                <HiPhone className="text-primary-light shrink-0" />
                                +1 (555) 123-4567
                            </li>
                            <li className="flex items-start gap-3 text-sm text-muted">
                                <HiLocationMarker className="text-primary-light shrink-0 mt-0.5" />
                                Visakhapatnam, India
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-8 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted">
                        © {new Date().getFullYear()} StackX. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-xs text-muted hover:text-primary-light transition">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-xs text-muted hover:text-primary-light transition">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
