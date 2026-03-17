import type { Metadata } from "next";
import AdminLayoutClient from "./AdminLayoutClient";
import "./admin.css";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard | StackX",
    template: "%s — Admin | StackX",
  },
  description: "StackX administration dashboard — manage services, portfolio, team, and client communications.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
