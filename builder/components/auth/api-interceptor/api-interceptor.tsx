"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/stores/auth-store";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

/**
 * Global API interceptor that handles auth failures.
 * Listens for auth-error events dispatched by the api-client on unrecoverable 401s.
 * Clears query cache, auth state, and redirects to login.
 */
export function ApiInterceptor() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const isHandling = useRef(false);

  useEffect(() => {
    const handleAuthError = () => {
      if (isHandling.current) return;

      const isAuthPage =
        pathname === "/login" ||
        pathname === "/forgot-password" ||
        pathname === "/reset-password";

      if (isAuthPage) return;

      isHandling.current = true;
      logger.error("Session expired, redirecting to login");

      queryClient.clear();
      useAuthStore.getState().logout();

      toast.error("Session expired", {
        description: "Please sign in again to continue",
        id: "session-expired",
      });

      router.push("/login");

      setTimeout(() => {
        isHandling.current = false;
      }, 2000);
    };

    window.addEventListener("auth:session-expired", handleAuthError);
    return () => {
      window.removeEventListener("auth:session-expired", handleAuthError);
    };
  }, [router, pathname, queryClient]);

  return null;
}
