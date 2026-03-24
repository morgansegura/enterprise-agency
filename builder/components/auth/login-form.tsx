"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { login } from "@/lib/auth";
import { AuthError, getErrorMessage } from "@/lib/errors";
import { logger } from "@/lib/logger";

import "./auth-form.css";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      logger.log("Login attempt", { email });
      await login(email, password);
      logger.log("Login successful, redirecting to dashboard");
      router.push("/clients");
    } catch (err) {
      const message = getErrorMessage(err);

      if (err instanceof AuthError) {
        if (err.code === "INVALID_CREDENTIALS") {
          toast.error("Invalid email or password");
        } else if (err.code === "UNAUTHORIZED") {
          toast.error("Access denied");
        } else {
          toast.error(message || "Something went wrong");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }

      logger.error("Login failed", err as Error, { email });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <span className="auth-logo">Enterprise</span>
        <p className="auth-subtitle">Sign in to your account</p>
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
              className="auth-input"
              placeholder="you@company.com"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password" className="auth-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
            <div className="auth-forgot">
              <Link href="/forgot-password" className="auth-forgot-link">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>

        <div className="auth-actions">
          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
