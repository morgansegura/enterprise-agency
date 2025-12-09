import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "./auth-store";

// Mock user data following enterprise patterns
const mockUser = {
  id: "user-1",
  email: "admin@agency.com",
  firstName: "Admin",
  lastName: "User",
  isSuperAdmin: true,
  agencyRole: "owner",
  emailVerified: true,
  status: "active",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  tenants: [
    {
      id: "tenant-1",
      slug: "acme-corp",
      businessName: "Acme Corporation",
      role: "admin",
    },
  ],
};

const mockRegularUser = {
  id: "user-2",
  email: "editor@client.com",
  firstName: "Content",
  lastName: "Editor",
  isSuperAdmin: false,
  agencyRole: null,
  emailVerified: true,
  status: "active",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  tenants: [
    {
      id: "tenant-1",
      slug: "acme-corp",
      businessName: "Acme Corporation",
      role: "editor",
    },
  ],
};

const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token-payload";

describe("AuthStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    // Clear persisted state for isolation
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
    });
  });

  describe("initial state", () => {
    it("should start with null user and token", () => {
      const { user, token } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(token).toBeNull();
    });

    it("should start unauthenticated", () => {
      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
    });

    it("should start with loading true", () => {
      const { isLoading } = useAuthStore.getState();
      expect(isLoading).toBe(true);
    });
  });

  describe("setUser", () => {
    it("should set user and mark as authenticated", () => {
      const { setUser } = useAuthStore.getState();
      setUser(mockUser);

      const { user, isAuthenticated } = useAuthStore.getState();
      expect(user).toEqual(mockUser);
      expect(isAuthenticated).toBe(true);
    });

    it("should clear authentication when user is set to null", () => {
      const { setUser } = useAuthStore.getState();
      setUser(mockUser);
      setUser(null);

      const { user, isAuthenticated } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(isAuthenticated).toBe(false);
    });

    it("should handle user without tenants", () => {
      const { setUser } = useAuthStore.getState();
      const userWithoutTenants = { ...mockUser, tenants: undefined };
      setUser(userWithoutTenants);

      const { user } = useAuthStore.getState();
      expect(user?.tenants).toBeUndefined();
    });
  });

  describe("setToken", () => {
    it("should set JWT token", () => {
      const { setToken } = useAuthStore.getState();
      setToken(mockToken);

      const { token } = useAuthStore.getState();
      expect(token).toBe(mockToken);
    });

    it("should clear token when set to null", () => {
      const { setToken } = useAuthStore.getState();
      setToken(mockToken);
      setToken(null);

      const { token } = useAuthStore.getState();
      expect(token).toBeNull();
    });
  });

  describe("login", () => {
    it("should set user, token, and authentication state", () => {
      const { login } = useAuthStore.getState();
      login(mockUser, mockToken);

      const { user, token, isAuthenticated, isLoading } =
        useAuthStore.getState();
      expect(user).toEqual(mockUser);
      expect(token).toBe(mockToken);
      expect(isAuthenticated).toBe(true);
      expect(isLoading).toBe(false);
    });

    it("should handle super admin login", () => {
      const { login } = useAuthStore.getState();
      login(mockUser, mockToken);

      const { user } = useAuthStore.getState();
      expect(user?.isSuperAdmin).toBe(true);
    });

    it("should handle regular user login", () => {
      const { login } = useAuthStore.getState();
      login(mockRegularUser, mockToken);

      const { user } = useAuthStore.getState();
      expect(user?.isSuperAdmin).toBe(false);
      expect(user?.agencyRole).toBeNull();
    });

    it("should replace existing session on new login", () => {
      const { login } = useAuthStore.getState();
      login(mockUser, "old-token");
      login(mockRegularUser, "new-token");

      const { user, token } = useAuthStore.getState();
      expect(user?.id).toBe("user-2");
      expect(token).toBe("new-token");
    });
  });

  describe("logout", () => {
    it("should clear all authentication state", () => {
      const { login, logout } = useAuthStore.getState();
      login(mockUser, mockToken);
      logout();

      const { user, token, isAuthenticated, isLoading } =
        useAuthStore.getState();
      expect(user).toBeNull();
      expect(token).toBeNull();
      expect(isAuthenticated).toBe(false);
      expect(isLoading).toBe(false);
    });

    it("should be safe to call when already logged out", () => {
      const { logout } = useAuthStore.getState();
      logout();

      const { user, token, isAuthenticated } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(token).toBeNull();
      expect(isAuthenticated).toBe(false);
    });
  });

  describe("setLoading", () => {
    it("should set loading state to true", () => {
      const { setLoading } = useAuthStore.getState();
      setLoading(true);

      const { isLoading } = useAuthStore.getState();
      expect(isLoading).toBe(true);
    });

    it("should set loading state to false", () => {
      const { setLoading } = useAuthStore.getState();
      setLoading(false);

      const { isLoading } = useAuthStore.getState();
      expect(isLoading).toBe(false);
    });
  });

  describe("user permissions", () => {
    it("should correctly store tenant roles", () => {
      const { login } = useAuthStore.getState();
      login(mockUser, mockToken);

      const { user } = useAuthStore.getState();
      expect(user?.tenants?.[0].role).toBe("admin");
    });

    it("should handle multiple tenant assignments", () => {
      const { login } = useAuthStore.getState();
      const multiTenantUser = {
        ...mockUser,
        tenants: [
          {
            id: "t1",
            slug: "tenant-1",
            businessName: "Tenant 1",
            role: "admin",
          },
          {
            id: "t2",
            slug: "tenant-2",
            businessName: "Tenant 2",
            role: "editor",
          },
        ],
      };
      login(multiTenantUser, mockToken);

      const { user } = useAuthStore.getState();
      expect(user?.tenants).toHaveLength(2);
    });
  });

  describe("state persistence", () => {
    it("should maintain authentication state across updates", () => {
      const { login, setLoading } = useAuthStore.getState();
      login(mockUser, mockToken);
      setLoading(true);
      setLoading(false);

      const { isAuthenticated, user, token } = useAuthStore.getState();
      expect(isAuthenticated).toBe(true);
      expect(user).toBeTruthy();
      expect(token).toBeTruthy();
    });
  });
});
