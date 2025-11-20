import { Injectable, LoggerService, Scope } from "@nestjs/common";

export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
  VERBOSE = "verbose",
}

interface LogContext {
  [key: string]: unknown;
}

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger implements LoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  log(message: string, context?: string | LogContext) {
    this.printMessage(LogLevel.INFO, message, context);
  }

  error(message: string, trace?: string, context?: string | LogContext) {
    this.printMessage(LogLevel.ERROR, message, context, trace);
  }

  warn(message: string, context?: string | LogContext) {
    this.printMessage(LogLevel.WARN, message, context);
  }

  debug(message: string, context?: string | LogContext) {
    if (process.env.NODE_ENV === "development") {
      this.printMessage(LogLevel.DEBUG, message, context);
    }
  }

  verbose(message: string, context?: string | LogContext) {
    if (process.env.NODE_ENV === "development") {
      this.printMessage(LogLevel.VERBOSE, message, context);
    }
  }

  private printMessage(
    level: LogLevel,
    message: string,
    context?: string | LogContext,
    trace?: string,
  ) {
    const timestamp = new Date().toISOString();
    const contextName = typeof context === "string" ? context : this.context;
    const metadata = typeof context === "object" ? context : {};

    const logEntry = {
      timestamp,
      level,
      context: contextName,
      message,
      ...metadata,
      ...(trace && { trace }),
    };

    // In development, pretty print
    if (process.env.NODE_ENV === "development") {
      const color = this.getColor(level);
      const resetColor = "\x1b[0m";
      const contextStr = contextName ? `[${contextName}] ` : "";

      console.log(
        `${color}[${timestamp}] [${level.toUpperCase()}] ${contextStr}${resetColor}${message}`,
      );

      if (Object.keys(metadata).length > 0) {
        console.log(`${color}  Metadata:${resetColor}`, metadata);
      }

      if (trace) {
        console.log(`${color}  Trace:${resetColor}`, trace);
      }
    } else {
      // In production, output JSON for log aggregation
      console.log(JSON.stringify(logEntry));
    }

    // TODO: In the future, send to Sentry for error tracking
    if (level === LogLevel.ERROR && process.env.NODE_ENV === "production") {
      // Future: Sentry.captureException(new Error(message))
    }
  }

  private getColor(level: LogLevel): string {
    switch (level) {
      case LogLevel.ERROR:
        return "\x1b[31m"; // Red
      case LogLevel.WARN:
        return "\x1b[33m"; // Yellow
      case LogLevel.INFO:
        return "\x1b[36m"; // Cyan
      case LogLevel.DEBUG:
        return "\x1b[35m"; // Magenta
      case LogLevel.VERBOSE:
        return "\x1b[90m"; // Gray
      default:
        return "\x1b[0m"; // Reset
    }
  }
}
