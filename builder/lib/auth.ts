import { apiClient } from "./api-client";
import { useAuthStore } from "./stores/auth-store";
import { logger } from "./logger";
import { AuthError, getErrorMessage } from "./errors";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isSuperAdmin: boolean;
  agencyRole: string | null;
  emailVerified: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  tenants?: Array<{
    id: string;
    slug: string;
    businessName: string;
    role: string;
    permissions?: Record<string, unknown>;
  }>;
}

interface LoginResponse {
  user: User;
  message: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  token: string;
  password: string;
}

interface VerifyEmailResponse {
  message: string;
}

interface ForgotPasswordResponse {
  message: string;
}

/**
 * Login with email and password
 * Uses HTTP-only cookies for secure token storage
 */
export async function login(email: string, password: string): Promise<User> {
  try {
    logger.log("Attempting login", { email });

    const credentials: LoginCredentials = { email, password };
    const response = await apiClient.authPost<LoginResponse, LoginCredentials>(
      "/login",
      credentials,
    );

    // Update Zustand store
    useAuthStore.getState().login(response.user, null);

    logger.log("Login successful", { userId: response.user.id });
    return response.user;
  } catch (error) {
    const message = getErrorMessage(error);
    logger.error("Login failed", error as Error, { email });
    throw new AuthError(message, "INVALID_CREDENTIALS");
  }
}

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<User> {
  try {
    logger.log("Attempting registration", { email: data.email });

    const response = await apiClient.authPost<LoginResponse, RegisterData>(
      "/register",
      data,
    );

    // Auto-login after registration
    useAuthStore.getState().login(response.user, null);

    logger.log("Registration successful", { userId: response.user.id });
    return response.user;
  } catch (error) {
    const message = getErrorMessage(error);
    logger.error("Registration failed", error as Error, { email: data.email });
    throw new AuthError(message, "INVALID_CREDENTIALS");
  }
}

/**
 * Logout current user
 * Clears HTTP-only cookies on server and clears local state
 */
export async function logout(): Promise<void> {
  try {
    logger.log("Attempting logout");

    // Call API to clear HTTP-only cookies
    await apiClient.authPost<void>("/logout");

    // Clear Zustand store
    useAuthStore.getState().logout();

    logger.log("Logout successful");
  } catch (error) {
    const message = getErrorMessage(error);
    logger.error("Logout failed", error as Error);

    // Clear store anyway
    useAuthStore.getState().logout();

    throw new AuthError(message, "UNAUTHORIZED");
  }
}

/**
 * Get current authenticated user
 * Validates session via HTTP-only cookie
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await apiClient.authGet<User>("/me");

    // Update Zustand store
    useAuthStore.getState().setUser(user);
    useAuthStore.getState().setLoading(false);

    logger.log("Current user fetched", { userId: user.id });
    return user;
  } catch (error) {
    logger.log("No authenticated user");

    // Clear store on auth failure
    useAuthStore.getState().logout();

    return null;
  }
}

/**
 * Refresh access token
 * Uses refresh token from HTTP-only cookie
 */
export async function refreshToken(): Promise<boolean> {
  try {
    logger.log("Refreshing access token");

    await apiClient.authPost<void>("/refresh");

    logger.log("Token refreshed successfully");
    return true;
  } catch (error) {
    logger.error("Token refresh failed", error as Error);

    // Clear store on refresh failure
    useAuthStore.getState().logout();

    return false;
  }
}

/**
 * Initialize auth state on app load
 * Fetches current user if session exists
 */
export async function initializeAuth(): Promise<void> {
  try {
    logger.log("Initializing auth");

    const user = await getCurrentUser();

    if (user) {
      logger.log("Auth initialized with user", { userId: user.id });
    } else {
      logger.log("Auth initialized without user");
      useAuthStore.getState().setLoading(false);
    }
  } catch (error) {
    logger.error("Auth initialization failed", error as Error);
    useAuthStore.getState().setLoading(false);
  }
}

/**
 * Forgot password - Request password reset email
 * Sends reset token to user's email
 */
export async function forgotPassword(email: string): Promise<string> {
  try {
    logger.log("Forgot password request", { email });

    const data: ForgotPasswordData = { email };
    const response = await apiClient.authPost<
      ForgotPasswordResponse,
      ForgotPasswordData
    >("/forgot-password", data);

    logger.log("Password reset email sent", { email });
    return response.message;
  } catch (error) {
    const message = getErrorMessage(error);
    logger.error("Forgot password failed", error as Error, { email });
    throw new AuthError(message, "UNAUTHORIZED");
  }
}

/**
 * Reset password with token
 * Updates user password using reset token from email
 */
export async function resetPassword(
  token: string,
  password: string,
): Promise<string> {
  try {
    logger.log("Reset password attempt", {
      token: token.substring(0, 10) + "...",
    });

    const data: ResetPasswordData = { token, password };
    const response = await apiClient.authPost<
      ForgotPasswordResponse,
      ResetPasswordData
    >("/reset-password", data);

    logger.log("Password reset successful");
    return response.message;
  } catch (error) {
    const message = getErrorMessage(error);
    logger.error("Password reset failed", error as Error);
    throw new AuthError(message, "INVALID_CREDENTIALS");
  }
}

/**
 * Verify email with token
 * Confirms user email address using verification token
 */
export async function verifyEmail(token: string): Promise<string> {
  try {
    logger.log("Email verification attempt", {
      token: token.substring(0, 10) + "...",
    });

    const response = await apiClient.authGet<VerifyEmailResponse>(
      `/verify-email?token=${encodeURIComponent(token)}`,
    );

    logger.log("Email verified successfully");
    return response.message;
  } catch (error) {
    const message = getErrorMessage(error);
    logger.error("Email verification failed", error as Error);
    throw new AuthError(message, "INVALID_CREDENTIALS");
  }
}

/**
 * Resend verification email
 * Sends a new verification email to the user
 */
export async function resendVerificationEmail(email: string): Promise<string> {
  try {
    logger.log("Resend verification email", { email });

    const response = await apiClient.authPost<
      VerifyEmailResponse,
      { email: string }
    >("/resend-verification", { email });

    logger.log("Verification email sent", { email });
    return response.message;
  } catch (error) {
    const message = getErrorMessage(error);
    logger.error("Resend verification failed", error as Error, { email });
    throw new AuthError(message, "UNAUTHORIZED");
  }
}
