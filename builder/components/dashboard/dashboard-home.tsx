"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import {
  useTenantsHealth,
  useActiveTenant,
  type TenantHealthData,
} from "@/lib/hooks/use-tenants";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import "./dashboard-home.css";

// =============================================================================
// Helpers
// =============================================================================

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return "No activity";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

function getHealthLabel(status: TenantHealthData["healthStatus"]): string {
  switch (status) {
    case "active":
      return "Active";
    case "idle":
      return "Idle";
    case "inactive":
      return "Inactive";
  }
}

// =============================================================================
// Stat Card
// =============================================================================

interface StatCardProps {
  label: string;
  value: number;
  sub?: string;
  trend?: { value: string; direction: "up" | "down" | "neutral" };
}

function StatCard({ label, value, sub, trend }: StatCardProps) {
  return (
    <div className="dashboard-stat-card">
      <div className="dashboard-stat-label">{label}</div>
      <div className="dashboard-stat-row">
        <span className="dashboard-stat-value">{value}</span>
        {trend && (
          <span
            className={`dashboard-stat-trend dashboard-stat-trend-${trend.direction}`}
          >
            {trend.direction === "up" && "\u2191 "}
            {trend.direction === "down" && "\u2193 "}
            {trend.value}
          </span>
        )}
      </div>
      {sub && <div className="dashboard-stat-sub">{sub}</div>}
    </div>
  );
}

// =============================================================================
// Skeleton States
// =============================================================================

