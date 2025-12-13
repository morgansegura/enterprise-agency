"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { useTenantsHealth, TenantHealthData } from "@/lib/hooks/use-tenants";
import { PageLayout } from "@/components/layout/page-layout";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  Building2,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  FileText,
  Crown,
  Zap,
  ChevronRight,
  TrendingUp,
  LayoutDashboard,
} from "lucide-react";
import "./dashboard-home.css";

function getHealthIcon(status: TenantHealthData["healthStatus"]) {
  switch (status) {
    case "active":
      return <CheckCircle2 className="health-icon health-icon-active" />;
    case "idle":
      return <Clock className="health-icon health-icon-idle" />;
    case "inactive":
      return <AlertCircle className="health-icon health-icon-inactive" />;
  }
}

function getHealthLabel(status: TenantHealthData["healthStatus"]) {
  switch (status) {
    case "active":
      return "Active";
    case "idle":
      return "Idle";
    case "inactive":
      return "Inactive";
  }
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return "No activity";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function DashboardHome() {
  const { user } = useAuthStore();
  const { data: healthData, isLoading, error } = useTenantsHealth();

  return (
    <PageLayout
      title={`Welcome back, ${user?.firstName}!`}
      icon={LayoutDashboard}
      description="Manage your clients and monitor platform health from this dashboard."
    >
      <div className="dashboard-home">

      {/* Summary Stats */}
      {isLoading ? (
        <div className="dashboard-summary-grid">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <div className="dashboard-error">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to load health data</span>
        </div>
      ) : healthData ? (
        <>
          <div className="dashboard-summary-grid">
            <div className="dashboard-summary-card">
              <div className="dashboard-summary-header">
                <span className="dashboard-summary-title">Total Clients</span>
                <Building2 className="dashboard-summary-icon" />
              </div>
              <div className="dashboard-summary-value">
                {healthData.summary.totalTenants}
              </div>
              <div className="dashboard-summary-subtext">Active workspaces</div>
            </div>

            <div className="dashboard-summary-card dashboard-summary-card-success">
              <div className="dashboard-summary-header">
                <span className="dashboard-summary-title">Active (7d)</span>
                <Activity className="dashboard-summary-icon" />
              </div>
              <div className="dashboard-summary-value">
                {healthData.summary.activeTenants}
              </div>
              <div className="dashboard-summary-subtext">
                Updated in past week
              </div>
            </div>

            <div className="dashboard-summary-card dashboard-summary-card-warning">
              <div className="dashboard-summary-header">
                <span className="dashboard-summary-title">Idle (30d)</span>
                <Clock className="dashboard-summary-icon" />
              </div>
              <div className="dashboard-summary-value">
                {healthData.summary.idleTenants}
              </div>
              <div className="dashboard-summary-subtext">
                No recent activity
              </div>
            </div>

            <div className="dashboard-summary-card dashboard-summary-card-danger">
              <div className="dashboard-summary-header">
                <span className="dashboard-summary-title">Inactive</span>
                <AlertCircle className="dashboard-summary-icon" />
              </div>
              <div className="dashboard-summary-value">
                {healthData.summary.inactiveTenants}
              </div>
              <div className="dashboard-summary-subtext">
                May need attention
              </div>
            </div>
          </div>

          {/* Tier Distribution */}
          <div className="dashboard-home-card">
            <h3 className="dashboard-section-title">Subscription Tiers</h3>
            <div className="dashboard-tier-grid">
              <div className="dashboard-tier-card">
                <div className="dashboard-tier-icon dashboard-tier-icon-builder">
                  <Crown className="h-5 w-5" />
                </div>
                <div className="dashboard-tier-content">
                  <div className="dashboard-tier-label">Builder Tier</div>
                  <div className="dashboard-tier-value">
                    {healthData.summary.builderTier}
                  </div>
                </div>
              </div>
              <div className="dashboard-tier-card">
                <div className="dashboard-tier-icon dashboard-tier-icon-editor">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="dashboard-tier-content">
                  <div className="dashboard-tier-label">Content Editor</div>
                  <div className="dashboard-tier-value">
                    {healthData.summary.contentEditorTier}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Health Table */}
          <div className="dashboard-home-card">
            <div className="dashboard-section-header">
              <h3 className="dashboard-section-title">Client Health Monitor</h3>
              <span className="dashboard-section-badge">
                {healthData.tenants.length} clients
              </span>
            </div>
            <div className="dashboard-health-table">
              <div className="dashboard-health-header">
                <div className="dashboard-health-cell dashboard-health-cell-name">
                  Client
                </div>
                <div className="dashboard-health-cell">Status</div>
                <div className="dashboard-health-cell">Tier</div>
                <div className="dashboard-health-cell">Content</div>
                <div className="dashboard-health-cell">Activity (7d)</div>
                <div className="dashboard-health-cell">Last Active</div>
                <div className="dashboard-health-cell"></div>
              </div>
              {healthData.tenants.map((tenant) => (
                <Link
                  key={tenant.id}
                  href={`/${tenant.id}/pages`}
                  className="dashboard-health-row"
                >
                  <div className="dashboard-health-cell dashboard-health-cell-name">
                    <span className="dashboard-health-name">
                      {tenant.businessName}
                    </span>
                    <span className="dashboard-health-slug">
                      /{tenant.slug}
                    </span>
                  </div>
                  <div className="dashboard-health-cell">
                    <div
                      className={`dashboard-health-status dashboard-health-status-${tenant.healthStatus}`}
                    >
                      {getHealthIcon(tenant.healthStatus)}
                      <span>{getHealthLabel(tenant.healthStatus)}</span>
                    </div>
                  </div>
                  <div className="dashboard-health-cell">
                    <span
                      className={`dashboard-health-tier dashboard-health-tier-${tenant.tier.toLowerCase()}`}
                    >
                      {tenant.tier === "BUILDER" ? "Builder" : "Editor"}
                    </span>
                  </div>
                  <div className="dashboard-health-cell">
                    <div className="dashboard-health-content">
                      <FileText className="h-3.5 w-3.5" />
                      <span>{tenant.counts.pages}</span>
                      <Users className="h-3.5 w-3.5 ml-2" />
                      <span>{tenant.counts.teamMembers}</span>
                    </div>
                  </div>
                  <div className="dashboard-health-cell">
                    {tenant.recentActivity.total > 0 ? (
                      <div className="dashboard-health-activity">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span>{tenant.recentActivity.total} updates</span>
                      </div>
                    ) : (
                      <span className="dashboard-health-no-activity">
                        No activity
                      </span>
                    )}
                  </div>
                  <div className="dashboard-health-cell">
                    <span className="dashboard-health-last-active">
                      {formatRelativeTime(tenant.lastActivity)}
                    </span>
                  </div>
                  <div className="dashboard-health-cell">
                    <ChevronRight className="h-4 w-4 text-(--muted-foreground)" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : null}
      </div>
    </PageLayout>
  );
}
