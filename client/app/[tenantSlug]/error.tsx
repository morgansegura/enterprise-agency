"use client";

import "./error.css";

export default function TenantError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="tenant-error">
      <h2 className="tenant-error-title">Something went wrong</h2>
      <p className="tenant-error-message">
        {error.message ||
          "An unexpected error occurred while loading this page."}
      </p>
      <button onClick={reset} className="tenant-error-button">
        Try again
      </button>
    </div>
  );
}
