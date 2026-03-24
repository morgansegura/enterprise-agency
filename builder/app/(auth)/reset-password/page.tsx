"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { resetPassword } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";
import { logger } from "@/lib/logger";

import "@/components/auth/auth-form.css";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [fieldError, setFieldError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token");
    }
  }, [token]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setFieldError("");

    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    if (password.length < 8) {
      setFieldError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setFieldError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      logger.log("Reset password attempt");
      const message = await resetPassword(token, password);
      toast.success(message || "Password reset successful");
      setSuccess(true);
      logger.log("Password reset successful");

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      const message = getErrorMessage(err);
      toast.error(
        message || "Failed to reset password. The link may have expired.",
      );
      logger.error("Password reset failed", err as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <span className="auth-logo">Enterprise</span>
        <p className="auth-subtitle">Set your new password</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {fieldError && <p className="auth-field-error">{fieldError}</p>}

        {success && (
          <p className="auth-success-message">
            Password reset successful. Redirecting to sign in...
          </p>
        )}

        <div className="auth-fields">
          <div className="auth-field">
            <label htmlFor="password" className="auth-label">
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || success || !token}
              className="auth-input"
              placeholder="At least 8 characters"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword" className="auth-label">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading || success || !token}
              className="auth-input"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <div className="auth-actions">
          <button
            type="submit"
            disabled={loading || success || !token}
            className="auth-submit"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>

          <Link href="/" className="auth-back-link">
            Back to sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
