# Testing Permissions & RBAC

Complete guide for testing Role-Based Access Control (RBAC) and CRUD operations for admin and client users.

## Test Users & Roles

After running `pnpm db:seed`, you'll have the following test users:

### Agency Team (All have access to Builder at localhost:4001)

| Role                    | Email                  | Password    | Permissions                                                        |
| ----------------------- | ---------------------- | ----------- | ------------------------------------------------------------------ |
| **Owner** (Super Admin) | mo@webfunnel.com       | password123 | Full platform access, can create/delete users, modify all settings |
| **Admin**               | admin@webfunnel.com    | password123 | Can manage users, features, assignments (no destructive actions)   |
| **Developer**           | dev@webfunnel.com      | password123 | Technical project access, can deploy                               |
| **Designer**            | designer@webfunnel.com | password123 | Design project access                                              |
| **Content Manager**     | content@webfunnel.com  | password123 | Content editing access                                             |

### Client Users

| Role              | Email                     | Password    | Access                                             |
| ----------------- | ------------------------- | ----------- | -------------------------------------------------- |
| **Church Pastor** | pastor@mhbiblebaptist.com | password123 | LOCKED - Features must be unlocked via admin panel |

---

## Permission System Architecture

### 1. Agency-Level Permissions (API Guards)

Controlled by `@Roles()` and `@SuperAdmin()` decorators in API endpoints:

```typescript
// Requires owner OR admin role
@Roles(AgencyRole.OWNER, AgencyRole.ADMIN)

// Requires super admin only
@SuperAdmin()
```

**Agency Roles Hierarchy:**

- `owner` - Super admin access (can create/delete users, full CRUD)
- `admin` - Can manage users, features, assignments (no delete users)
- `developer` - Technical access to projects
- `designer` - Design access to projects
- `content_manager` - Content editing access

### 2. Tenant-Level Permissions (Feature Gates)

Controlled by `enabledFeatures` JSONB column in `Tenant` model:

**Available Features:**

```typescript
{
  'pages.view': boolean,
  'pages.edit': boolean,
  'pages.create': boolean,
  'pages.delete': boolean,
  'builder.access': boolean,
  'builder.blocks': boolean,
  'builder.layout': boolean,
  'config.header': boolean,
  'config.footer': boolean,
  'config.menus': boolean,
  'config.logos': boolean,
  'assets.upload': boolean,
  'assets.delete': boolean,
  'users.invite': boolean,
  'users.manage': boolean,
  'posts.create': boolean,
  'posts.edit': boolean,
  'posts.delete': boolean,
}
```

**Default State:** All features are `false` (locked) for new tenants.

### 3. Project-Level Permissions

Controlled by `ProjectAssignment` model with custom `permissions` JSONB:

```typescript
{
  fullAccess?: boolean,
  canDeploy?: boolean,
  canManageSettings?: boolean,
  // Add custom permissions as needed
}
```

---

## Testing Admin CRUD Operations

### Test Environment Setup

1. **Reseed Database:**

   ```bash
   cd api
   pnpm db:reset  # Drops, recreates, and seeds database
   ```

2. **Start Servers:**

   ```bash
   # Terminal 1: API
   cd api && pnpm dev  # Port 4000

   # Terminal 2: Builder
   cd builder && pnpm dev  # Port 4001
   ```

3. **Access Builder:**
   ```
   http://localhost:4001/login
   ```

---

### Test Case 1: Owner/Super Admin Access

**Login:** `mo@webfunnel.com` / `password123`

✅ **Should Be Able To:**

- Access all admin endpoints
- Create new users (`POST /api/admin/users`)
- Delete users (`DELETE /api/admin/users/:id`)
- Update all features for tenants
- Assign/unassign team members to projects
- View all tenants and statistics

**Test using curl:**

```bash
# 1. Login (get cookies)
curl -c cookies.txt -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mo@webfunnel.com","password":"password123"}'

# 2. List all users (should work)
curl -b cookies.txt http://localhost:4000/api/v1/admin/users

# 3. Create new user (should work)
curl -b cookies.txt -X POST http://localhost:4000/api/v1/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newdev@webfunnel.com",
    "firstName": "New",
    "lastName": "Developer",
    "password": "password123",
    "agencyRole": "developer"
  }'

# 4. Delete user (should work)
curl -b cookies.txt -X DELETE http://localhost:4000/api/v1/admin/users/USER_ID

# 5. Enable features for tenant
curl -b cookies.txt -X POST http://localhost:4000/api/v1/admin/features/tenant/TENANT_ID/toggle \
  -H "Content-Type: application/json" \
  -d '{"featureKey":"pages.edit","enabled":true}'
```

---

### Test Case 2: Admin Access

**Login:** `admin@webfunnel.com` / `password123`

