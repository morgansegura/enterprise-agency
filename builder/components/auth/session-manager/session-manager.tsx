"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/stores/auth-store";
import { SessionWarningDialog } from "@/components/auth/session-warning-dialog";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE_TIMEOUT = 2 * 60 * 1000; // 2 minutes
const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
];

export function SessionManager() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // eslint-disable-next-line react-hooks/purity -- initial timestamp for session tracking is intentionally impure
  const lastActivityRef = useRef<number>(Date.now());
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [showWarning, setShowWarning] = useState(false);
  const [timeUntilLogout, setTimeUntilLogout] = useState(0);

  const logoutDueToInactivity = useCallback(() => {
    toast.error("Session expired", {
      description: "You've been logged out due to inactivity",
      id: "inactivity-logout",
    });
    useAuthStore.getState().logout();
    setTimeout(() => router.push("/login"), 500);
  }, [router]);

  const showInactivityWarning = useCallback(() => {
    setTimeUntilLogout(WARNING_BEFORE_TIMEOUT);
    setShowWarning(true);

    const countdown = setInterval(() => {
      setTimeUntilLogout((prev) => {
        const next = prev - 1000;
        if (next <= 0) {
          clearInterval(countdown);
          setShowWarning(false);
          logoutDueToInactivity();
        }
        return next;
      });
    }, 1000);

    warningTimerRef.current = countdown;
  }, [logoutDueToInactivity]);

  const resetInactivityTimer = useCallback(() => {
    lastActivityRef.current = Date.now();

    if (showWarning) {
      setShowWarning(false);
      if (warningTimerRef.current) clearInterval(warningTimerRef.current);
    }

    if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);

    activityTimeoutRef.current = setTimeout(
      showInactivityWarning,
      INACTIVITY_TIMEOUT - WARNING_BEFORE_TIMEOUT,
    );
  }, [showWarning, showInactivityWarning]);

  const extendSession = useCallback(() => {
    resetInactivityTimer();
    setShowWarning(false);
    toast.success("Session extended");
  }, [resetInactivityTimer]);

  useEffect(() => {
    if (!isAuthenticated) return;

    lastActivityRef.current = Date.now();
    activityTimeoutRef.current = setTimeout(
      showInactivityWarning,
      INACTIVITY_TIMEOUT - WARNING_BEFORE_TIMEOUT,
    );

    const handleActivity = () => resetInactivityTimer();

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
      if (warningTimerRef.current) clearInterval(warningTimerRef.current);
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated, showInactivityWarning, resetInactivityTimer]);

  if (!isAuthenticated) return null;

  return (
    <SessionWarningDialog
      open={showWarning}
      timeUntilLogout={timeUntilLogout}
      onExtendSession={extendSession}
    />
  );
}
