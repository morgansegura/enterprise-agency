import { describe, it, expect, beforeEach, vi } from "vitest";
import { useUIStore } from "./ui-store";

describe("UIStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useUIStore.setState({
      sidebarOpen: true,
      theme: "system",
      notifications: [],
    });
  });

  describe("sidebar", () => {
    it("should toggle sidebar from open to closed", () => {
      const { toggleSidebar } = useUIStore.getState();
      toggleSidebar();

      const { sidebarOpen } = useUIStore.getState();
      expect(sidebarOpen).toBe(false);
    });

    it("should toggle sidebar from closed to open", () => {
      useUIStore.setState({ sidebarOpen: false });
      const { toggleSidebar } = useUIStore.getState();
      toggleSidebar();

      const { sidebarOpen } = useUIStore.getState();
      expect(sidebarOpen).toBe(true);
    });

    it("should set sidebar open state directly", () => {
      const { setSidebarOpen } = useUIStore.getState();
      setSidebarOpen(false);

      const { sidebarOpen } = useUIStore.getState();
      expect(sidebarOpen).toBe(false);
    });
  });

  describe("theme", () => {
    it("should set theme to light", () => {
      const { setTheme } = useUIStore.getState();
      setTheme("light");

      const { theme } = useUIStore.getState();
      expect(theme).toBe("light");
    });

    it("should set theme to dark", () => {
      const { setTheme } = useUIStore.getState();
      setTheme("dark");

      const { theme } = useUIStore.getState();
      expect(theme).toBe("dark");
    });

    it("should set theme to system", () => {
      const { setTheme } = useUIStore.getState();
      setTheme("dark");
      setTheme("system");

      const { theme } = useUIStore.getState();
      expect(theme).toBe("system");
    });
  });

  describe("notifications", () => {
    it("should add a notification", () => {
      const { addNotification } = useUIStore.getState();
      addNotification({
        type: "success",
        title: "Test notification",
        message: "This is a test",
      });

      const { notifications } = useUIStore.getState();
      expect(notifications).toHaveLength(1);
      expect(notifications[0].title).toBe("Test notification");
      expect(notifications[0].type).toBe("success");
      expect(notifications[0].id).toBeDefined();
    });

    it("should generate unique IDs for notifications", () => {
      vi.useFakeTimers();
      const { addNotification } = useUIStore.getState();

      // Add notifications at different times
      addNotification({ type: "info", title: "First" });
      vi.advanceTimersByTime(1);
      addNotification({ type: "info", title: "Second" });

      const { notifications } = useUIStore.getState();
      expect(notifications[0].id).not.toBe(notifications[1].id);

      vi.useRealTimers();
    });

    it("should add multiple notifications", () => {
      const { addNotification } = useUIStore.getState();
      addNotification({ type: "success", title: "Success!" });
      addNotification({ type: "error", title: "Error!" });
      addNotification({ type: "warning", title: "Warning!" });

      const { notifications } = useUIStore.getState();
      expect(notifications).toHaveLength(3);
    });

    it("should remove a specific notification by id", () => {
      const { addNotification, removeNotification } = useUIStore.getState();
      addNotification({ type: "info", title: "Keep this" });
      addNotification({ type: "error", title: "Remove this" });

      const { notifications: before } = useUIStore.getState();
      const idToRemove = before[1].id;

      removeNotification(idToRemove);

      const { notifications: after } = useUIStore.getState();
      expect(after).toHaveLength(1);
      expect(after[0].title).toBe("Keep this");
    });

    it("should clear all notifications", () => {
      const { addNotification, clearNotifications } = useUIStore.getState();
      addNotification({ type: "info", title: "One" });
      addNotification({ type: "info", title: "Two" });
      addNotification({ type: "info", title: "Three" });

      clearNotifications();

      const { notifications } = useUIStore.getState();
      expect(notifications).toHaveLength(0);
    });

    it("should handle notification with optional fields", () => {
      const { addNotification } = useUIStore.getState();
      addNotification({
        type: "info",
        title: "Minimal notification",
      });

      const { notifications } = useUIStore.getState();
      expect(notifications[0].message).toBeUndefined();
      expect(notifications[0].duration).toBeUndefined();
    });

    it("should preserve notification with all fields", () => {
      const { addNotification } = useUIStore.getState();
      addNotification({
        type: "warning",
        title: "Full notification",
        message: "With all fields",
        duration: 5000,
      });

      const { notifications } = useUIStore.getState();
      expect(notifications[0].message).toBe("With all fields");
      expect(notifications[0].duration).toBe(5000);
    });
  });
});
