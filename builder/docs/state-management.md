# State Management Architecture

Enterprise-grade state management for Web & Funnel Builder using Zustand and TanStack Query.

## Philosophy

**Server State** (TanStack Query) vs **Client State** (Zustand):

- **Server State** - Data from API (users, tenants, features, projects) → TanStack Query
- **Client State** - UI state, selections, preferences → Zustand

### When to Use Each

**TanStack Query** for:

- Data fetched from API
- Cached and refetched data
- Optimistic updates
- Background refetching
- Server-side pagination/filtering

**Zustand** for:

- UI state (sidebar collapsed, theme)
- Current selections (selected tenant, active view)
- Form state (draft data before submission)
- User preferences (local settings)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     React Components                     │
└───────────────────┬─────────────────┬───────────────────┘
                    │                 │
        ┌───────────▼────────┐   ┌────▼──────────────┐
        │   Zustand Stores   │   │  TanStack Query   │
        │   (Client State)   │   │  (Server State)   │
        └────────────────────┘   └────┬──────────────┘
                                      │
                                 ┌────▼──────┐
                                 │ API Client│
                                 └────┬──────┘
                                      │
                                 ┌────▼──────┐
                                 │  NestJS   │
                                 │    API    │
                                 └───────────┘
```

## Zustand Stores

### 1. Auth Store (`lib/stores/auth-store.ts`)

Manages authentication state and user session.

```typescript
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}
```

**Features**:

- Persisted to localStorage via `persist` middleware
- DevTools integration for debugging
- Cleared on logout

### 2. Tenants Store (`lib/stores/tenants-store.ts`)

Manages tenant list and selection state.

```typescript
interface TenantsStore {
  tenants: Tenant[];
  selectedTenant: Tenant | null;
  isLoading: boolean;

  setTenants: (tenants: Tenant[]) => void;
  addTenant: (tenant: Tenant) => void;
  updateTenant: (id: string, updates: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  selectTenant: (tenant: Tenant | null) => void;
  setLoading: (loading: boolean) => void;
}
```

**Synced with TanStack Query**:

- Query hooks update this store on success
- Provides immediate UI updates
- Single source of truth for tenant list

### 3. UI Store (`lib/stores/ui-store.ts`)

Manages global UI state.

```typescript
interface UIStore {
  sidebarCollapsed: boolean;
  theme: "light" | "dark" | "system";
  activeView: string;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setActiveView: (view: string) => void;
}
```

**Features**:

- Persisted preferences
- No API interaction
- Pure client-side state

### 4. Admin Store (`lib/stores/admin-store.ts`)

Manages admin-specific UI state.

```typescript
interface AdminStore {
  selectedUser: User | null;
  selectedProject: ProjectAssignment | null;
  filters: {
    userRole?: AgencyRole;
    tenantId?: string;
    status?: string;
  };
  bulkSelection: string[];

  selectUser: (user: User | null) => void;
  selectProject: (project: ProjectAssignment | null) => void;
  setFilters: (filters: Partial<AdminStore["filters"]>) => void;
  clearFilters: () => void;
  toggleBulkSelect: (id: string) => void;
  clearBulkSelection: () => void;
}
```

## TanStack Query Hooks

### Query Key Structure

Hierarchical query keys for efficient invalidation:

```typescript
// Users
["admin", "users"][("admin", "users", "search", query)][ // All users // Search results
  ("admin", "users", userId)
][ // Single user
  // Features
  ("admin", "features", "available")
][("admin", "features", "tenant", tenantId)][ // Available features // Tenant features
  // Projects
  ("admin", "projects", "assignments")
][("admin", "projects", "assignments", { tenantId })][ // All assignments // Filtered by tenant
  ("admin", "projects", "assignments", { userId })
][("admin", "projects", "assignments", assignmentId)][ // Filtered by user // Single assignment
  // Tenants
  ("admin", "tenants")
][("admin", "tenants", tenantId)][("admin", "tenants", tenantId, "stats")][ // All tenants // Single tenant // Tenant stats
  ("admin", "tenants", tenantId, "activity")
]; // Tenant activity
```

### Admin User Hooks (`lib/hooks/use-admin-users.ts`)

```typescript
// List all users
export function useAdminUsers(includeDeleted?: boolean) {
  return useQuery({
    queryKey: ["admin", "users", { includeDeleted }],
    queryFn: () => apiClient.get("/admin/users", { includeDeleted }),
  });
}

// Search users
export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ["admin", "users", "search", query],
    queryFn: () => apiClient.get(`/admin/users/search?q=${query}`),
    enabled: query.length > 0,
  });
}

