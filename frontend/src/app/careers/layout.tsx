import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Careers",
    description:
        "Join StackX — explore open positions in engineering, design, and automation. Remote-first culture with competitive pay and growth opportunities.",
};

export default function CareersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
