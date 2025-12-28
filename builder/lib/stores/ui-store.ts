import { create } from "zustand";
import { devtools } from "zustand/middleware";

/**
 * Selected element in the editor
 * Used to determine what settings to show in the right panel
 */
export interface SelectedElement {
  type: "section" | "container" | "block";
  key: string;
  sectionIndex: number;
  containerIndex?: number;
  blockIndex?: number;
}

interface UIState {
  // Left sidebar (navigation)
  sidebarOpen: boolean;
  // Right panel (settings)
  rightPanelOpen: boolean;
  rightPanelWidth: number;
  selectedElement: SelectedElement | null;
  // Theme
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
  // Left sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  // Right panel
  toggleRightPanel: () => void;
  setRightPanelOpen: (open: boolean) => void;
  setRightPanelWidth: (width: number) => void;
  setSelectedElement: (element: SelectedElement | null) => void;
  selectSection: (sectionIndex: number, key: string) => void;
  selectContainer: (
    sectionIndex: number,
    containerIndex: number,
    key: string,
  ) => void;
  selectBlock: (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
    key: string,
  ) => void;
  clearSelection: () => void;
  // Theme
  setTheme: (theme: "light" | "dark" | "system") => void;
  // Notifications
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

type UIStore = UIState & UIActions;

const initialState: UIState = {
  sidebarOpen: true,
  rightPanelOpen: true,
  rightPanelWidth: 320,
  selectedElement: null,
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

      // Right panel actions
      toggleRightPanel: () =>
        set(
          (state) => ({ rightPanelOpen: !state.rightPanelOpen }),
          false,
          "ui/toggleRightPanel",
        ),

      setRightPanelOpen: (open) =>
        set({ rightPanelOpen: open }, false, "ui/setRightPanelOpen"),

      setRightPanelWidth: (width) =>
        set({ rightPanelWidth: width }, false, "ui/setRightPanelWidth"),

      setSelectedElement: (element) =>
        set({ selectedElement: element }, false, "ui/setSelectedElement"),

      selectSection: (sectionIndex, key) =>
        set(
          {
            selectedElement: { type: "section", key, sectionIndex },
            rightPanelOpen: true,
          },
          false,
          "ui/selectSection",
        ),

      selectContainer: (sectionIndex, containerIndex, key) =>
        set(
          {
            selectedElement: {
              type: "container",
              key,
              sectionIndex,
              containerIndex,
            },
            rightPanelOpen: true,
          },
          false,
          "ui/selectContainer",
        ),

      selectBlock: (sectionIndex, containerIndex, blockIndex, key) =>
        set(
          {
            selectedElement: {
              type: "block",
              key,
              sectionIndex,
              containerIndex,
              blockIndex,
            },
            rightPanelOpen: true,
          },
          false,
          "ui/selectBlock",
        ),

      clearSelection: () =>
        set({ selectedElement: null }, false, "ui/clearSelection"),

      // Theme
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
