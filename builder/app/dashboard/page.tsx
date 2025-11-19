"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Globe, FileText, Image, Users } from "lucide-react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { StatsCard } from "@/components/ui/stats-card";
import "./page.css";

export default function DashboardPage() {
  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => apiClient.get("/tenants"),
  });

  const stats = [
    {
      name: "Total Clients",
      value: Array.isArray(tenants) ? tenants.length : "0",
      icon: Globe,
      iconColor: "blue" as const,
    },
    {
      name: "Pages",
      value: "0",
      icon: FileText,
      iconColor: "green" as const,
    },
    {
      name: "Assets",
      value: "0",
      icon: Image,
      iconColor: "purple" as const,
    },
    {
      name: "Users",
      value: "0",
      icon: Users,
      iconColor: "orange" as const,
    },
  ];

  return (
    <div>
      <DashboardHeader
        title="Dashboard"
        description="Welcome to your Web & Funnel admin dashboard"
      />

      <div className="dashboard-stats-grid">
        {stats.map((stat) => (
          <StatsCard
            key={stat.name}
            name={stat.name}
            value={stat.value}
            icon={stat.icon}
            iconColor={stat.iconColor}
          />
        ))}
      </div>
    </div>
  );
}
