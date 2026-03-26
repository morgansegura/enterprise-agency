"use client";

import { LoginForm } from "@/components/auth/login-form";
import "@/components/auth/auth-form.css";

export default function LoginPage() {
  return (
    <div className="auth-layout">
      <LoginForm />
    </div>
  );
}
