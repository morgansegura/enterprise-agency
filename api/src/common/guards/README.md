# Authentication & Authorization Guards

This directory contains guards for protecting API endpoints.

## Available Guards

### 1. **AuthGuard** (`/modules/auth/auth.guard.ts`)

Validates Clerk JWT tokens and attaches user to request.

**Usage:**

```typescript
@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  @Get()
  getProducts(@CurrentUser() user: { id: string; sessionId: string }) {
    // user.id is the Clerk user ID
  }
}
```

### 2. **TenantMemberGuard** (`tenant-member.guard.ts`)

Ensures authenticated user is a member of the current tenant.

**Usage:**

```typescript
@Controller('products')
@UseGuards(AuthGuard, TenantMemberGuard)
export class ProductsController {
  @Get()
  getProducts(@TenantUser() tenantUser: TenantUser) {
    // tenantUser contains role and permissions
  }
}
```

### 3. **RolesGuard** (`roles.guard.ts`)

Checks if user has required role(s) in the current tenant.

**Usage:**

```typescript
@Controller('products')
@UseGuards(AuthGuard, RolesGuard)
export class ProductsController {
  @Delete(':id')
  @Roles('owner', 'admin')
  deleteProduct(@Param('id') id: string) {
    // Only owners and admins can delete
  }
}
```

## Role Hierarchy

```
owner    - Full control (can delete tenant, manage billing)
admin    - Manage most things (users, content, settings)
editor   - Create and edit content
viewer   - Read-only access
customer - Limited customer portal access
```

## Guard Order Matters!

Always apply guards in this order:

1. **AuthGuard** - First, authenticate the user
2. **TenantMemberGuard** OR **RolesGuard** - Then check tenant membership/roles

```typescript
// ✅ Correct order
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')

// ❌ Wrong order (will fail)
@UseGuards(RolesGuard, AuthGuard)
@Roles('admin')
```

## Decorators

### `@CurrentUser()`

Extracts authenticated user from Clerk JWT.

```typescript
@Get('me')
getMe(@CurrentUser() user: { id: string; sessionId: string }) {
  return { clerkId: user.id }
}
```

### `@TenantId()`

Extracts tenant ID from request (set by TenantMiddleware).

```typescript
@Get('products')
getProducts(@TenantId() tenantId: string) {
  return this.productsService.findAll(tenantId)
}
```

### `@TenantUser()`

Extracts tenant user info (role + permissions) from request.

```typescript
@Get('dashboard')
@UseGuards(AuthGuard, TenantMemberGuard)
getDashboard(@TenantUser() tenantUser: TenantUser) {
  return { role: tenantUser.role, permissions: tenantUser.permissions }
}
```

### `@Roles(...roles: string[])`

Specifies required roles for an endpoint.

```typescript
@Delete('tenant')
@Roles('owner') // Only owners can delete tenant
deleteTenant() {
  // ...
}
```

## Examples

### Protect entire controller

```typescript
@Controller('settings')
@UseGuards(AuthGuard, RolesGuard)
@Roles('owner', 'admin')
export class SettingsController {
  // All routes require owner or admin role
}
```

### Mix public and protected routes

```typescript
@Controller('products')
export class ProductsController {
  @Get() // Public - no auth required
  getAll() {
    return this.productsService.findAll()
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('editor', 'admin', 'owner')
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto)
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'owner')
  delete(@Param('id') id: string) {
    return this.productsService.delete(id)
  }
}
```

### Check permissions (not just roles)

```typescript
@Get('analytics')
@UseGuards(AuthGuard, TenantMemberGuard)
getAnalytics(@TenantUser() tenantUser: TenantUser) {
  const canViewAnalytics = tenantUser.permissions.analytics?.view

  if (!canViewAnalytics) {
    throw new ForbiddenException('No analytics permission')
  }

  return this.analyticsService.getData(tenantUser.tenantId)
}
```

## Testing Guards

When testing protected endpoints:

1. Get Clerk JWT token (from frontend or Clerk API)
2. Include in Authorization header:
   ```
   Authorization: Bearer <clerk-jwt-token>
   ```
3. Include tenant context (subdomain or query param):
   ```
   GET https://demo.api.com/products
   or
   GET https://api.com/products?tenant=demo
   ```

## Security Notes

- **Never skip AuthGuard** on protected routes
- **Always check tenant context** for multi-tenant operations
- **Use RolesGuard** for sensitive operations (delete, config changes)
- **Verify permissions** in service layer as an additional safety layer
- **Audit log** all sensitive operations (already in schema)
