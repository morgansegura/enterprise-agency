/**
 * Enterprise error handling
 * Strict typed errors for better error tracking and handling
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class AuthError extends Error {
  constructor(
    message: string,
    public code:
      | "UNAUTHORIZED"
      | "FORBIDDEN"
      | "SESSION_EXPIRED"
      | "INVALID_CREDENTIALS",
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public fields: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unknown error occurred";
}
