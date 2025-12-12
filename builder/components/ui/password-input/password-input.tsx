"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import "./password-input.css";

interface PasswordInputProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
}

function PasswordInput({
  className,
  showPasswordLabel = "Show password",
  hidePasswordLabel = "Hide password",
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div data-slot="password-input-wrapper">
      <Input
        type={showPassword ? "text" : "password"}
        data-slot="password-input"
        className={cn(className)}
        {...props}
      />
      <button
        type="button"
        data-slot="password-input-toggle"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? hidePasswordLabel : showPasswordLabel}
      >
        {showPassword ? (
          <EyeOff data-slot="password-input-icon" />
        ) : (
          <Eye data-slot="password-input-icon" />
        )}
      </button>
    </div>
  );
}

export { PasswordInput };
