"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { logger } from "@/lib/logger";
import "./auth-guard.css";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireSuperAdmin?: boolean;
  requiredRoles?: string[];
  redirectTo?: string;
}

/**
 * Auth Guard - Protects routes based on authentication and authorization
 *
 * Enterprise practices:
 * - Role-based access control (RBAC)
 * - Super admin checks
 * - Automatic redirect for unauthorized users
 * - Loading states during auth check
 */
export function AuthGuard({
  children,
  requireAuth = true,
  requireSuperAdmin = false,
  requiredRoles = [],
  redirectTo = "/login",
}: AuthGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Wait for auth to initialize
    if (isLoading) return;

    // Redirect if auth is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      logger.log("Auth guard: User not authenticated, redirecting to login");
      router.push(redirectTo);
      return;
    }

    // Check super admin requirement
    if (requireSuperAdmin && !user?.isSuperAdmin) {
      logger.log("Auth guard: Super admin required, redirecting");
      router.push("/clients");
      return;
    }

    // Check role requirements
    if (requiredRoles.length > 0 && user?.agencyRole) {
      if (!requiredRoles.includes(user.agencyRole)) {
        logger.log("Auth guard: Insufficient role, redirecting", {
          userRole: user.agencyRole,
          requiredRoles,
        });
        router.push("/clients");
        return;
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    user,
    requireAuth,
    requireSuperAdmin,
    requiredRoles,
    redirectTo,
    router,
  ]);

  // Show loading state during auth check
  if (isLoading) {
    return (
      <div className="auth-guard-loading">
        <div className="auth-guard-spinner">Verifying access...</div>
      </div>
    );
  }

  // Don't render children if auth check fails
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requireSuperAdmin && !user?.isSuperAdmin) {
    return null;
  }

  if (requiredRoles.length > 0 && user?.agencyRole) {
    if (!requiredRoles.includes(user.agencyRole)) {
      return null;
    }
  }

  return <>{children}</>;
}