// Get single user
export function useAdminUser(userId: string) {
  return useQuery({
    queryKey: ["admin", "users", userId],
    queryFn: () => apiClient.get(`/admin/users/${userId}`),
  });
}

// Create user (super admin only)
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDto) => apiClient.post("/admin/users", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

// Invite user
export function useInviteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteUserDto) =>
      apiClient.post("/admin/users/invite", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

// Update user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserDto }) =>
      apiClient.patch(`/admin/users/${userId}`, data),
    onMutate: async ({ userId, data }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ["admin", "users", userId] });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(["admin", "users", userId]);

      // Optimistically update
      queryClient.setQueryData(["admin", "users", userId], (old: any) => ({
        ...old,
        ...data,
      }));

      return { previousUser };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(
          ["admin", "users", variables.userId],
          context.previousUser,
        );
      }
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.setQueryData(["admin", "users", userId], data);
    },
  });
}

// Delete user (super admin only)
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => apiClient.delete(`/admin/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
```

### Feature Management Hooks (`lib/hooks/use-features.ts`)

```typescript
// Get available features
export function useAvailableFeatures() {
  return useQuery({
    queryKey: ["admin", "features", "available"],
    queryFn: () => apiClient.get("/admin/features/available"),
    staleTime: 60 * 60 * 1000, // 1 hour (rarely changes)
  });
}

// Get tenant features
export function useTenantFeatures(tenantId: string) {
  return useQuery({
    queryKey: ["admin", "features", "tenant", tenantId],
    queryFn: () => apiClient.get(`/admin/features/tenant/${tenantId}`),
  });
}

// Update all features
export function useUpdateFeatures() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tenantId,
      features,
    }: {
      tenantId: string;
      features: Record<string, boolean>;
    }) =>
      apiClient.put(`/admin/features/tenant/${tenantId}`, {
        enabledFeatures: features,
      }),
    onSuccess: (data, { tenantId }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "features", "tenant", tenantId],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "tenants", tenantId],
      });
    },
  });
}

// Toggle single feature
export function useToggleFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tenantId,
      featureKey,
      enabled,
    }: {
      tenantId: string;
      featureKey: string;
      enabled: boolean;
    }) =>
      apiClient.post(`/admin/features/tenant/${tenantId}/toggle`, {
        featureKey,
        enabled,
      }),
    onMutate: async ({ tenantId, featureKey, enabled }) => {
      await queryClient.cancelQueries({
        queryKey: ["admin", "features", "tenant", tenantId],
      });

      const previousFeatures = queryClient.getQueryData([
        "admin",
        "features",
        "tenant",
        tenantId,
      ]);

      // Optimistically update
      queryClient.setQueryData(
        ["admin", "features", "tenant", tenantId],
        (old: any) => ({
          ...old,
          [featureKey]: enabled,
        }),
      );

      return { previousFeatures };
    },
    onError: (err, { tenantId }, context) => {
      if (context?.previousFeatures) {
        queryClient.setQueryData(
          ["admin", "features", "tenant", tenantId],
          context.previousFeatures,
        );
      }
    },
    onSuccess: (data, { tenantId }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "features", "tenant", tenantId],
      });
    },
  });
}
```

### Project Assignment Hooks (`lib/hooks/use-projects.ts`)

```typescript
// List assignments with optional filters
export function useProjectAssignments(filters?: {
  tenantId?: string;
  userId?: string;
}) {
  return useQuery({
    queryKey: ["admin", "projects", "assignments", filters],
    queryFn: () => apiClient.get("/admin/projects/assignments", filters),
  });
}

// Get single assignment
export function useProjectAssignment(assignmentId: string) {
  return useQuery({
    queryKey: ["admin", "projects", "assignments", assignmentId],
    queryFn: () => apiClient.get(`/admin/projects/assignments/${assignmentId}`),
  });
}

// Create assignment
export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectAssignmentDto) =>
      apiClient.post("/admin/projects/assignments", data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "projects", "assignments"],
      });
    },
  });
}

// Update assignment
export function useUpdateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assignmentId,
      data,
    }: {
      assignmentId: string;
      data: UpdateProjectAssignmentDto;
    }) => apiClient.patch(`/admin/projects/assignments/${assignmentId}`, data),
    onSuccess: (data, { assignmentId }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "projects", "assignments"],
      });
      queryClient.setQueryData(
        ["admin", "projects", "assignments", assignmentId],
        data,
      );
    },
  });
}

// Delete assignment
export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignmentId: string) =>
      apiClient.delete(`/admin/projects/assignments/${assignmentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "projects", "assignments"],
      });
    },
  });
}
```

### Tenant Admin Hooks (`lib/hooks/use-admin-tenants.ts`)

```typescript
// List all tenants with stats
export function useAdminTenants() {
  return useQuery({
    queryKey: ["admin", "tenants"],
    queryFn: () => apiClient.get("/admin/tenants"),
  });
}

