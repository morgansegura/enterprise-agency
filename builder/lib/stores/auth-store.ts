import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface User {
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

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setUser: (user) =>
          set({ user, isAuthenticated: !!user }, false, "auth/setUser"),

        setToken: (token) => set({ token }, false, "auth/setToken"),

        login: (user, token) =>
          set(
            {
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            },
            false,
            "auth/login",
          ),

        logout: () =>
          set(
            {
              ...initialState,
              isLoading: false,
            },
            false,
            "auth/logout",
          ),

        setLoading: (isLoading) => set({ isLoading }, false, "auth/setLoading"),
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    { name: "AuthStore" },
  ),
);
