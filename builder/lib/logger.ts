export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
}

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NEXT_PUBLIC_ENV === "development";

  log(message: string, context?: LogContext) {
    this.printMessage(LogLevel.INFO, message, context);
  }

  error(message: string, error?: Error, context?: LogContext) {
    this.printMessage(LogLevel.ERROR, message, context, error);

    // TODO: In the future, send to Sentry
    // if (!this.isDevelopment) {
    //   Sentry.captureException(error || new Error(message))
    // }
  }

  warn(message: string, context?: LogContext) {
    this.printMessage(LogLevel.WARN, message, context);
  }

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      this.printMessage(LogLevel.DEBUG, message, context);
    }
  }

  private printMessage(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error,
  ) {
    const timestamp = new Date().toISOString();

    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      }),
    };

    // In development, pretty print with colors
    if (this.isDevelopment) {
      const color = this.getColor(level);
      const resetColor = "\x1b[0m";

      console.log(
        `${color}[${timestamp}] [${level.toUpperCase()}]${resetColor} ${message}`,
      );

      if (context && Object.keys(context).length > 0) {
        console.log(`${color}  Context:${resetColor}`, context);
      }

      if (error) {
        console.log(`${color}  Error:${resetColor}`, error);
      }
    } else {
      // In production, output JSON for log aggregation
      const consoleMethod =
        level === LogLevel.ERROR ? console.error : console.log;
      consoleMethod(JSON.stringify(logEntry));
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
      default:
        return "\x1b[0m"; // Reset
    }
  }
}

// Export singleton instance
export const logger = new Logger();