// Get tenant stats
export function useTenantStats(tenantId: string) {
  return useQuery({
    queryKey: ["admin", "tenants", tenantId, "stats"],
    queryFn: () => apiClient.get(`/admin/tenants/${tenantId}/stats`),
  });
}

// Get tenant activity
export function useTenantActivity(tenantId: string, days: number = 30) {
  return useQuery({
    queryKey: ["admin", "tenants", tenantId, "activity", { days }],
    queryFn: () =>
      apiClient.get(`/admin/tenants/${tenantId}/activity?days=${days}`),
  });
}
```

## Data Flow Patterns

### Pattern 1: Query + Store Sync

For data that needs both caching (Query) and immediate access (Store):

```typescript
export function useTenants() {
  const { setTenants, setLoading } = useTenantsStore();

  return useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await apiClient.get("/tenants");
        setTenants(data); // Sync to store
        return data;
      } finally {
        setLoading(false);
      }
    },
  });
}
```

### Pattern 2: Optimistic Updates

For instant UI feedback with rollback on error:

```typescript
export function useUpdateTenant() {
  const queryClient = useQueryClient();
  const { updateTenant } = useTenantsStore();

  return useMutation({
    mutationFn: ({ id, data }) => apiClient.patch(`/tenants/${id}`, data),

    // Before mutation
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["tenants", id] });

      const previous = queryClient.getQueryData(["tenants", id]);

      // Optimistic update
      queryClient.setQueryData(["tenants", id], (old) => ({
        ...old,
        ...data,
      }));
      updateTenant(id, data);

      return { previous };
    },

    // On error, rollback
    onError: (err, { id }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["tenants", id], context.previous);
        updateTenant(id, context.previous);
      }
    },

    // On success, invalidate
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.setQueryData(["tenants", id], data);
      updateTenant(id, data);
    },
  });
}
```

### Pattern 3: Pure Client State

For UI state with no API interaction:

```typescript
// lib/stores/ui-store.ts
export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: 'system',

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setTheme: (theme) => set({ theme }),
    }),
    { name: 'ui-preferences' }
  )
)

// Usage in component
function Header() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <button onClick={toggleSidebar}>
      {sidebarCollapsed ? 'Expand' : 'Collapse'}
    </button>
  )
}
```

## Best Practices

### Query Keys

1. **Use arrays, not strings**: `['users']` not `'users'`
2. **Hierarchical structure**: `['admin', 'users', userId]`
3. **Include filters in key**: `['users', { role: 'admin' }]`
4. **Extract to constants**: Define query key factories

```typescript
// lib/hooks/query-keys.ts
export const queryKeys = {
  admin: {
    users: {
      all: (filters?: object) => ["admin", "users", filters],
      detail: (id: string) => ["admin", "users", id],
      search: (query: string) => ["admin", "users", "search", query],
    },
    tenants: {
      all: () => ["admin", "tenants"],
      detail: (id: string) => ["admin", "tenants", id],
      stats: (id: string) => ["admin", "tenants", id, "stats"],
    },
  },
};
```

### Store Organization

1. **Keep stores focused**: One concern per store
2. **Use devtools**: Enable in development
3. **Persist carefully**: Only persist user preferences
4. **Avoid derived state**: Compute in components with useMemo

### Error Handling

1. **Handle mutation errors**:

```typescript
const { mutate, error, isError } = useUpdateUser();

