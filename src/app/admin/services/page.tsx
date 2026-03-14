"use client";

import { motion } from "framer-motion";
import { HiPencil, HiTrash, HiPlus, HiEye } from "react-icons/hi";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  DataTable,
  StatusBadge,
  AdminButton,
} from "@/components/admin/ui";

const services = [
  { id: 1, name: "Custom Website Development", category: "Web Development", status: "active" as const, projects: 42, price: "From $2,999" },
  { id: 2, name: "E-Commerce Solutions", category: "Web Development", status: "active" as const, projects: 28, price: "From $4,999" },
  { id: 3, name: "Progressive Web Apps", category: "Web Development", status: "active" as const, projects: 15, price: "From $5,499" },
  { id: 4, name: "CRM Automation", category: "Business Automation", status: "active" as const, projects: 35, price: "From $3,499" },
  { id: 5, name: "Workflow Automation", category: "Business Automation", status: "active" as const, projects: 22, price: "From $2,499" },
  { id: 6, name: "Chatbot Integration", category: "Business Automation", status: "draft" as const, projects: 8, price: "From $1,999" },
  { id: 7, name: "Programmatic Ad Platforms", category: "Ad Tech", status: "active" as const, projects: 18, price: "From $7,999" },
  { id: 8, name: "Ad Analytics Dashboards", category: "Ad Tech", status: "active" as const, projects: 12, price: "From $4,999" },
  { id: 9, name: "Real-Time Bidding Systems", category: "Ad Tech", status: "draft" as const, projects: 3, price: "From $12,999" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function ServicesAdminPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            Services
          </h1>
          <p className="text-muted text-sm mt-1">Manage your service offerings</p>
        </div>
        <AdminButton variant="primary" className="gap-1.5">
          <HiPlus size={16} /> Add Service
        </AdminButton>
      </motion.div>

      {/* Services table */}
      <motion.div variants={item}>
        <DashboardGlassCard>
          <DashboardSectionHeader title="All Services" subtitle={`${services.length} services configured`} />
          <DataTable
            columns={[
              {
                key: "name",
                header: "Service",
                render: (row) => (
                  <div>
                    <p className="text-white font-medium text-sm">{row.name as string}</p>
                    <p className="text-muted text-xs mt-0.5">{row.category as string}</p>
                  </div>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (row) => <StatusBadge status={row.status as "active" | "draft"} />,
              },
              {
                key: "projects",
                header: "Projects",
                render: (row) => <span className="text-white text-sm">{row.projects as number}</span>,
              },
              {
                key: "price",
                header: "Starting Price",
                render: (row) => <span className="text-primary-light text-sm font-medium">{row.price as string}</span>,
              },
              {
                key: "actions",
                header: "",
                className: "text-right",
                render: () => (
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-2 text-muted hover:text-white hover:bg-white/5 rounded-lg transition"><HiEye size={15} /></button>
                    <button className="p-2 text-muted hover:text-primary-light hover:bg-primary/5 rounded-lg transition"><HiPencil size={15} /></button>
                    <button className="p-2 text-muted hover:text-red-400 hover:bg-red-500/5 rounded-lg transition"><HiTrash size={15} /></button>
                  </div>
                ),
              },
            ]}
            data={services}
          />
        </DashboardGlassCard>
      </motion.div>
    </motion.div>
  );
}
