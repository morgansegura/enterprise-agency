# Hook Usage Examples

Real-world examples of using admin hooks and stores in components.

## User Management Examples

### List All Users with Filters

```typescript
'use client'

import { useState } from 'react'
import { useAdminUsers } from '@/lib/hooks/use-admin-users'
import { useAdminStore } from '@/lib/stores/admin-store'

export function UsersList() {
  const [includeDeleted, setIncludeDeleted] = useState(false)

  // Fetch users
  const { data: users, isLoading, error } = useAdminUsers(includeDeleted)

  // Store actions
  const { selectUser, filters, setFilters } = useAdminStore()

  if (isLoading) {
    return <div className="users-list-loading">Loading users...</div>
  }

  if (error) {
    return (
      <div className="users-list-error">
        Failed to load users: {error.message}
      </div>
    )
  }

  // Filter by role if set
  const filteredUsers = users?.filter((user) => {
    if (filters.userRole && user.agencyRole !== filters.userRole) {
      return false
    }
    return true
  })

  return (
    <div className="users-list">
      <div className="users-list-header">
        <h2>Users ({filteredUsers?.length})</h2>

        <div className="users-list-filters">
          <select
            value={filters.userRole || ''}
            onChange={(e) => setFilters({ userRole: e.target.value || undefined })}
            className="users-list-filter-role"
          >
            <option value="">All Roles</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="content_manager">Content Manager</option>
          </select>

          <label className="users-list-filter-deleted">
            <input
              type="checkbox"
              checked={includeDeleted}
              onChange={(e) => setIncludeDeleted(e.target.checked)}
            />
            Include Deleted
          </label>
        </div>
      </div>

      <div className="users-list-items">
        {filteredUsers?.map((user) => (
          <div
            key={user.id}
            className="users-list-item"
            onClick={() => selectUser(user)}
          >
            <div className="users-list-item-info">
              <div className="users-list-item-name">
                {user.firstName} {user.lastName}
              </div>
              <div className="users-list-item-email">{user.email}</div>
            </div>

            <div className="users-list-item-meta">
              <span className={`users-list-item-role users-list-item-role-${user.agencyRole}`}>
                {user.agencyRole}
              </span>
              <span className={`users-list-item-status users-list-item-status-${user.status}`}>
                {user.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Search Users

```typescript
'use client'

import { useState, useDeferredValue } from 'react'
import { useSearchUsers } from '@/lib/hooks/use-admin-users'

export function UserSearch() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  // Only searches when query length > 0
  const { data: results, isLoading } = useSearchUsers(deferredQuery)

  return (
    <div className="user-search">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users by name or email..."
        className="user-search-input"
      />

      {isLoading && <div className="user-search-loading">Searching...</div>}

      {results && results.length > 0 && (
        <div className="user-search-results">
          {results.map((user) => (
            <div key={user.id} className="user-search-result">
              <div className="user-search-result-name">
                {user.firstName} {user.lastName}
              </div>
              <div className="user-search-result-email">{user.email}</div>
            </div>
          ))}
        </div>
      )}

      {results && results.length === 0 && query.length > 0 && (
        <div className="user-search-empty">No users found</div>
      )}
    </div>
  )
}
```

### Create User Form

```typescript
'use client'

import { useState } from 'react'
import { useCreateUser } from '@/lib/hooks/use-admin-users'