if (isError) {
  toast.error(error.message);
}
```

2. **Provide error boundaries**:

```typescript
<ErrorBoundary fallback={<ErrorView />}>
  <UsersList />
</ErrorBoundary>
```

3. **Retry failed queries**:

```typescript
useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
  retry: (failureCount, error) => {
    // Don't retry 4xx errors
    if (error.status >= 400 && error.status < 500) {
      return false;
    }
    return failureCount < 2;
  },
});
```

### Performance

1. **Use select for derived data**:

```typescript
const userNames = useAdminUsers({
  select: (data) => data.map((u) => u.firstName + " " + u.lastName),
});
```

2. **Enable staleTime for static data**:

```typescript
useQuery({
  queryKey: ["features"],
  queryFn: fetchFeatures,
  staleTime: 60 * 60 * 1000, // 1 hour
});
```

3. **Paginate large lists**:

```typescript
useInfiniteQuery({
  queryKey: ["users"],
  queryFn: ({ pageParam = 0 }) => fetchUsers(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

## Testing

### Testing Zustand Stores

```typescript
import { renderHook, act } from "@testing-library/react";
import { useAuthStore } from "./auth-store";

describe("useAuthStore", () => {
  it("should login user", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.login(mockUser, mockToken);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });
});
```

### Testing TanStack Query Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAdminUsers } from './use-admin-users'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useAdminUsers', () => {
  it('should fetch users', async () => {
    const { result } = renderHook(() => useAdminUsers(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toHaveLength(3)
  })
})
```

## Common Patterns

### Pagination

```typescript
export function useUsersPaginated(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["users", { page, pageSize }],
    queryFn: () => apiClient.get("/users", { page, pageSize }),
    keepPreviousData: true, // Don't flash loading state
  });
}
```

### Infinite Scroll

```typescript
export function useUsersInfinite() {
  return useInfiniteQuery({
    queryKey: ["users", "infinite"],
    queryFn: ({ pageParam = 0 }) =>
      apiClient.get("/users", { cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
```

### Dependent Queries

```typescript
export function useUserDetails(userId: string) {
  const { data: user } = useAdminUser(userId);

  const { data: assignments } = useProjectAssignments(
    { userId },
    { enabled: !!user }, // Only fetch if user exists
  );

  return { user, assignments };
}
```

### Prefetching

```typescript
export function usePrefetchUser(userId: string) {
  const queryClient = useQueryClient()

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ['admin', 'users', userId],
      queryFn: () => apiClient.get(`/admin/users/${userId}`),
    })
  }

  return { prefetch }
}

// Usage
function UserRow({ userId }) {
  const { prefetch } = usePrefetchUser(userId)

  return (
    <tr onMouseEnter={prefetch}>
      <td>{userId}</td>
    </tr>
  )
}
```

## DevTools

### Zustand DevTools

```typescript
import { devtools } from "zustand/middleware";

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      // ... store implementation
    }),
    { name: "AuthStore" }, // Shows in Redux DevTools
  ),
);
```

### TanStack Query DevTools

```typescript
// app/providers.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

## Migration Guide

### From useState to Zustand

**Before**:

```typescript
const [sidebarOpen, setSidebarOpen] = useState(false);
```

**After**:

```typescript
const { sidebarCollapsed, toggleSidebar } = useUIStore();
```

### From useEffect to TanStack Query

**Before**:

```typescript
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  setLoading(true);
  fetch("/api/users")
    .then((res) => res.json())
    .then(setUsers)
    .finally(() => setLoading(false));
}, []);
```

**After**:

```typescript
const { data: users, isLoading } = useAdminUsers();
```
