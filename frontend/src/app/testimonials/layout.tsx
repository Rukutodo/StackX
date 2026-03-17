import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Testimonials",
    description:
        "Read testimonials from StackX clients. Trusted by 80+ companies for web development, automation, and ad tech solutions.",
};

export default function TestimonialsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
