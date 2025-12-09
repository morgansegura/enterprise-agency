import { ApiError, AuthError } from "./errors";
import { logger } from "./logger";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface ApiErrorResponse {
  message?: string;
  statusCode?: number;
  error?: string;
  code?: string;
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly authBaseUrl: string;

  constructor() {
    this.baseUrl = `${API_URL}/api/v1`;
    this.authBaseUrl = `${API_URL}/api/v1/auth`;
  }

  private tenantId: string | null = null;

  setTenantId(tenantId: string) {
    this.tenantId = tenantId;
  }

  clearTenantId() {
    this.tenantId = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useAuthBase = false,
    retryCount = 0,
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add tenant ID header if set
    if (this.tenantId && !useAuthBase) {
      headers["x-tenant-id"] = this.tenantId;
    }

    const baseUrl = useAuthBase ? this.authBaseUrl : this.baseUrl;
    const url = `${baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include", // Include cookies for authentication
      });

      if (!response.ok) {
        // Try to refresh token on 401 and retry once
        if (
          response.status === 401 &&
          retryCount === 0 &&
          !endpoint.includes("/refresh")
        ) {
          const refreshed = await this.refreshTokenIfNeeded();
          if (refreshed) {
            return this.request<T>(
              endpoint,
              options,
              useAuthBase,
              retryCount + 1,
            );
          }
        }

        await this.handleErrorResponse(response);
      }

      // Handle empty responses
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json() as Promise<T>;
      }

      return {} as T;
    } catch (error) {
      logger.error("API request failed", error as Error, {
        url,
        method: options.method,
      });
      throw error;
    }
  }

  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorData: ApiErrorResponse = {};

    try {
      errorData = (await response.json()) as ApiErrorResponse;
    } catch {
      // Response body is not JSON
    }

    const message =
      errorData.message || errorData.error || `API Error: ${response.status}`;

    // Handle auth-specific errors
    if (response.status === 401) {
      throw new AuthError(message, "UNAUTHORIZED");
    }

    if (response.status === 403) {
      throw new AuthError(message, "FORBIDDEN");
    }

    // General API error
    throw new ApiError(
      message,
      response.status,
      errorData.code,
      errorData as Record<string, unknown>,
    );
  }

  async refreshTokenIfNeeded(): Promise<boolean> {
    if (this.isRefreshing) {
      return this.refreshPromise!;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        await fetch(`${this.authBaseUrl}/refresh`, {
          method: "POST",
          credentials: "include",
        });
        return true;
      } catch {
        return false;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T, D = unknown>(endpoint: string, data?: D): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T, D = unknown>(endpoint: string, data?: D): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T, D = Record<string, unknown>>(
    endpoint: string,
    data?: D,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // Auth-specific methods (use auth base URL)
  async authPost<T, D = Record<string, unknown>>(
    endpoint: string,
    data?: D,
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      },
      true, // Use auth base URL
    );
  }

  async authGet<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" }, true);
  }
}

export const apiClient = new ApiClient();
