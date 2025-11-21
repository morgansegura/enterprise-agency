"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import "./dashboard-home.css";

export function DashboardHome() {
  const { user } = useAuthStore();

  return (
    <div className="dashboard-home">
      <div className="dashboard-home-card">
        <h2 className="dashboard-home-welcome-title">
          Welcome back, {user?.firstName}!
        </h2>
        <p className="dashboard-home-welcome-subtitle">
          Manage your clients and build stunning websites from this dashboard.
        </p>
      </div>

      {user?.tenants && user.tenants.length > 0 ? (
        <div className="dashboard-home-card">
          <h3 className="dashboard-home-card-title">
            Your Clients ({user.tenants.length})
          </h3>
          <div className="dashboard-home-tenants-grid">
            {user.tenants.map((tenant) => (
              <div key={tenant.id} className="dashboard-home-tenant-card">
                <h4 className="dashboard-home-tenant-name">
                  {tenant.businessName}
                </h4>
                <p className="dashboard-home-tenant-info">
                  Slug: {tenant.slug}
                </p>
                <p className="dashboard-home-tenant-info">
                  Role: {tenant.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
