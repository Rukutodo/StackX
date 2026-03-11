import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us",
    description:
        "Learn about StackX — our mission, values, team, and journey from a small startup to a global software agency delivering premium solutions at unbeatable costs.",
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
