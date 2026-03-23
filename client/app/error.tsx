"use client";

import "./error.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="error-page">
      <h2 className="error-title">Something went wrong</h2>
      <p className="error-message">{error.message}</p>
      <button onClick={reset} className="error-button">
        Try again
      </button>
    </div>
  );
}
