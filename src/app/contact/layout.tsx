import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us",
    description:
        "Get a free consultation from StackX. Tell us about your project and receive a tailored proposal within 2 business hours.",
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