export function CreateUserForm() {
  const { mutate: createUser, isPending, isError, error } = useCreateUser()

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    agencyRole: 'developer' as const,
    isSuperAdmin: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    createUser(formData, {
      onSuccess: () => {
        // Reset form
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          password: '',
          agencyRole: 'developer',
          isSuperAdmin: false,
        })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="create-user-form">
      <h2>Create User</h2>

      {isError && (
        <div className="create-user-form-error">
          {error?.message || 'Failed to create user'}
        </div>
      )}

      <div className="create-user-form-field">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="create-user-form-field">
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
      </div>

      <div className="create-user-form-field">
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
        />
      </div>

      <div className="create-user-form-field">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>

      <div className="create-user-form-field">
        <label htmlFor="agencyRole">Role</label>
        <select
          id="agencyRole"
          value={formData.agencyRole}
          onChange={(e) =>
            setFormData({
              ...formData,
              agencyRole: e.target.value as any,
            })
          }
        >
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="admin">Admin</option>
          <option value="content_manager">Content Manager</option>
          <option value="owner">Owner</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="create-user-form-submit"
      >
        {isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  )
}
```

### Update User with Optimistic Updates

```typescript
'use client'

import { useUpdateUser } from '@/lib/hooks/use-admin-users'
import { useAdminStore } from '@/lib/stores/admin-store'

export function UserDetailsPanel() {
  const { selectedUser, selectUser } = useAdminStore()
  const { mutate: updateUser, isPending } = useUpdateUser()

  if (!selectedUser) {
    return <div className="user-details-empty">Select a user to view details</div>
  }

  const handleStatusToggle = () => {
    const newStatus = selectedUser.status === 'active' ? 'inactive' : 'active'

    updateUser(
      {
        userId: selectedUser.id,
        data: { status: newStatus },
      },
      {
        onSuccess: () => {
          // UI already updated optimistically
          console.log('Status updated')
        },
        onError: () => {
          // Optimistic update was rolled back
          console.error('Failed to update status')
        },
      }
    )
  }

  return (
    <div className="user-details">
      <div className="user-details-header">
        <h2>
          {selectedUser.firstName} {selectedUser.lastName}
        </h2>
        <button
          onClick={() => selectUser(null)}
          className="user-details-close"
        >
          Close
        </button>
      </div>

      <div className="user-details-info">
        <div className="user-details-field">
          <span className="user-details-label">Email:</span>
          <span className="user-details-value">{selectedUser.email}</span>
        </div>

        <div className="user-details-field">
          <span className="user-details-label">Role:</span>
          <span className="user-details-value">{selectedUser.agencyRole}</span>
        </div>

        <div className="user-details-field">
          <span className="user-details-label">Status:</span>
          <span className={`user-details-status user-details-status-${selectedUser.status}`}>
            {selectedUser.status}
          </span>
        </div>
      </div>

      <div className="user-details-actions">
        <button
          onClick={handleStatusToggle}
          disabled={isPending}
          className="user-details-action"
        >
          {selectedUser.status === 'active' ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  )
}
```

## Feature Management Examples

### Feature Toggle Component

```typescript
'use client'

import { useTenantFeatures, useToggleFeature } from '@/lib/hooks/use-features'

export function FeatureToggles({ tenantId }: { tenantId: string }) {
  const { data: features, isLoading } = useTenantFeatures(tenantId)
  const { mutate: toggleFeature } = useToggleFeature()

  if (isLoading) {
    return <div className="features-loading">Loading features...</div>
  }

  const handleToggle = (featureKey: string, currentValue: boolean) => {
    toggleFeature({
      tenantId,
      featureKey,
      enabled: !currentValue,
    })
  }

  return (
    <div className="feature-toggles">
      <h2>Feature Access</h2>

      <div className="feature-toggles-grid">
        {Object.entries(features || {}).map(([key, enabled]) => (
          <div key={key} className="feature-toggle-item">
            <label className="feature-toggle-label">
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => handleToggle(key, enabled)}
                className="feature-toggle-checkbox"
              />
              <span className="feature-toggle-name">
                {key.replace(/\./g, ' → ')}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Bulk Feature Update

```typescript
'use client'

import { useState } from 'react'
import {
  useAvailableFeatures,
  useTenantFeatures,
  useUpdateFeatures,
} from '@/lib/hooks/use-features'

export function FeaturePresets({ tenantId }: { tenantId: string }) {
  const { data: available } = useAvailableFeatures()
  const { data: current } = useTenantFeatures(tenantId)
  const { mutate: updateFeatures, isPending } = useUpdateFeatures()

  const presets = {
    viewOnly: {
      'pages.view': true,
      'posts.view': true,
      'assets.view': true,
    },
    editor: {
      'pages.view': true,
      'pages.edit': true,
      'posts.create': true,
      'posts.edit': true,
      'assets.upload': true,
    },
    fullAccess: Object.fromEntries(
      (available || []).map((f) => [f.key, true])
    ),
  }

  const applyPreset = (preset: keyof typeof presets) => {
    // Merge preset with all features (default false)
    const allFeatures = Object.fromEntries(
      (available || []).map((f) => [f.key, false])
    )

    const enabledFeatures = {
      ...allFeatures,
      ...presets[preset],
    }

    updateFeatures({ tenantId, features: enabledFeatures })
  }

  return (
    <div className="feature-presets">
      <h3>Quick Presets</h3>

      <div className="feature-presets-buttons">
        <button
          onClick={() => applyPreset('viewOnly')}
          disabled={isPending}
          className="feature-preset-button"
        >
          View Only
        </button>

        <button
          onClick={() => applyPreset('editor')}
          disabled={isPending}
          className="feature-preset-button"
        >
          Editor
        </button>

        <button
          onClick={() => applyPreset('fullAccess')}
          disabled={isPending}
          className="feature-preset-button"
        >
          Full Access
        </button>
      </div>
    </div>
  )
}
```

## Project Assignment Examples

### Assignments List with Filters

```typescript
'use client'

import { useProjectAssignments } from '@/lib/hooks/use-projects'
import { useAdminStore } from '@/lib/stores/admin-store'

export function ProjectAssignmentsList() {
  const { filters, setFilters } = useAdminStore()

  const { data: assignments, isLoading } = useProjectAssignments({
    tenantId: filters.tenantId,
    userId: filters.userId,
  })

  if (isLoading) {
    return <div className="assignments-loading">Loading assignments...</div>
  }

  return (
    <div className="assignments-list">
      <div className="assignments-list-filters">
        <input
          type="text"
          placeholder="Filter by tenant ID..."
          value={filters.tenantId || ''}
          onChange={(e) =>
            setFilters({ tenantId: e.target.value || undefined })
          }
          className="assignments-filter-input"
        />

        <input
          type="text"
          placeholder="Filter by user ID..."
          value={filters.userId || ''}
          onChange={(e) =>
            setFilters({ userId: e.target.value || undefined })
          }
          className="assignments-filter-input"
        />
      </div>

      <div className="assignments-list-items">
        {assignments?.map((assignment) => (
          <div key={assignment.id} className="assignment-item">
            <div className="assignment-item-user">
              {assignment.user?.firstName} {assignment.user?.lastName}
            </div>

            <div className="assignment-item-tenant">
              {assignment.tenant?.businessName}
            </div>

            <div className="assignment-item-role">
              <span className={`assignment-role assignment-role-${assignment.role}`}>
                {assignment.role}
              </span>
            </div>

            <div className="assignment-item-status">
              <span className={`assignment-status assignment-status-${assignment.status}`}>
                {assignment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Create Assignment Form

```typescript
'use client'

import { useState } from 'react'
import { useCreateAssignment } from '@/lib/hooks/use-projects'

export function CreateAssignmentForm() {
  const { mutate: createAssignment, isPending, isError, error } = useCreateAssignment()

  const [formData, setFormData] = useState({
    userId: '',
    tenantId: '',
    role: 'developer' as const,
    status: 'active' as const,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    createAssignment(formData, {
      onSuccess: () => {
        setFormData({
          userId: '',
          tenantId: '',
          role: 'developer',
          status: 'active',
        })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="create-assignment-form">
      <h2>Assign Team Member to Project</h2>

      {isError && (
        <div className="create-assignment-error">
          {error?.message || 'Failed to create assignment'}
        </div>
      )}

      <div className="create-assignment-field">
        <label htmlFor="userId">User</label>
        <input
          type="text"
          id="userId"
          value={formData.userId}
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
          required
        />
      </div>

      <div className="create-assignment-field">
        <label htmlFor="tenantId">Tenant</label>
        <input
          type="text"
          id="tenantId"
          value={formData.tenantId}
          onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
          required
        />
      </div>

      <div className="create-assignment-field">
        <label htmlFor="role">Role</label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value as any })
          }
        >
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="content_manager">Content Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="create-assignment-submit"
      >
        {isPending ? 'Creating...' : 'Create Assignment'}
      </button>
    </form>
  )
}
```

## Tenant Administration Examples

### Tenant Stats Dashboard

```typescript
'use client'

import { useTenantStats, useTenantActivity } from '@/lib/hooks/use-admin-tenants'

export function TenantDashboard({ tenantId }: { tenantId: string }) {
  const { data: stats, isLoading: statsLoading } = useTenantStats(tenantId)
  const { data: activity, isLoading: activityLoading } = useTenantActivity(tenantId, 30)

  if (statsLoading || activityLoading) {
    return <div className="tenant-dashboard-loading">Loading...</div>
  }

  return (
    <div className="tenant-dashboard">
      <div className="tenant-dashboard-stats">
        <div className="tenant-stat-card">
          <span className="tenant-stat-value">{stats?.pages}</span>
          <span className="tenant-stat-label">Pages</span>
        </div>

        <div className="tenant-stat-card">
          <span className="tenant-stat-value">{stats?.posts}</span>
          <span className="tenant-stat-label">Posts</span>
        </div>

        <div className="tenant-stat-card">
          <span className="tenant-stat-value">{stats?.assets}</span>
          <span className="tenant-stat-label">Assets</span>
        </div>

        <div className="tenant-stat-card">
          <span className="tenant-stat-value">{stats?.users}</span>
          <span className="tenant-stat-label">Users</span>
        </div>
      </div>

      <div className="tenant-dashboard-activity">
        <div className="tenant-activity-section">
          <h3>Recent Pages</h3>
          {activity?.recentPages.map((page) => (
            <div key={page.id} className="tenant-activity-item">
              <span className="tenant-activity-title">{page.title}</span>
              <span className="tenant-activity-status">{page.status}</span>
              <span className="tenant-activity-date">
                {new Date(page.updatedAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>

        <div className="tenant-activity-section">
          <h3>Recent Posts</h3>
          {activity?.recentPosts.map((post) => (
            <div key={post.id} className="tenant-activity-item">
              <span className="tenant-activity-title">{post.title}</span>
              <span className="tenant-activity-status">{post.status}</span>
              <span className="tenant-activity-date">
                {new Date(post.updatedAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

## Combining Stores and Queries

### Admin Dashboard with Multiple Data Sources

```typescript
'use client'

import { useAdminUsers } from '@/lib/hooks/use-admin-users'
import { useAdminTenants } from '@/lib/hooks/use-admin-tenants'
import { useProjectAssignments } from '@/lib/hooks/use-projects'
import { useAdminStore } from '@/lib/stores/admin-store'

export function AdminDashboard() {
  const { filters } = useAdminStore()

  // Fetch all data in parallel
  const { data: users, isLoading: usersLoading } = useAdminUsers()
  const { data: tenants, isLoading: tenantsLoading } = useAdminTenants()
  const { data: assignments, isLoading: assignmentsLoading } = useProjectAssignments()

  const isLoading = usersLoading || tenantsLoading || assignmentsLoading

  if (isLoading) {
    return <div className="admin-dashboard-loading">Loading dashboard...</div>
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-summary">
        <div className="admin-summary-card">
          <h3>Total Users</h3>
          <span className="admin-summary-value">{users?.length}</span>
        </div>

        <div className="admin-summary-card">
          <h3>Active Tenants</h3>
          <span className="admin-summary-value">
            {tenants?.filter((t) => t.status === 'active').length}
          </span>
        </div>

        <div className="admin-summary-card">
          <h3>Project Assignments</h3>
          <span className="admin-summary-value">{assignments?.length}</span>
        </div>
      </div>

      <div className="admin-dashboard-content">
        {/* Render other components */}
      </div>
    </div>
  )
}
```

## Error Handling Patterns

### Global Error Handling

```typescript
'use client'

import { useAdminUsers } from '@/lib/hooks/use-admin-users'

export function UsersWithErrorHandling() {
  const { data, error, isError, refetch } = useAdminUsers()

  if (isError) {
    return (
      <div className="error-container">
        <h2>Failed to load users</h2>
        <p className="error-message">{error?.message}</p>
        <button onClick={() => refetch()} className="error-retry">
          Try Again
        </button>
      </div>
    )
  }

  return <div className="users-list">{/* Render users */}</div>
}
```

### Mutation Error Handling with Toast

```typescript
"use client";

import { useCreateUser } from "@/lib/hooks/use-admin-users";
import { toast } from "sonner"; // or your toast library

export function CreateUserWithToast() {
  const { mutate: createUser, isPending } = useCreateUser();

  const handleSubmit = (data: any) => {
    createUser(data, {
      onSuccess: () => {
        toast.success("User created successfully");
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to create user");
      },
    });
  };

  // Form implementation
}
```

## Performance Optimization

### Prefetching on Hover

```typescript
'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useAdminUsers } from '@/lib/hooks/use-admin-users'
import { queryKeys } from '@/lib/hooks/query-keys'
import { apiClient } from '@/lib/api-client'

export function UsersListWithPrefetch() {
  const { data: users } = useAdminUsers()
  const queryClient = useQueryClient()

  const prefetchUser = (userId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.admin.users.detail(userId),
      queryFn: () => apiClient.get(`/admin/users/${userId}`),
    })
  }

  return (
    <div className="users-list">
      {users?.map((user) => (
        <div
          key={user.id}
          onMouseEnter={() => prefetchUser(user.id)}
          className="user-item"
        >
          {user.firstName} {user.lastName}
        </div>
      ))}
    </div>
  )
}
```

### Selecting Derived Data

```typescript
'use client'

import { useAdminUsers } from '@/lib/hooks/use-admin-users'

export function UserCount() {
  // Only recomputes when count changes, not when user data changes
  const userCount = useAdminUsers({
    select: (data) => data.length,
  })

  return <div>Total Users: {userCount.data}</div>
}

export function ActiveUserEmails() {
  // Extract only what we need
  const emails = useAdminUsers({
    select: (data) =>
      data
        .filter((u) => u.status === 'active')
        .map((u) => u.email),
  })

  return (
    <ul>
      {emails.data?.map((email) => (
        <li key={email}>{email}</li>
      ))}
    </ul>
  )
}
```
