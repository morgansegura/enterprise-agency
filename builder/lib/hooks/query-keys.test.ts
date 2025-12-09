import { describe, it, expect } from "vitest";
import { queryKeys } from "./query-keys";

describe("queryKeys", () => {
  describe("admin.users", () => {
    it("should generate all users key without filters", () => {
      const key = queryKeys.admin.users.all();
      expect(key).toEqual(["admin", "users", undefined]);
    });

    it("should generate all users key with filters", () => {
      const key = queryKeys.admin.users.all({ includeDeleted: true });
      expect(key).toEqual(["admin", "users", { includeDeleted: true }]);
    });

    it("should generate user detail key", () => {
      const key = queryKeys.admin.users.detail("user-123");
      expect(key).toEqual(["admin", "users", "user-123"]);
    });

    it("should generate user search key", () => {
      const key = queryKeys.admin.users.search("john");
      expect(key).toEqual(["admin", "users", "search", "john"]);
    });
  });

  describe("admin.features", () => {
    it("should generate available features key", () => {
      const key = queryKeys.admin.features.available();
      expect(key).toEqual(["admin", "features", "available"]);
    });

    it("should generate tenant features key", () => {
      const key = queryKeys.admin.features.tenant("tenant-456");
      expect(key).toEqual(["admin", "features", "tenant", "tenant-456"]);
    });
  });

  describe("admin.projects", () => {
    it("should generate assignments key without filters", () => {
      const key = queryKeys.admin.projects.assignments();
      expect(key).toEqual(["admin", "projects", "assignments", undefined]);
    });

    it("should generate assignments key with tenant filter", () => {
      const key = queryKeys.admin.projects.assignments({ tenantId: "t1" });
      expect(key).toEqual([
        "admin",
        "projects",
        "assignments",
        { tenantId: "t1" },
      ]);
    });

    it("should generate assignments key with user filter", () => {
      const key = queryKeys.admin.projects.assignments({ userId: "u1" });
      expect(key).toEqual([
        "admin",
        "projects",
        "assignments",
        { userId: "u1" },
      ]);
    });

    it("should generate assignments key with combined filters", () => {
      const key = queryKeys.admin.projects.assignments({
        tenantId: "t1",
        userId: "u1",
      });
      expect(key).toEqual([
        "admin",
        "projects",
        "assignments",
        { tenantId: "t1", userId: "u1" },
      ]);
    });

    it("should generate project detail key", () => {
      const key = queryKeys.admin.projects.detail("project-789");
      expect(key).toEqual(["admin", "projects", "assignments", "project-789"]);
    });
  });

  describe("admin.tenants", () => {
    it("should generate all tenants key", () => {
      const key = queryKeys.admin.tenants.all();
      expect(key).toEqual(["admin", "tenants"]);
    });

    it("should generate tenant detail key", () => {
      const key = queryKeys.admin.tenants.detail("tenant-abc");
      expect(key).toEqual(["admin", "tenants", "tenant-abc"]);
    });

    it("should generate tenant stats key", () => {
      const key = queryKeys.admin.tenants.stats("tenant-abc");
      expect(key).toEqual(["admin", "tenants", "tenant-abc", "stats"]);
    });

    it("should generate tenant activity key without days", () => {
      const key = queryKeys.admin.tenants.activity("tenant-abc");
      expect(key).toEqual([
        "admin",
        "tenants",
        "tenant-abc",
        "activity",
        { days: undefined },
      ]);
    });

    it("should generate tenant activity key with days", () => {
      const key = queryKeys.admin.tenants.activity("tenant-abc", 7);
      expect(key).toEqual([
        "admin",
        "tenants",
        "tenant-abc",
        "activity",
        { days: 7 },
      ]);
    });
  });

  describe("tenants", () => {
    it("should generate all tenants key", () => {
      const key = queryKeys.tenants.all();
      expect(key).toEqual(["tenants"]);
    });

    it("should generate tenant detail key", () => {
      const key = queryKeys.tenants.detail("tenant-xyz");
      expect(key).toEqual(["tenants", "tenant-xyz"]);
    });
  });

  describe("key hierarchy", () => {
    it("should allow hierarchical invalidation patterns", () => {
      // Admin keys should all start with 'admin'
      expect(queryKeys.admin.users.all()[0]).toBe("admin");
      expect(queryKeys.admin.features.available()[0]).toBe("admin");
      expect(queryKeys.admin.projects.assignments()[0]).toBe("admin");
      expect(queryKeys.admin.tenants.all()[0]).toBe("admin");
    });

    it("should generate unique keys for different resources", () => {
      const usersKey = queryKeys.admin.users.all();
      const tenantsKey = queryKeys.admin.tenants.all();

      // Keys should be different
      expect(usersKey).not.toEqual(tenantsKey);
    });

    it("should generate consistent keys for same inputs", () => {
      const key1 = queryKeys.admin.users.detail("user-1");
      const key2 = queryKeys.admin.users.detail("user-1");

      expect(key1).toEqual(key2);
    });

    it("should generate different keys for different inputs", () => {
      const key1 = queryKeys.admin.users.detail("user-1");
      const key2 = queryKeys.admin.users.detail("user-2");

      expect(key1).not.toEqual(key2);
    });
  });
});
