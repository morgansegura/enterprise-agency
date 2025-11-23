/**
 * Logger Utility for Client
 * Simple, type-safe logging with environment awareness
 */

type LogLevel = "log" | "info" | "warn" | "error";

interface LogOptions {
  context?: string;
  meta?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private formatMessage(
    level: LogLevel,
    message: string,
    options?: LogOptions,
  ): string {
    const timestamp = new Date().toISOString();
    const context = options?.context ? `[${options.context}]` : "";
    return `${timestamp} ${level.toUpperCase()} ${context} ${message}`;
  }

  log(message: string, options?: LogOptions) {
    if (this.isDevelopment) {
      console.log(
        this.formatMessage("log", message, options),
        options?.meta || "",
      );
    }
  }

  info(message: string, options?: LogOptions) {
    if (this.isDevelopment) {
      console.info(
        this.formatMessage("info", message, options),
        options?.meta || "",
      );
    }
  }

  warn(message: string, options?: LogOptions) {
    if (this.isDevelopment) {
      console.warn(
        this.formatMessage("warn", message, options),
        options?.meta || "",
      );
    }
  }

  error(message: string, error?: Error | unknown, options?: LogOptions) {
    // Always log errors, even in production
    console.error(
      this.formatMessage("error", message, options),
      error || "",
      options?.meta || "",
    );
  }
}

export const logger = new Logger();
