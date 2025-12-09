import { describe, it, expect, beforeEach } from "vitest";
import { useTenantsStore } from "./tenants-store";

const mockTenant = {
  id: "tenant-1",
  slug: "acme-corp",
  businessName: "Acme Corporation",
  businessType: "technology",
  status: "active",
  enabledFeatures: { blog: true, shop: false },
  contactEmail: "contact@acme.com",
};

const mockTenant2 = {
  id: "tenant-2",
  slug: "beta-inc",
  businessName: "Beta Inc",
  status: "active",
  enabledFeatures: { blog: true, shop: true },
};

describe("TenantsStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useTenantsStore.setState({
      tenants: [],
      selectedTenant: null,
      isLoading: false,
    });
  });

  describe("setTenants", () => {
    it("should set tenants array", () => {
      const { setTenants } = useTenantsStore.getState();
      setTenants([mockTenant, mockTenant2]);

      const { tenants } = useTenantsStore.getState();
      expect(tenants).toHaveLength(2);
      expect(tenants[0].slug).toBe("acme-corp");
      expect(tenants[1].slug).toBe("beta-inc");
    });

    it("should replace existing tenants", () => {
      const { setTenants } = useTenantsStore.getState();
      setTenants([mockTenant]);
      setTenants([mockTenant2]);

      const { tenants } = useTenantsStore.getState();
      expect(tenants).toHaveLength(1);
      expect(tenants[0].slug).toBe("beta-inc");
    });
  });

  describe("addTenant", () => {
    it("should add a tenant to the list", () => {
      const { addTenant, setTenants } = useTenantsStore.getState();
      setTenants([mockTenant]);
      addTenant(mockTenant2);

      const { tenants } = useTenantsStore.getState();
      expect(tenants).toHaveLength(2);
      expect(tenants[1].businessName).toBe("Beta Inc");
    });

    it("should add tenant to empty list", () => {
      const { addTenant } = useTenantsStore.getState();
      addTenant(mockTenant);

      const { tenants } = useTenantsStore.getState();
      expect(tenants).toHaveLength(1);
    });
  });

  describe("updateTenant", () => {
    it("should update a specific tenant", () => {
      const { setTenants, updateTenant } = useTenantsStore.getState();
      setTenants([mockTenant, mockTenant2]);
      updateTenant("tenant-1", { businessName: "Acme Corp Updated" });

      const { tenants } = useTenantsStore.getState();
      expect(tenants[0].businessName).toBe("Acme Corp Updated");
      expect(tenants[1].businessName).toBe("Beta Inc");
    });

    it("should update selectedTenant if it matches", () => {
      const { setTenants, selectTenant, updateTenant } =
        useTenantsStore.getState();
      setTenants([mockTenant]);
      selectTenant(mockTenant);
      updateTenant("tenant-1", { businessName: "Updated Name" });

      const { selectedTenant } = useTenantsStore.getState();
      expect(selectedTenant?.businessName).toBe("Updated Name");
    });

    it("should not update selectedTenant if it does not match", () => {
      const { setTenants, selectTenant, updateTenant } =
        useTenantsStore.getState();
      setTenants([mockTenant, mockTenant2]);
      selectTenant(mockTenant2);
      updateTenant("tenant-1", { businessName: "Updated Name" });

      const { selectedTenant } = useTenantsStore.getState();
      expect(selectedTenant?.businessName).toBe("Beta Inc");
    });
  });

  describe("deleteTenant", () => {
    it("should remove a tenant from the list", () => {
      const { setTenants, deleteTenant } = useTenantsStore.getState();
      setTenants([mockTenant, mockTenant2]);
      deleteTenant("tenant-1");

      const { tenants } = useTenantsStore.getState();
      expect(tenants).toHaveLength(1);
      expect(tenants[0].id).toBe("tenant-2");
    });

    it("should clear selectedTenant if deleted tenant was selected", () => {
      const { setTenants, selectTenant, deleteTenant } =
        useTenantsStore.getState();
      setTenants([mockTenant]);
      selectTenant(mockTenant);
      deleteTenant("tenant-1");

      const { selectedTenant } = useTenantsStore.getState();
      expect(selectedTenant).toBeNull();
    });

    it("should keep selectedTenant if different tenant was deleted", () => {
      const { setTenants, selectTenant, deleteTenant } =
        useTenantsStore.getState();
      setTenants([mockTenant, mockTenant2]);
      selectTenant(mockTenant2);
      deleteTenant("tenant-1");

      const { selectedTenant } = useTenantsStore.getState();
      expect(selectedTenant?.id).toBe("tenant-2");
    });
  });

  describe("selectTenant", () => {
    it("should set selectedTenant", () => {
      const { selectTenant } = useTenantsStore.getState();
      selectTenant(mockTenant);

      const { selectedTenant } = useTenantsStore.getState();
      expect(selectedTenant).toEqual(mockTenant);
    });

    it("should clear selectedTenant when passed null", () => {
      const { selectTenant } = useTenantsStore.getState();
      selectTenant(mockTenant);
      selectTenant(null);

      const { selectedTenant } = useTenantsStore.getState();
      expect(selectedTenant).toBeNull();
    });
  });

  describe("setLoading", () => {
    it("should set loading state to true", () => {
      const { setLoading } = useTenantsStore.getState();
      setLoading(true);

      const { isLoading } = useTenantsStore.getState();
      expect(isLoading).toBe(true);
    });

    it("should set loading state to false", () => {
      const { setLoading } = useTenantsStore.getState();
      setLoading(true);
      setLoading(false);

      const { isLoading } = useTenantsStore.getState();
      expect(isLoading).toBe(false);
    });
  });
});
