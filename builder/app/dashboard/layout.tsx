"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { useAuthStore } from "@/lib/stores/auth-store";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Dashboard Layout - Protected by authentication
 *
 * Enterprise practices:
 * - Auth guard ensures only authenticated users can access
 * - Automatic redirect to login if not authenticated
 * - Loading state during auth check
 * - Logout functionality with proper cleanup
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if API fails, clear local state and redirect
      useAuthStore.getState().logout();
      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  Web & Funnel Builder
                </h1>
              </div>
              <div className="flex items-center gap-4">
                {user && (
                  <span className="text-sm text-gray-600">
                    {user.firstName} {user.lastName}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