function StatsSkeleton() {
  return (
    <div className="dashboard-stats">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="dashboard-stat-skeleton">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-14" />
          <Skeleton className="h-3 w-28" />
        </div>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="dashboard-table">
      <div className="dashboard-table-head">
        <div className="dashboard-table-head-row">
          <div className="dashboard-table-th dashboard-table-th-client">
            Client
          </div>
          <div className="dashboard-table-th dashboard-table-th-status">
            Status
          </div>
          <div className="dashboard-table-th dashboard-table-th-tier">Tier</div>
          <div className="dashboard-table-th dashboard-table-th-pages">
            Pages
          </div>
          <div className="dashboard-table-th dashboard-table-th-activity">
            Last Activity
          </div>
          <div className="dashboard-table-th dashboard-table-th-health">
            Health
          </div>
        </div>
      </div>
      <div className="dashboard-table-body">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="dashboard-table-skeleton-row">
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-2.5 w-20" />
            </div>
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-14 ml-3" />
            <Skeleton className="h-3.5 w-8 ml-auto" />
            <Skeleton className="h-3.5 w-16 ml-6 hidden lg:block" />
            <Skeleton className="h-2 w-2 rounded-full ml-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Dashboard Home
// =============================================================================

export function DashboardHome() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { switchTenant } = useActiveTenant();
  const { data: healthData, isLoading, error } = useTenantsHealth();

  const firstName = user?.firstName || "there";
  const totalPages =
    healthData?.tenants.reduce((sum, t) => sum + t.counts.pages, 0) ?? 0;

  return (
    <div className="dashboard">
      {/* Welcome */}
      <div className="dashboard-welcome">
        <h1 className="dashboard-greeting">
          {getGreeting()}, {firstName}
        </h1>
        <span className="dashboard-date">{formatDate()}</span>
      </div>

      {/* Stats */}
      {isLoading ? (
        <StatsSkeleton />
      ) : error ? (
        <div className="dashboard-error">
          <AlertCircle className="dashboard-error-icon" />
          <span>Unable to load dashboard metrics</span>
        </div>
      ) : healthData ? (
        <>
          <div className="dashboard-stats">
            <StatCard
              label="Total Clients"
              value={healthData.summary.totalTenants}
              sub="Active workspaces"
            />
            <StatCard
              label="Active (7d)"
              value={healthData.summary.activeTenants}
              sub="Updated in past week"
              trend={
                healthData.summary.activeTenants > 0
                  ? {
                      value: `${Math.round((healthData.summary.activeTenants / Math.max(healthData.summary.totalTenants, 1)) * 100)}%`,
                      direction: "up",
                    }
                  : undefined
              }
            />
            <StatCard
              label="Total Pages"
              value={totalPages}
              sub="Across all clients"
            />
            <StatCard
              label="Needs Attention"
              value={
                healthData.summary.idleTenants +
                healthData.summary.inactiveTenants
              }
              sub="Idle or inactive clients"
              trend={
                healthData.summary.inactiveTenants > 0
                  ? {
                      value: `${healthData.summary.inactiveTenants} inactive`,
                      direction: "down",
                    }
                  : undefined
              }
            />
          </div>

          {/* Client Health Table */}
          <div className="dashboard-table-section">
            <div className="dashboard-table-header-bar">
              <h2 className="dashboard-table-title">
                Client Health{" "}
                <span className="dashboard-table-count">
                  {healthData.tenants.length}
                </span>
              </h2>
            </div>

            <div className="dashboard-table">
              <div className="dashboard-table-head">
                <div className="dashboard-table-head-row">
                  <div className="dashboard-table-th dashboard-table-th-client">
                    Client
                  </div>
                  <div className="dashboard-table-th dashboard-table-th-status">
                    Status
                  </div>
                  <div className="dashboard-table-th dashboard-table-th-tier">
                    Tier
                  </div>
                  <div className="dashboard-table-th dashboard-table-th-pages">
                    Pages
                  </div>
                  <div className="dashboard-table-th dashboard-table-th-activity">
                    Last Activity
                  </div>
                  <div className="dashboard-table-th dashboard-table-th-health">
                    Health
                  </div>
                </div>
              </div>

              <div className="dashboard-table-body">
                {healthData.tenants.map((tenant) => (
                  <button
                    key={tenant.id}
                    type="button"
                    className="dashboard-table-row"
                    onClick={() => {
                      switchTenant(tenant.id);
                      router.push("/pages");
                    }}
                  >
                    <div className="dashboard-table-td dashboard-table-td-client">
                      <span className="dashboard-table-client-name">
                        {tenant.businessName}
                      </span>
                      <span className="dashboard-table-client-slug">
                        /{tenant.slug}
                      </span>
                    </div>

                    <div className="dashboard-table-td dashboard-table-td-status">
                      <span
                        className={`dashboard-status-pill dashboard-status-${tenant.healthStatus}`}
                      >
                        {getHealthLabel(tenant.healthStatus)}
                      </span>
                    </div>

                    <div className="dashboard-table-td dashboard-table-td-tier">
                      <span
                        className={`dashboard-tier-badge dashboard-tier-${tenant.tier === "BUILDER" ? "builder" : "editor"}`}
                      >
                        {tenant.tier === "BUILDER" ? "Builder" : "Editor"}
                      </span>
                    </div>

                    <div className="dashboard-table-td dashboard-table-td-pages">
                      {tenant.counts.pages}
                    </div>

                    <div className="dashboard-table-td dashboard-table-td-activity">
                      {tenant.recentActivity.total > 0 ? (
                        <span className="dashboard-activity-text">
                          {tenant.recentActivity.total} updates
                        </span>
                      ) : (
                        <span className="dashboard-activity-none">
                          {formatRelativeTime(tenant.lastActivity)}
                        </span>
                      )}
                    </div>

                    <div className="dashboard-table-td dashboard-table-td-health">
                      <span
                        className={`dashboard-health-dot dashboard-health-dot-${tenant.healthStatus}`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* Loading table skeleton alongside stats skeleton */}
      {isLoading && (
        <div className="dashboard-table-section">
          <div className="dashboard-table-header-bar">
            <Skeleton className="h-4 w-28" />
          </div>
          <TableSkeleton />
        </div>
      )}
    </div>
  );
}
