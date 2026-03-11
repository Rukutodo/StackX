import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Portfolio & Case Studies",
    description:
        "Explore StackX's portfolio of successful web development, automation, and ad tech projects. See real results from real clients.",
};

export default function PortfolioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
