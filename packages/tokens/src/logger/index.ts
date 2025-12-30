/**
 * Logger Utility
 *
 * Unified logging utility for the enterprise platform.
 * Features:
 * - Environment-aware output (colored dev, JSON prod)
 * - Type-safe context and metadata
 * - Singleton pattern with configurable instances
 */

// =============================================================================
// Types
// =============================================================================

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  [key: string]: unknown;
}

export interface LogOptions {
  /** Named context for the log (e.g., component name, module) */
  context?: string;
  /** Additional metadata to include in the log */
  meta?: LogContext;
}

/**
 * Check if value is a LogOptions object (has context or meta keys)
 * vs a plain context object (arbitrary key/value pairs)
 */
function isLogOptions(value: unknown): value is LogOptions {
  if (!value || typeof value !== "object") return false;
  const keys = Object.keys(value);
  // If it only has context and/or meta keys, treat as LogOptions
  return keys.every((k) => k === "context" || k === "meta");
}

/**
 * Normalize options to handle both old context-style and new LogOptions-style
 */
function normalizeOptions(
  options?: LogOptions | LogContext,
): LogOptions | undefined {
  if (!options) return undefined;
  if (isLogOptions(options)) return options;
  // Treat as legacy context object - wrap in meta
  return { meta: options as LogContext };
}

export interface LoggerConfig {
  /** Override environment detection */
  isDevelopment?: boolean;
  /** Minimum log level to output */
  minLevel?: LogLevel;
}

// =============================================================================
// Logger Implementation
// =============================================================================

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const LOG_COLORS: Record<LogLevel, string> = {
  debug: "\x1b[35m", // Magenta
  info: "\x1b[36m", // Cyan
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m", // Red
};

const RESET_COLOR = "\x1b[0m";

export class Logger {
  private isDevelopment: boolean;
  private minLevel: LogLevel;

  constructor(config?: LoggerConfig) {
    // Check both common env variables
    this.isDevelopment =
      config?.isDevelopment ??
      (typeof process !== "undefined" &&
        (process.env.NODE_ENV === "development" ||
          process.env.NEXT_PUBLIC_ENV === "development"));
    this.minLevel = config?.minLevel ?? "debug";
  }

  /**
   * Log a debug message (development only)
   */
  debug(message: string, options?: LogOptions | LogContext): void {
    this.print("debug", message, normalizeOptions(options));
  }

  /**
   * Log an info message
   */
  info(message: string, options?: LogOptions | LogContext): void {
    this.print("info", message, normalizeOptions(options));
  }

  /**
   * Alias for info()
   */
  log(message: string, options?: LogOptions | LogContext): void {
    this.print("info", message, normalizeOptions(options));
  }

  /**
   * Log a warning message
   */
  warn(message: string, options?: LogOptions | LogContext): void {
    this.print("warn", message, normalizeOptions(options));
  }

  /**
   * Log an error message
   */
  error(
    message: string,
    error?: Error | unknown,
    options?: LogOptions | LogContext,
  ): void {
    this.print("error", message, normalizeOptions(options), error);
  }

  /**
   * Internal print method
   */
  private print(
    level: LogLevel,
    message: string,
    options?: LogOptions,
    error?: Error | unknown,
  ): void {
    // Check minimum level
    if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[this.minLevel]) {
      return;
    }

    // In production, only log warn and error unless explicitly configured
    if (!this.isDevelopment && level !== "warn" && level !== "error") {
      return;
    }

    const timestamp = new Date().toISOString();
    const context = options?.context ? `[${options.context}]` : "";

    if (this.isDevelopment) {
      // Development: Pretty print with colors
      const color = LOG_COLORS[level];
      console.log(
        `${color}[${timestamp}] [${level.toUpperCase()}]${RESET_COLOR}${context ? ` ${context}` : ""} ${message}`,
      );

      if (options?.meta && Object.keys(options.meta).length > 0) {
        console.log(`${color}  Meta:${RESET_COLOR}`, options.meta);
      }

      if (error) {
        console.log(`${color}  Error:${RESET_COLOR}`, error);
      }
    } else {
      // Production: JSON output for log aggregation
      const logEntry: Record<string, unknown> = {
        timestamp,
        level,
        message,
        ...(options?.context && { context: options.context }),
        ...(options?.meta && { meta: options.meta }),
      };

      // Add error details
      if (error instanceof Error) {
        logEntry.error = {
          name: error.name,
          message: error.message,
          stack: error.stack,
        };
      } else if (error) {
        logEntry.error = error;
      }

      const consoleMethod = level === "error" ? console.error : console.log;
      consoleMethod(JSON.stringify(logEntry));
    }
  }
}

// =============================================================================
// Singleton Instance
// =============================================================================

export const logger = new Logger();

// =============================================================================
// Factory Function
// =============================================================================

/**
 * Create a logger with custom configuration
 */
export function createLogger(config?: LoggerConfig): Logger {
  return new Logger(config);
}
