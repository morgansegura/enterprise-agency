# Tenant Hierarchy Architecture

## Overview

The platform implements a 3-tier tenant hierarchy that supports agency-client-subClient relationships. This architecture enables:

- **Web and Funnel** (Agency) to manage all client sites
- **Clients** to manage their own sites and their sub-clients
- **Sub-clients** to have limited access (file sharing, collaboration)

## Tenant Types

```
AGENCY (Tier 1)
└── CLIENT (Tier 2)
    └── SUB_CLIENT (Tier 3)
```

### AGENCY

The root tenant representing the agency (Web and Funnel).

- Full access to all tenants and their data
- Can create and manage CLIENT tenants
- Agency team members can be assigned to work on any CLIENT tenant
- Has its own website content (built on the same platform)

### CLIENT

Website clients of the agency.

- Can manage their own site content
- Can create and manage SUB_CLIENT tenants (their own clients)
- Have team members via TenantUser
- Agency team can be assigned via ProjectAssignment

### SUB_CLIENT

Clients of the clients (end customers).

- Limited access (file sharing, collaboration)
- Cannot create child tenants
- Access controlled by parent CLIENT tenant

## Database Schema

### Tenant Model Fields

```prisma
model Tenant {
  // Hierarchy fields
  parentTenantId String?    @map("parent_tenant_id")
  tenantType     TenantType @default(CLIENT) @map("tenant_type")
  clientType     ClientType? @map("client_type")

  // Self-referential relations
  parent   Tenant?  @relation("TenantHierarchy", fields: [parentTenantId], references: [id], onDelete: SetNull)
  children Tenant[] @relation("TenantHierarchy")
}

enum TenantType {
  AGENCY     // Web and Funnel - full access
  CLIENT     // Website clients - own site + sub-clients
  SUB_CLIENT // Client's clients - limited access
}

enum ClientType {
  BUSINESS   // Business/organization
  INDIVIDUAL // Individual person
}
```

## Access Control Model

### Dual Access Pattern

Users can access tenants through two mechanisms:

1. **TenantUser** (Client Team Members)
   - Direct membership in a tenant
   - Has explicit role and permissions
   - Used for client's own team

2. **ProjectAssignment** (Agency Team)
   - Assignment to work on a tenant
   - Agency team members working on client sites
   - Has role-based permissions

### Access Check Flow

```typescript
async checkUserTenantAccess(userId, tenantId) {
  // 1. Check TenantUser membership
  const tenantUser = await findTenantUser(tenantId, userId);
  if (tenantUser) return { accessType: "member", role: tenantUser.role };

  // 2. Check ProjectAssignment
  const assignment = await findProjectAssignment(tenantId, userId);
  if (assignment) return { accessType: "assigned", role: assignment.role };

  // 3. Check super admin
  const user = await findUser(userId);
  if (user?.isSuperAdmin) return { accessType: "superadmin", role: "admin" };

  return { hasAccess: false };
}
```

## API Endpoints

### Hierarchy Endpoints

| Method | Endpoint                 | Description                                    |
| ------ | ------------------------ | ---------------------------------------------- |
| GET    | `/tenants/agency`        | Get the agency tenant                          |
| GET    | `/tenants/accessible`    | Get tenants accessible to current user         |
| GET    | `/tenants/type/:type`    | Get tenants by type (AGENCY/CLIENT/SUB_CLIENT) |
| GET    | `/tenants/:id/children`  | Get child tenants                              |
| GET    | `/tenants/:id/hierarchy` | Get full hierarchy (ancestors + children)      |
| GET    | `/tenants/:id/access`    | Check current user's access to tenant          |

### Creating Tenants with Hierarchy

When creating a tenant with `parentTenantId`:

1. Parent tenant is validated
2. Hierarchy rules are enforced:
   - AGENCY can have CLIENT children
   - CLIENT can have SUB_CLIENT children
   - SUB_CLIENT cannot have children
3. Tenant type is auto-set based on parent if not provided

```typescript
// Create a client under the agency
POST /tenants
{
  "slug": "acme-corp",
  "businessName": "Acme Corporation",
  "parentTenantId": "<agency-tenant-id>",
  "clientType": "BUSINESS"
}
// tenantType will be auto-set to CLIENT

// Create a sub-client under a client
POST /tenants
{
  "slug": "acme-customer",
  "businessName": "Acme Customer",
  "parentTenantId": "<client-tenant-id>",
  "clientType": "INDIVIDUAL"
}
// tenantType will be auto-set to SUB_CLIENT
```

## Frontend Integration

### Tenant Store

The `useTenantsStore` manages tenant state:

```typescript
interface TenantsState {
  tenants: Tenant[]; // All tenants (admin views)
  accessibleTenants: AccessibleTenant[]; // Tenants user can access
  activeTenantId: string | null; // Current working tenant
  activeTenant: Tenant | null; // Full tenant data
}
```

### Hooks

```typescript
// Get tenants accessible to current user
const { data: tenants } = useAccessibleTenants();

// Get/manage active tenant
const { activeTenant, switchTenant } = useActiveTenant();

// Get tenant hierarchy
const { data: hierarchy } = useTenantHierarchy(tenantId);

// Check access to a tenant
const { data: access } = useTenantAccess(tenantId);
```

### Tenant Switcher Component

The `TenantSwitcher` component allows users to switch between accessible tenants:

```tsx
import { TenantSwitcher } from "@/components/layout/tenant-switcher";

// In sidebar
<SidebarMenuItem>
  <TenantSwitcher />
</SidebarMenuItem>;
```

Features:

- Groups tenants by type (Agency > Clients > Sub-Clients)
- Shows access type (member, assigned, superadmin)
- Persists active tenant across sessions
- Navigates to tenant workspace on switch

## Security Considerations

### Validation Rules

1. **Circular Reference Prevention**: Cannot set a tenant's ancestor as its child
2. **Type Hierarchy Enforcement**: SUB_CLIENT cannot have children
3. **Parent Validation**: Parent tenant must exist and be valid type
4. **Access Control**: Users can only access tenants they have explicit access to

### Authorization Guards

All tenant endpoints are protected by:

1. `JwtAuthGuard` - Authentication required
2. `RolesGuard` - Role-based access (owner, admin, editor)
3. Access verification via `checkUserTenantAccess`

## Migration Path

### Setting Up Agency Tenant

1. Create or update the primary tenant to be AGENCY type:

```sql
UPDATE tenants
SET tenant_type = 'AGENCY',
    client_type = NULL,
    parent_tenant_id = NULL
WHERE is_primary_tenant = true;
```

2. Update existing client tenants:

```sql
UPDATE tenants
SET tenant_type = 'CLIENT',
    parent_tenant_id = (SELECT id FROM tenants WHERE tenant_type = 'AGENCY')
WHERE tenant_type != 'AGENCY'
  AND parent_tenant_id IS NULL;
```

## Future Enhancements

- [ ] Sub-client file sharing portal
- [ ] Hierarchical permissions inheritance
- [ ] Cross-tenant asset sharing
- [ ] Tenant-specific feature flags based on hierarchy
- [ ] Billing/subscription per tenant type
