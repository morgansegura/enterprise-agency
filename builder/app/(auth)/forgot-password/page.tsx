"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { forgotPassword } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";
import { logger } from "@/lib/logger";

import "@/components/auth/auth-form.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      logger.log("Forgot password request", { email });
      const message = await forgotPassword(email);
      toast.success(
        message || "Password reset instructions have been sent to your email",
      );
      setEmail("");
      logger.log("Forgot password successful", { email });
    } catch (err) {
      const message = getErrorMessage(err);
      toast.error(message || "Failed to send reset email. Please try again.");
      logger.error("Forgot password failed", err as Error, { email });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <span className="auth-logo">Enterprise</span>
        <p className="auth-subtitle">
          Enter your email and we&apos;ll send you reset instructions
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-fields">
          <div className="auth-field">
            <label htmlFor="email" className="auth-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="auth-input"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div className="auth-actions">
          <button
            type="submit"
            disabled={loading}
            className="auth-submit"
          >
            {loading ? "Sending..." : "Send reset instructions"}
          </button>

          <Link href="/" className="auth-back-link">
            Back to sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
