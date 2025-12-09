"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initializeAuth } from "@/lib/auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import { logger } from "@/lib/logger";
import { LoginSkeleton } from "@/components/auth/login-skeleton";

/**
 * Auth Provider - Initializes authentication on app load
 *
 * Enterprise practices:
 * - Validates session via HTTP-only cookies
 * - Handles token refresh automatically
 * - Updates Zustand store with current user
 * - Provides skeleton loader during initialization
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    // Initialize auth on mount
    initializeAuth().catch((error: Error) => {
      logger.error("Failed to initialize auth", error);
    });
  }, []);

  // Show skeleton loader during initial auth check
  // Only show login skeleton on auth pages, otherwise show generic loading
  if (isLoading) {
    const isAuthPage =
      pathname?.startsWith("/login") ||
      pathname?.startsWith("/forgot-password") ||
      pathname?.startsWith("/reset-password");

    if (isAuthPage) {
      return <LoginSkeleton />;
    }

    // Generic skeleton for other pages
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
