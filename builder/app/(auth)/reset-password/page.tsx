"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { logger } from "@/lib/logger";
import { FormItem } from "@/components/ui/form";

import "@/components/auth/auth-form.css";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
    }
  }, [token]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      logger.log("Reset password attempt");
      const message = await resetPassword(token, password);
      setSuccess(message || "Password reset successful");
      logger.log("Password reset successful");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(
        message || "Failed to reset password. The link may have expired.",
      );
      logger.error("Password reset failed", err as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-card">
        <div className="auth-form-header">
          <h2 className="auth-form-title">Set New Password</h2>
          <p className="auth-form-subtitle">Enter your new password below</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-form-error">
              <p className="auth-form-error-text">{error}</p>
            </div>
          )}

          {success && (
            <div className="auth-form-success">
              <p className="auth-form-success-text">{success}</p>
              <p className="auth-form-success-subtext">
                Redirecting to login...
              </p>
            </div>
          )}

          <div className="auth-form-fields">
            <FormItem>
              <Label htmlFor="password" className="auth-form-label">
                New Password
              </Label>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || success.length > 0 || !token}
                className="auth-form-input"
                placeholder="At least 8 characters"
              />
            </FormItem>

            <FormItem>
              <Label htmlFor="confirmPassword" className="auth-form-label">
                Confirm New Password
              </Label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading || success.length > 0 || !token}
                className="auth-form-input"
                placeholder="Confirm your password"
              />
            </FormItem>
          </div>

          <div className="auth-form-actions">
            <button
              type="submit"
              disabled={loading || success.length > 0 || !token}
              className="auth-form-submit"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>

            <div className="auth-form-link-container">
              <Link href="/login" className="auth-form-link">
                Back to login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
