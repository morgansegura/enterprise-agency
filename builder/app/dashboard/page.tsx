"use client";

import { useAuthStore } from "@/lib/stores/auth-store";

/**
 * Dashboard Home Page
 * Welcome screen after login
 */
export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName}!
        </h2>
        <p className="text-gray-600">
          Manage your clients and build stunning websites from this dashboard.
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Account Information
        </h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {user?.firstName} {user?.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Role</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {user?.agencyRole || "User"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Admin Access</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {user?.isSuperAdmin ? "Yes" : "No"}
            </dd>
          </div>
        </dl>
      </div>

      {/* Tenants Section */}
      {user?.tenants && user.tenants.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Clients ({user.tenants.length})
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {user.tenants.map((tenant) => (
              <div
                key={tenant.id}
                className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
              >
                <h4 className="font-medium text-gray-900">
                  {tenant.businessName}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Slug: {tenant.slug}
                </p>
                <p className="text-sm text-gray-500">Role: {tenant.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="mt-2 text-sm font-medium text-gray-900">
              New Client
            </span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="mt-2 text-sm font-medium text-gray-900">
              New Page
            </span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="mt-2 text-sm font-medium text-gray-900">
              Upload Asset
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
