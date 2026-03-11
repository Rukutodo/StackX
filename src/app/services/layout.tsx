import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Services",
    description:
        "Explore StackX's web development, business automation, and ad tech services. Custom solutions starting from $2,500 with modern tech stacks.",
};

export default function ServicesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
