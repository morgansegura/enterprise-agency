"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logger } from "@/lib/logger";
import { FormItem } from "@/components/ui/form";

import "@/components/auth/auth-form.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      logger.log("Forgot password request", { email });
      const message = await forgotPassword(email);
      setSuccess(
        message || "Password reset instructions have been sent to your email",
      );
      setEmail("");
      logger.log("Forgot password successful", { email });
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message || "Failed to send reset email. Please try again.");
      logger.error("Forgot password failed", err as Error, { email });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-card">
        <div className="auth-form-header">
          <h2 className="auth-form-title">Reset Password</h2>
          <p className="auth-form-subtitle">
            Enter your email address and we&apos;ll send you instructions to
            reset your password
          </p>
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
            </div>
          )}

          <div className="auth-form-fields">
            <FormItem>
              <Label htmlFor="email" className="auth-form-label">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="auth-form-input"
              />
            </FormItem>
          </div>

          <div className="auth-form-actions">
            <button
              type="submit"
              disabled={loading}
              className="auth-form-submit"
            >
              {loading ? "Sending..." : "Send Reset Instructions"}
            </button>

            <div className="auth-form-link-container">
              <Link href="/" className="auth-form-link">
                Back to login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
