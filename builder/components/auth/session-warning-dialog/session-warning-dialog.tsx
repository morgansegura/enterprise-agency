"use client";

import { AlertTriangle } from "lucide-react";

interface SessionWarningDialogProps {
  open: boolean;
  timeUntilLogout: number;
  onExtendSession: () => void;
}

export function SessionWarningDialog({
  open,
  timeUntilLogout,
  onExtendSession,
}: SessionWarningDialogProps) {
  if (!open) return null;

  const minutes = Math.floor(timeUntilLogout / 1000 / 60);
  const seconds = Math.floor((timeUntilLogout / 1000) % 60);

  return (
    <div className="session-warning-overlay">
      <div className="session-warning-dialog">
        <div className="session-warning-header">
          <AlertTriangle className="session-warning-icon" />
          <h2 className="session-warning-title">Session Expiring Soon</h2>
        </div>
        <p className="session-warning-description">
          Your session will expire due to inactivity in{" "}
          <span className="session-warning-countdown">
            {minutes > 0 && `${minutes}m `}
            {seconds}s
          </span>
        </p>
        <p className="session-warning-hint">
          Click below to stay logged in and continue your work.
        </p>
        <div className="session-warning-footer">
          <button onClick={onExtendSession} className="session-warning-button">
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}
