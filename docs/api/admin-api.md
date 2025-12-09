# Admin API Documentation

Enterprise-grade admin management system for Web & Funnel platform.

## Overview

The Admin API provides complete control over:

- **User Management** - Create, invite, update, and manage users
- **Feature Management** - Control feature access per tenant
- **Project Assignments** - Assign team members to client projects
- **Audit Logging** - Track all administrative actions

## Authorization

All admin endpoints require JWT authentication and specific roles.

### Agency Roles

- **Owner** - Full system access (can create/delete users, modify all settings)
- **Admin** - Can manage users, features, and assignments (no destructive actions)
- **Developer** - Technical project access
- **Designer** - Design project access
- **Content Manager** - Content editing access

### Decorators

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AgencyRole.OWNER, AgencyRole.ADMIN)  // Require owner OR admin
@SuperAdmin()  // Require super admin specifically
```

## User Management

Base URL: `/api/v1/admin/users`

### List All Users

```http
GET /api/v1/admin/users
Authorization: Bearer {token}
```

Query Parameters:

- `includeDeleted` (boolean) - Include inactive users

Response:

```json
[
  {
    "id": "user_123",
    "email": "john@agency.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "isSuperAdmin": false,
    "agencyRole": "developer",
    "status": "active",
    "emailVerified": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### Search Users

```http
GET /api/v1/admin/users/search?q=john
Authorization: Bearer {token}
```

### Get User Details

```http
GET /api/v1/admin/users/:id
Authorization: Bearer {token}
```

Response includes tenant users and project assignments.

### Create User (Super Admin Only)

```http
POST /api/v1/admin/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "new@agency.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "password": "SecurePass123!",
  "agencyRole": "developer",
  "isSuperAdmin": false,
  "phone": "+1234567890"
}
```

### Invite User

```http
POST /api/v1/admin/users/invite
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "invited@agency.com",
  "firstName": "Mike",
  "lastName": "Johnson",
  "agencyRole": "designer"
}
```

Generates a temporary password and sends invitation email (when email service configured).

### Update User

```http
PATCH /api/v1/admin/users/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "Updated",
  "agencyRole": "admin",
  "status": "active"
}
```

### Delete User (Super Admin Only)

```http
DELETE /api/v1/admin/users/:id
Authorization: Bearer {token}
```

Note: This is a soft delete (sets status to 'inactive').

## Feature Management

Base URL: `/api/v1/admin/features`

### Available Features

All features available in the system:

| Feature Key      | Description                |
| ---------------- | -------------------------- |
| `pages.view`     | View existing pages        |
| `pages.edit`     | Edit page content          |
| `pages.create`   | Create new pages           |
| `pages.delete`   | Delete pages               |
| `builder.access` | Access visual builder      |
| `builder.blocks` | Use custom blocks          |
| `builder.layout` | Control page layouts       |
| `config.header`  | Configure site header      |
| `config.footer`  | Configure site footer      |
| `config.menus`   | Configure navigation menus |
| `config.logos`   | Configure site logos       |
| `assets.upload`  | Upload media files         |
| `assets.delete`  | Delete media files         |
| `users.invite`   | Invite new users           |
| `users.manage`   | Manage user accounts       |
| `posts.create`   | Create blog posts          |
| `posts.edit`     | Edit blog posts            |
| `posts.delete`   | Delete blog posts          |

### List Available Features

```http
GET /api/v1/admin/features/available
Authorization: Bearer {token}
```

### Get Tenant Features

```http
GET /api/v1/admin/features/tenant/:tenantId
Authorization: Bearer {token}
```

Response:

```json
{
  "pages.view": true,
  "pages.edit": false,
  "pages.create": false,
  "builder.access": false,
  "assets.upload": false
}
```

### Update All Features

```http
PUT /api/v1/admin/features/tenant/:tenantId
Authorization: Bearer {token}
Content-Type: application/json

{
  "enabledFeatures": {
    "pages.view": true,
    "pages.edit": true,
    "pages.create": true,
    "builder.access": true
  }
}
```

### Toggle Single Feature

```http
POST /api/v1/admin/features/tenant/:tenantId/toggle
Authorization: Bearer {token}
Content-Type: application/json

{
  "featureKey": "pages.edit",
  "enabled": true
}
```

## Project Assignments

Base URL: `/api/v1/admin/projects`

### Project Roles

- **owner** - Full project control
- **admin** - Can manage project settings
- **developer** - Development access
- **designer** - Design access
- **content_manager** - Content editing

### List Assignments

```http
GET /api/v1/admin/projects/assignments
Authorization: Bearer {token}
```

Query Parameters:

- `tenantId` (string) - Filter by tenant
- `userId` (string) - Filter by user

Response:

```json
[
  {
    "id": "assignment_123",
    "userId": "user_123",
    "tenantId": "tenant_456",
    "role": "developer",
    "permissions": {},
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z",
    "user": {
      "id": "user_123",
      "email": "dev@agency.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "tenant": {
      "id": "tenant_456",
      "slug": "client-site",
      "businessName": "Client Business"
    }
  }
]
```

### Get Assignment

```http
GET /api/v1/admin/projects/assignments/:id
Authorization: Bearer {token}
```

### Create Assignment

```http
POST /api/v1/admin/projects/assignments
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_123",
  "tenantId": "tenant_456",
  "role": "developer",
  "permissions": {
    "canDeploy": true,
    "canManageSettings": false
  },
  "status": "active"
}
```

### Update Assignment

```http
PATCH /api/v1/admin/projects/assignments/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "role": "admin",
  "permissions": {
    "canDeploy": true,
    "canManageSettings": true
  }
}
```

### Delete Assignment

```http
DELETE /api/v1/admin/projects/assignments/:id
Authorization: Bearer {token}
```

## Tenant Administration

Base URL: `/api/v1/admin/tenants`

### List All Tenants with Stats

```http
GET /api/v1/admin/tenants
Authorization: Bearer {token}
```

Response:

```json
[
  {
    "id": "tenant_123",
    "slug": "client-site",
    "businessName": "Client Business",
    "businessType": "church",
    "status": "active",
    "enabledFeatures": { ... },
    "_count": {
      "pages": 12,
      "posts": 5,
      "assets": 48,
      "tenantUsers": 3
    },
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### Get Tenant Statistics

```http
GET /api/v1/admin/tenants/:id/stats
Authorization: Bearer {token}
```

Response:

```json
{
  "pages": 12,
  "posts": 5,
  "assets": 48,
  "users": 3
}
```

### Get Tenant Activity

```http
GET /api/v1/admin/tenants/:id/activity?days=30
Authorization: Bearer {token}
```

Response:

```json
{
  "recentPages": [
    {
      "id": "page_123",
      "title": "About Us",
      "status": "published",
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2024-01-16T00:00:00Z"
    }
  ],
  "recentPosts": [
    {
      "id": "post_456",
      "title": "New Blog Post",
      "status": "draft",
      "createdAt": "2024-01-14T00:00:00Z",
      "updatedAt": "2024-01-14T00:00:00Z"
    }
  ]
}
```

## Audit Logging

All administrative actions are automatically logged with:

- `action` - Type of action performed
- `performedBy` - User ID who performed the action
- `targetType` - Type of resource affected (user/tenant/feature/project)
- `targetId` - ID of affected resource
- `metadata` - Additional contextual information
- `timestamp` - When the action occurred

### Audit Actions Tracked

- `user.created` - New user created
- `user.updated` - User information updated
- `user.deleted` - User deactivated
- `user.invited` - User invitation sent
- `tenant.created` - New tenant created
- `tenant.updated` - Tenant settings changed
- `tenant.deleted` - Tenant deleted
- `feature.enabled` - Feature enabled for tenant
- `feature.disabled` - Feature disabled for tenant
- `project.assigned` - Team member assigned to project
- `project.unassigned` - Team member removed from project
- `permission.changed` - Permission levels modified

## Error Responses

All endpoints follow standard HTTP error codes:

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Insufficient permissions"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "User not found"
}
```

### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "User with this email already exists"
}
```

## Rate Limiting

Future implementation will include:

- 100 requests per minute for admin endpoints
- 10 requests per minute for user creation/deletion
- Rate limits per user, not per IP

## Best Practices

1. **Use Service Accounts** - Create dedicated service accounts for API integrations
2. **Minimal Permissions** - Grant only necessary permissions
3. **Audit Regularly** - Review audit logs for suspicious activity
4. **Rotate Credentials** - Change passwords and tokens regularly
5. **Feature Gates** - Start with features disabled, enable as needed
6. **Test Assignments** - Verify permissions before granting production access
