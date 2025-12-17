"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/auth";
import { AuthError, getErrorMessage } from "@/lib/errors";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { logger } from "@/lib/logger";
import { FormItem } from "@/components/ui/form";

import "./login-form.css";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      logger.log("Login attempt", { email });
      await login(email, password);
      logger.log("Login successful, redirecting to dashboard");
      router.push("/dashboard");
    } catch (err) {
      const message = getErrorMessage(err);

      if (err instanceof AuthError) {
        if (err.code === "INVALID_CREDENTIALS") {
          setError("Invalid email or password");
        } else if (err.code === "UNAUTHORIZED") {
          setError("Access denied");
        } else {
          setError(message);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }

      logger.error("Login failed", err as Error, { email });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form-card">
        <div className="login-form-header">
          <h2 className="login-form-title">Web & Funnel</h2>
          <p className="login-form-subtitle">Sign in to your account</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-form-error">
              <p className="login-form-error-text">{error}</p>
            </div>
          )}
          <div className="login-form-fields">
            <FormItem>
              <Label htmlFor="email" className="login-form-label">
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
                className="login-form-input"
              />
            </FormItem>
            <FormItem>
              <Label htmlFor="password" className="login-form-label">
                Password
              </Label>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-form-input"
              />
            </FormItem>
          </div>

          <div className="login-form-actions">
            <button
              type="submit"
              disabled={loading}
              className="login-form-submit"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="login-form-forgot">
              <Link href="/forgot-password" className="login-form-forgot-link">
                Forgot your password?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
