import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

type UIStore = UIState & UIActions;

const initialState: UIState = {
  sidebarOpen: true,
  theme: "system",
  notifications: [],
};

export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      ...initialState,

      toggleSidebar: () =>
        set(
          (state) => ({ sidebarOpen: !state.sidebarOpen }),
          false,
          "ui/toggleSidebar",
        ),

      setSidebarOpen: (open) =>
        set({ sidebarOpen: open }, false, "ui/setSidebarOpen"),

      setTheme: (theme) => set({ theme }, false, "ui/setTheme"),

      addNotification: (notification) =>
        set(
          (state) => ({
            notifications: [
              ...state.notifications,
              {
                ...notification,
                id: `notif-${Date.now()}-${Math.random()}`,
              },
            ],
          }),
          false,
          "ui/addNotification",
        ),

      removeNotification: (id) =>
        set(
          (state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }),
          false,
          "ui/removeNotification",
        ),

      clearNotifications: () =>
        set({ notifications: [] }, false, "ui/clearNotifications"),
    }),
    { name: "UIStore" },
  ),
);