✅ **Should Be Able To:**

- List all users
- Invite new users
- Update existing users
- Manage tenant features
- Manage project assignments

❌ **Should NOT Be Able To:**

- Create users directly (only invite)
- Delete users
- Access super-admin-only endpoints

**Test using curl:**

```bash
# 1. Login
curl -c cookies-admin.txt -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@webfunnel.com","password":"password123"}'

# 2. List users (should work)
curl -b cookies-admin.txt http://localhost:4000/api/v1/admin/users

# 3. Invite user (should work)
curl -b cookies-admin.txt -X POST http://localhost:4000/api/v1/admin/users/invite \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invited@webfunnel.com",
    "firstName": "Invited",
    "lastName": "User",
    "agencyRole": "content_manager"
  }'

# 4. Try to create user directly (should fail with 403)
curl -b cookies-admin.txt -X POST http://localhost:4000/api/v1/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@webfunnel.com",
    "firstName": "Test",
    "lastName": "User",
    "password": "password123",
    "agencyRole": "developer"
  }'
# Expected: 403 Forbidden

# 5. Try to delete user (should fail with 403)
curl -b cookies-admin.txt -X DELETE http://localhost:4000/api/v1/admin/users/USER_ID
# Expected: 403 Forbidden
```

---

### Test Case 3: Developer Access

**Login:** `dev@webfunnel.com` / `password123`

❌ **Should NOT Be Able To:**

- Access any admin endpoints (`/api/v1/admin/*`)
- Manage users, features, or projects

Expected: 403 Forbidden for all admin routes

**Test using curl:**

```bash
# 1. Login
curl -c cookies-dev.txt -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@webfunnel.com","password":"password123"}'

# 2. Try to access admin users (should fail)
curl -b cookies-dev.txt http://localhost:4000/api/v1/admin/users
# Expected: 403 Forbidden

# 3. Try to manage features (should fail)
curl -b cookies-dev.txt -X POST http://localhost:4000/api/v1/admin/features/tenant/TENANT_ID/toggle \
  -H "Content-Type: application/json" \
  -d '{"featureKey":"pages.edit","enabled":true}'
# Expected: 403 Forbidden
```

---

## Testing Feature Gates (Client Access)

### Test Case 4: Church Pastor (Client User)

**Login:** `pastor@mhbiblebaptist.com` / `password123`

**Initial State:** ALL features locked (set to `false`)

#### Step 1: Test Locked State

```bash
# 1. Login as pastor
curl -c cookies-pastor.txt -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"pastor@mhbiblebaptist.com","password":"password123"}'

# 2. Try to create page (should fail - feature locked)
curl -b cookies-pastor.txt -X POST http://localhost:4000/api/v1/pages \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "about",
    "title": "About Us",
    "status": "draft"
  }'
# Expected: 403 Forbidden (feature not enabled)
```

#### Step 2: Unlock Features as Admin

```bash
# Login as owner/admin
curl -c cookies-owner.txt -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mo@webfunnel.com","password":"password123"}'

# Enable 'pages.create' feature for tenant
curl -b cookies-owner.txt -X POST http://localhost:4000/api/v1/admin/features/tenant/TENANT_ID/toggle \
  -H "Content-Type: application/json" \
  -d '{"featureKey":"pages.create","enabled":true}'
```

#### Step 3: Test Unlocked State

```bash
# Try again as pastor (should now work)
curl -b cookies-pastor.txt -X POST http://localhost:4000/api/v1/pages \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "about",
    "title": "About Us",
    "status": "draft"
  }'
# Expected: 201 Created
```

---

## Testing from Builder UI

### Admin Panel Testing

1. **Login as Owner:**
   - Navigate to `http://localhost:4001/login`
   - Email: `mo@webfunnel.com`
   - Password: `password123`

2. **Access Admin Features:**
   - User Management: `/dashboard/admin/users`
   - Feature Management: `/dashboard/admin/features`
   - Project Assignments: `/dashboard/admin/projects`
   - Tenant Overview: `/dashboard/admin/tenants`

3. **Test CRUD Operations:**
   - **Create:** Invite new user
   - **Read:** View user list
   - **Update:** Change user role
   - **Delete:** Deactivate user (soft delete)

4. **Test Feature Management:**
   - Select tenant "MH Bible Baptist"
   - Toggle features on/off
   - Verify changes persist

### Role-Based UI Testing

**Test each role to verify UI restrictions:**

| Role      | Should See                          | Should NOT See                   |
| --------- | ----------------------------------- | -------------------------------- |
| Owner     | All admin panels, delete buttons    | -                                |
| Admin     | User management, feature management | Delete user button               |
| Developer | Dashboard, assigned projects        | Admin panels                     |
| Designer  | Dashboard, assigned projects        | Admin panels                     |
| Content   | Dashboard, content areas            | Admin panels, technical settings |

