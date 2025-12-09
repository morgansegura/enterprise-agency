import { describe, it, expect, beforeEach } from "vitest";
import { useAdminStore, User, ProjectAssignment } from "./admin-store";

// Mock data following enterprise patterns
const mockUser: User = {
  id: "user-1",
  email: "admin@agency.com",
  firstName: "Admin",
  lastName: "User",
  phone: "+1234567890",
  isSuperAdmin: true,
  agencyRole: "owner",
  status: "active",
  emailVerified: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

const mockUser2: User = {
  id: "user-2",
  email: "designer@agency.com",
  firstName: "Design",
  lastName: "Lead",
  isSuperAdmin: false,
  agencyRole: "designer",
  status: "active",
  emailVerified: true,
  createdAt: "2024-01-02T00:00:00Z",
  updatedAt: "2024-01-02T00:00:00Z",
};

const mockProjectAssignment: ProjectAssignment = {
  id: "assignment-1",
  userId: "user-1",
  tenantId: "tenant-1",
  role: "admin",
  permissions: { canPublish: true, canDelete: true },
  status: "active",
  createdAt: "2024-01-01T00:00:00Z",
  user: mockUser,
  tenant: {
    id: "tenant-1",
    slug: "acme-corp",
    businessName: "Acme Corporation",
  },
};

const mockProjectAssignment2: ProjectAssignment = {
  id: "assignment-2",
  userId: "user-2",
  tenantId: "tenant-2",
  role: "content_manager",
  permissions: { canPublish: false, canDelete: false },
  status: "active",
  createdAt: "2024-01-02T00:00:00Z",
};

describe("AdminStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useAdminStore.setState({
      selectedUser: null,
      selectedProject: null,
      filters: {},
      bulkSelection: [],
    });
  });

  describe("initial state", () => {
    it("should start with null selected user", () => {
      const { selectedUser } = useAdminStore.getState();
      expect(selectedUser).toBeNull();
    });

    it("should start with null selected project", () => {
      const { selectedProject } = useAdminStore.getState();
      expect(selectedProject).toBeNull();
    });

    it("should start with empty filters", () => {
      const { filters } = useAdminStore.getState();
      expect(filters).toEqual({});
    });

    it("should start with empty bulk selection", () => {
      const { bulkSelection } = useAdminStore.getState();
      expect(bulkSelection).toEqual([]);
    });
  });

  describe("selectUser", () => {
    it("should select a user", () => {
      const { selectUser } = useAdminStore.getState();
      selectUser(mockUser);

      const { selectedUser } = useAdminStore.getState();
      expect(selectedUser).toEqual(mockUser);
    });

    it("should clear selected user when passed null", () => {
      const { selectUser } = useAdminStore.getState();
      selectUser(mockUser);
      selectUser(null);

      const { selectedUser } = useAdminStore.getState();
      expect(selectedUser).toBeNull();
    });

    it("should replace previously selected user", () => {
      const { selectUser } = useAdminStore.getState();
      selectUser(mockUser);
      selectUser(mockUser2);

      const { selectedUser } = useAdminStore.getState();
      expect(selectedUser?.id).toBe("user-2");
    });
  });

  describe("selectProject", () => {
    it("should select a project assignment", () => {
      const { selectProject } = useAdminStore.getState();
      selectProject(mockProjectAssignment);

      const { selectedProject } = useAdminStore.getState();
      expect(selectedProject).toEqual(mockProjectAssignment);
    });

    it("should clear selected project when passed null", () => {
      const { selectProject } = useAdminStore.getState();
      selectProject(mockProjectAssignment);
      selectProject(null);

      const { selectedProject } = useAdminStore.getState();
      expect(selectedProject).toBeNull();
    });

    it("should include associated user data", () => {
      const { selectProject } = useAdminStore.getState();
      selectProject(mockProjectAssignment);

      const { selectedProject } = useAdminStore.getState();
      expect(selectedProject?.user?.email).toBe("admin@agency.com");
    });

    it("should include associated tenant data", () => {
      const { selectProject } = useAdminStore.getState();
      selectProject(mockProjectAssignment);

      const { selectedProject } = useAdminStore.getState();
      expect(selectedProject?.tenant?.businessName).toBe("Acme Corporation");
    });
  });

  describe("setFilters", () => {
    it("should set a single filter", () => {
      const { setFilters } = useAdminStore.getState();
      setFilters({ userRole: "admin" });

      const { filters } = useAdminStore.getState();
      expect(filters.userRole).toBe("admin");
    });

    it("should set multiple filters at once", () => {
      const { setFilters } = useAdminStore.getState();
      setFilters({ userRole: "admin", status: "active" });

      const { filters } = useAdminStore.getState();
      expect(filters.userRole).toBe("admin");
      expect(filters.status).toBe("active");
    });

    it("should merge with existing filters", () => {
      const { setFilters } = useAdminStore.getState();
      setFilters({ userRole: "admin" });
      setFilters({ tenantId: "tenant-1" });

      const { filters } = useAdminStore.getState();
      expect(filters.userRole).toBe("admin");
      expect(filters.tenantId).toBe("tenant-1");
    });

    it("should override existing filter values", () => {
      const { setFilters } = useAdminStore.getState();
      setFilters({ userRole: "admin" });
      setFilters({ userRole: "designer" });

      const { filters } = useAdminStore.getState();
      expect(filters.userRole).toBe("designer");
    });

    it("should handle all filter types", () => {
      const { setFilters } = useAdminStore.getState();
      setFilters({
        userRole: "owner",
        tenantId: "tenant-123",
        userId: "user-456",
        status: "active",
      });

      const { filters } = useAdminStore.getState();
      expect(filters).toEqual({
        userRole: "owner",
        tenantId: "tenant-123",
        userId: "user-456",
        status: "active",
      });
    });
  });

  describe("clearFilters", () => {
    it("should clear all filters", () => {
      const { setFilters, clearFilters } = useAdminStore.getState();
      setFilters({ userRole: "admin", tenantId: "tenant-1", status: "active" });
      clearFilters();

      const { filters } = useAdminStore.getState();
      expect(filters).toEqual({});
    });

    it("should be safe to call when no filters set", () => {
      const { clearFilters } = useAdminStore.getState();
      clearFilters();

      const { filters } = useAdminStore.getState();
      expect(filters).toEqual({});
    });
  });

  describe("toggleBulkSelect", () => {
    it("should add item to selection when not selected", () => {
      const { toggleBulkSelect } = useAdminStore.getState();
      toggleBulkSelect("item-1");

      const { bulkSelection } = useAdminStore.getState();
      expect(bulkSelection).toContain("item-1");
    });

    it("should remove item from selection when already selected", () => {
      const { toggleBulkSelect } = useAdminStore.getState();
      toggleBulkSelect("item-1");
      toggleBulkSelect("item-1");

      const { bulkSelection } = useAdminStore.getState();
      expect(bulkSelection).not.toContain("item-1");
    });

    it("should handle multiple items independently", () => {
      const { toggleBulkSelect } = useAdminStore.getState();
      toggleBulkSelect("item-1");
      toggleBulkSelect("item-2");
      toggleBulkSelect("item-3");
      toggleBulkSelect("item-2"); // Deselect item-2

      const { bulkSelection } = useAdminStore.getState();
      expect(bulkSelection).toEqual(["item-1", "item-3"]);
    });
  });

  describe("clearBulkSelection", () => {
    it("should clear all selected items", () => {
      const { toggleBulkSelect, clearBulkSelection } = useAdminStore.getState();
      toggleBulkSelect("item-1");
      toggleBulkSelect("item-2");
      toggleBulkSelect("item-3");
      clearBulkSelection();

      const { bulkSelection } = useAdminStore.getState();
      expect(bulkSelection).toEqual([]);
    });

    it("should be safe to call when nothing selected", () => {
      const { clearBulkSelection } = useAdminStore.getState();
      clearBulkSelection();

      const { bulkSelection } = useAdminStore.getState();
      expect(bulkSelection).toEqual([]);
    });
  });

  describe("selectAll", () => {
    it("should select all provided IDs", () => {
      const { selectAll } = useAdminStore.getState();
      selectAll(["item-1", "item-2", "item-3"]);

      const { bulkSelection } = useAdminStore.getState();
      expect(bulkSelection).toEqual(["item-1", "item-2", "item-3"]);
    });

    it("should replace existing selection", () => {
      const { toggleBulkSelect, selectAll } = useAdminStore.getState();
      toggleBulkSelect("old-item");
      selectAll(["new-item-1", "new-item-2"]);

      const { bulkSelection } = useAdminStore.getState();
      expect(bulkSelection).toEqual(["new-item-1", "new-item-2"]);
      expect(bulkSelection).not.toContain("old-item");
    });

    it("should handle empty array", () => {
      const { toggleBulkSelect, selectAll } = useAdminStore.getState();
      toggleBulkSelect("item-1");
      selectAll([]);

      const { bulkSelection } = useAdminStore.getState();
      expect(bulkSelection).toEqual([]);
    });
  });

  describe("combined operations", () => {
    it("should maintain independent state for user and project selection", () => {
      const { selectUser, selectProject } = useAdminStore.getState();
      selectUser(mockUser);
      selectProject(mockProjectAssignment);

      const { selectedUser, selectedProject } = useAdminStore.getState();
      expect(selectedUser?.id).toBe("user-1");
      expect(selectedProject?.id).toBe("assignment-1");
    });

    it("should maintain filters when making selections", () => {
      const { setFilters, selectUser, selectProject } =
        useAdminStore.getState();
      setFilters({ userRole: "admin" });
      selectUser(mockUser);
      selectProject(mockProjectAssignment);

      const { filters } = useAdminStore.getState();
      expect(filters.userRole).toBe("admin");
    });

    it("should maintain bulk selection independently of other state", () => {
      const { toggleBulkSelect, selectUser, setFilters } =
        useAdminStore.getState();
      toggleBulkSelect("item-1");
      toggleBulkSelect("item-2");
      selectUser(mockUser);
      setFilters({ status: "active" });

      const { bulkSelection } = useAdminStore.getState();
      expect(bulkSelection).toEqual(["item-1", "item-2"]);
    });
  });
});
