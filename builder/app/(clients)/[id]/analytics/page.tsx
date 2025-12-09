"use client";

import { useParams } from "next/navigation";
import { useTenantStats } from "@/lib/hooks/use-tenants";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Newspaper,
  Image,
  Users,
  Package,
  ShoppingCart,
  UserCircle,
  HardDrive,
  Activity,
  Calendar,
  TrendingUp,
  Clock,
} from "lucide-react";

import "./analytics.css";

function formatBytes(mb: number): string {
  if (mb < 1) {
    return `${Math.round(mb * 1024)} KB`;
  }
  if (mb < 1024) {
    return `${mb.toFixed(1)} MB`;
  }
  return `${(mb / 1024).toFixed(2)} GB`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function AnalyticsPage() {
  const params = useParams();
  const tenantId = params?.id as string;
  const { data: stats, isLoading, error } = useTenantStats(tenantId);

  if (error) {
    return (
      <div className="analytics-error">
        <p>Error loading analytics: {error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="analytics-container">
        <div className="analytics-header">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="analytics-grid">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <div className="analytics-section-grid">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const storageLimit = 5120; // 5GB in MB
  const storagePercent = Math.min(
    (stats.storage.mbUsed / storageLimit) * 100,
    100,
  );

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>Analytics</h1>
        <p>Overview of your workspace activity and usage</p>
      </div>

      {/* Main Stats Grid */}
      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-card-header">
            <span className="analytics-card-title">Total Pages</span>
            <FileText className="analytics-card-icon" />
          </div>
          <div className="analytics-card-value">{stats.totals.pages}</div>
          <div className="analytics-card-subtext">
            {stats.content.publishedPages} published, {stats.content.draftPages}{" "}
            drafts
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-header">
            <span className="analytics-card-title">Blog Posts</span>
            <Newspaper className="analytics-card-icon" />
          </div>
          <div className="analytics-card-value">{stats.totals.posts}</div>
          <div className="analytics-card-subtext">
            {stats.content.publishedPosts} published, {stats.content.draftPosts}{" "}
            drafts
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-header">
            <span className="analytics-card-title">Media Files</span>
            <Image className="analytics-card-icon" />
          </div>
          <div className="analytics-card-value">{stats.totals.assets}</div>
          <div className="analytics-card-subtext">
            {formatBytes(stats.storage.mbUsed)} used
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-header">
            <span className="analytics-card-title">Team Members</span>
            <Users className="analytics-card-icon" />
          </div>
          <div className="analytics-card-value">{stats.totals.teamMembers}</div>
          <div className="analytics-card-subtext">Active collaborators</div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="analytics-section">
        <h2 className="analytics-section-title">
          Recent Activity (Last 7 Days)
        </h2>
        <div className="analytics-section-grid">
          <div className="analytics-stat-card">
            <div className="analytics-stat-icon">
              <FileText className="h-5 w-5" />
            </div>
            <div className="analytics-stat-content">
              <div className="analytics-stat-label">Pages Updated</div>
              <div className="analytics-stat-value">
                {stats.recentActivity.pagesUpdated}
              </div>
            </div>
          </div>

          <div className="analytics-stat-card">
            <div className="analytics-stat-icon">
              <Newspaper className="h-5 w-5" />
            </div>
            <div className="analytics-stat-content">
              <div className="analytics-stat-label">Posts Updated</div>
              <div className="analytics-stat-value">
                {stats.recentActivity.postsUpdated}
              </div>
            </div>
          </div>

          <div className="analytics-stat-card">
            <div className="analytics-stat-icon">
              <Image className="h-5 w-5" />
            </div>
            <div className="analytics-stat-content">
              <div className="analytics-stat-label">Files Uploaded</div>
              <div className="analytics-stat-value">
                {stats.recentActivity.assetsUploaded}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commerce Stats (if applicable) */}
      {(stats.totals.products > 0 ||
        stats.totals.orders > 0 ||
        stats.totals.customers > 0) && (
        <div className="analytics-section">
          <h2 className="analytics-section-title">Commerce</h2>
          <div className="analytics-section-grid">
            <div className="analytics-stat-card">
              <div className="analytics-stat-icon">
                <Package className="h-5 w-5" />
              </div>
              <div className="analytics-stat-content">
                <div className="analytics-stat-label">Products</div>
                <div className="analytics-stat-value">
                  {stats.totals.products}
                </div>
              </div>
            </div>

            <div className="analytics-stat-card">
              <div className="analytics-stat-icon">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div className="analytics-stat-content">
                <div className="analytics-stat-label">Orders</div>
                <div className="analytics-stat-value">
                  {stats.totals.orders}
                </div>
              </div>
            </div>

            <div className="analytics-stat-card">
              <div className="analytics-stat-icon">
                <UserCircle className="h-5 w-5" />
              </div>
              <div className="analytics-stat-content">
                <div className="analytics-stat-label">Customers</div>
                <div className="analytics-stat-value">
                  {stats.totals.customers}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Storage & Account Info */}
      <div className="analytics-section">
        <h2 className="analytics-section-title">Storage & Account</h2>
        <div className="analytics-section-grid">
          <div className="analytics-activity-card">
            <div className="analytics-activity-header">
              <HardDrive className="analytics-activity-icon" />
              <span className="analytics-activity-title">Storage Usage</span>
            </div>
            <div className="analytics-activity-list">
              <div className="analytics-activity-item">
                <span className="analytics-activity-label">Used</span>
                <span className="analytics-activity-value">
                  {formatBytes(stats.storage.mbUsed)}
                </span>
              </div>
              <div className="analytics-activity-item">
                <span className="analytics-activity-label">Limit</span>
                <span className="analytics-activity-value">
                  {formatBytes(storageLimit)}
                </span>
              </div>
            </div>
            <div className="analytics-storage-bar">
              <div
                className="analytics-storage-fill"
                style={{ width: `${storagePercent}%` }}
              />
            </div>
          </div>

          <div className="analytics-activity-card">
            <div className="analytics-activity-header">
              <Calendar className="analytics-activity-icon" />
              <span className="analytics-activity-title">Account Info</span>
            </div>
            <div className="analytics-activity-list">
              <div className="analytics-activity-item">
                <span className="analytics-activity-label">Member Since</span>
                <span className="analytics-activity-value">
                  {formatDate(stats.memberSince)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