---

## Automated Testing Scripts

### Quick Permission Test Script

Create `api/scripts/test-permissions.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:4000"

echo "🧪 Testing Permissions..."

# Test 1: Owner can create user
echo "Test 1: Owner creates user"
curl -s -c cookies-owner.txt -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mo@webfunnel.com","password":"password123"}' > /dev/null

RESPONSE=$(curl -s -b cookies-owner.txt -X POST $BASE_URL/api/v1/admin/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","firstName":"Test","lastName":"User","password":"pass123","agencyRole":"developer"}')

if [[ $RESPONSE == *"id"* ]]; then
  echo "✅ PASS: Owner can create users"
else
  echo "❌ FAIL: Owner cannot create users"
fi

# Test 2: Admin cannot create user directly
echo ""
echo "Test 2: Admin cannot create user directly"
curl -s -c cookies-admin.txt -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@webfunnel.com","password":"password123"}' > /dev/null

RESPONSE=$(curl -s -b cookies-admin.txt -X POST $BASE_URL/api/v1/admin/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@test.com","firstName":"Test","lastName":"User","password":"pass123","agencyRole":"developer"}')

if [[ $RESPONSE == *"403"* ]] || [[ $RESPONSE == *"Forbidden"* ]]; then
  echo "✅ PASS: Admin correctly blocked from creating users"
else
  echo "❌ FAIL: Admin should not be able to create users directly"
fi

# Test 3: Developer cannot access admin endpoints
echo ""
echo "Test 3: Developer cannot access admin"
curl -s -c cookies-dev.txt -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@webfunnel.com","password":"password123"}' > /dev/null

RESPONSE=$(curl -s -b cookies-dev.txt $BASE_URL/api/v1/admin/users)

if [[ $RESPONSE == *"403"* ]] || [[ $RESPONSE == *"Forbidden"* ]] || [[ $RESPONSE == *"Unauthorized"* ]]; then
  echo "✅ PASS: Developer correctly blocked from admin access"
else
  echo "❌ FAIL: Developer should not access admin endpoints"
fi

echo ""
echo "🎉 Permission tests complete!"
```

Make executable and run:

```bash
chmod +x api/scripts/test-permissions.sh
./api/scripts/test-permissions.sh
```

---

## Expected Behaviors Summary

### Admin Operations Matrix

| Operation       | Owner | Admin | Developer | Designer | Content | Client |
| --------------- | ----- | ----- | --------- | -------- | ------- | ------ |
| List Users      | ✅    | ✅    | ❌        | ❌       | ❌      | ❌     |
| Create User     | ✅    | ❌    | ❌        | ❌       | ❌      | ❌     |
| Invite User     | ✅    | ✅    | ❌        | ❌       | ❌      | ❌     |
| Update User     | ✅    | ✅    | ❌        | ❌       | ❌      | ❌     |
| Delete User     | ✅    | ❌    | ❌        | ❌       | ❌      | ❌     |
| Manage Features | ✅    | ✅    | ❌        | ❌       | ❌      | ❌     |
| Manage Projects | ✅    | ✅    | ❌        | ❌       | ❌      | ❌     |
| View Tenants    | ✅    | ✅    | ❌        | ❌       | ❌      | ❌     |

### Client Content Operations (Feature-Gated)

| Operation         | Requires Feature |
| ----------------- | ---------------- |
| View Pages        | `pages.view`     |
| Edit Pages        | `pages.edit`     |
| Create Pages      | `pages.create`   |
| Delete Pages      | `pages.delete`   |
| Access Builder    | `builder.access` |
| Use Custom Blocks | `builder.blocks` |
| Upload Assets     | `assets.upload`  |
| Delete Assets     | `assets.delete`  |
| Create Posts      | `posts.create`   |
| Edit Posts        | `posts.edit`     |

---

## Troubleshooting

### Issue: "403 Forbidden" for valid user

**Check:**

1. User has correct `agencyRole` in database
2. Endpoint has `@Roles()` decorator with required roles
3. JWT token is valid (check cookies)

### Issue: Client can access locked features

**Check:**

1. Feature gate middleware is applied
2. `enabledFeatures` column in Tenant table
3. Feature key matches exactly (case-sensitive)

### Issue: Admin can delete users

**Check:**

1. Delete endpoint has `@SuperAdmin()` decorator
2. User's `isSuperAdmin` field is `false`

---

## Next Steps

1. **Reseed database:** `cd api && pnpm db:reset`
2. **Test each role manually** using the test accounts
3. **Run automated tests:** `./api/scripts/test-permissions.sh`
4. **Build admin UI** to manage permissions visually
5. **Add audit logging** to track all permission changes
