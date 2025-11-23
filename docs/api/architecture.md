# API Architecture Documentation

NestJS backend API for multi-tenant church CMS platform.

## Technology Stack

- **Framework:** NestJS 10.x
- **Database:** PostgreSQL 14+
- **ORM:** Prisma 5.x
- **Authentication:** JWT-based
- **Validation:** class-validator + class-transformer
- **Multi-tenancy:** Row-level tenant isolation

---

## Project Structure

```
api/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   │
│   ├── common/                    # Shared utilities
│   │   ├── decorators/           # Custom decorators (@TenantId, @CurrentUser, @Roles)
│   │   ├── guards/               # Auth guards (JWT, Roles, TenantMember)
│   │   ├── filters/              # Exception filters
│   │   ├── interceptors/         # Response interceptors
│   │   ├── pipes/                # Validation pipes
│   │   ├── middleware/           # Tenant middleware
│   │   └── services/             # Shared services (PrismaService)
│   │
│   ├── modules/                   # Feature modules
│   │   ├── auth/                 # Authentication & authorization
│   │   ├── tenants/              # Tenant management
│   │   ├── users/                # User management
│   │   ├── pages/                # Page content management
│   │   ├── posts/                # Blog/announcements
│   │   ├── assets/               # Media/file management
│   │   ├── site-config/          # Site configuration (TO BUILD)
│   │   ├── health/               # Health checks
│   │   └── webhooks/             # Integration webhooks
│   │
│   └── types/                     # Shared TypeScript types
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Database migrations
│   └── seed.ts                   # Seed data
│
└── test/                          # E2E tests
```

---

## Core Concepts

### 1. Multi-Tenancy

Every request is scoped to a tenant (customer church site).

**Tenant Identification:**

```typescript
// Via custom header (preferred)
X-Tenant-Id: church-slug

// Via subdomain (future)
church-slug.yourdomain.com

// Via query param (fallback)
?tenantId=church-slug
```

**Middleware:**

```typescript
// src/common/middleware/tenant.middleware.ts
export class TenantMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const tenantId =
      req.headers["x-tenant-id"] ||
      req.query.tenantId ||
      extractFromSubdomain(req.hostname);

    req["tenantId"] = tenantId;
    next();
  }
}
```

**Row-Level Security:**

```typescript
// ALL queries scoped by tenantId
this.prisma.page.findMany({
  where: { tenantId }, // ALWAYS present
});
```

**Custom Decorator:**

```typescript
// Extract tenantId from request
@Get()
findAll(@TenantId() tenantId: string) {
  return this.pagesService.findAll(tenantId)
}
```

---

### 2. Authentication & Authorization

**JWT Strategy:**

- Access tokens (15min expiry)
- Refresh tokens (7 days expiry)
- Stored in httpOnly cookies

**Role Hierarchy:**

1. **Super Admin** - Agency owner (manages all tenants)
2. **Owner** - Tenant owner (full access to their site)
3. **Admin** - Tenant admin (manage content + users)
4. **Editor** - Content editor (manage content only)
5. **Viewer** - Read-only access

**Guards:**

```typescript
// JWT Guard - Verify user is authenticated
@UseGuards(JwtAuthGuard)
@Get()
findAll() { ... }

// Roles Guard - Verify user has required role
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('owner', 'admin')
@Post()
create() { ... }

// Tenant Member Guard - Verify user belongs to tenant
@UseGuards(JwtAuthGuard, TenantMemberGuard)
@Get(':id')
findOne() { ... }
```

---

### 3. Module Architecture

Each feature module follows the same pattern:

```
module/
├── module.controller.ts      # HTTP endpoints
├── module.service.ts         # Business logic
├── module.module.ts          # Module definition
├── dto/
│   ├── create-module.dto.ts  # Create validation
│   ├── update-module.dto.ts  # Update validation
│   └── query-module.dto.ts   # Query filters
└── entities/
    └── module.entity.ts      # TypeScript types
```

**Example Module:**

```typescript
// pages.module.ts
@Module({
  imports: [PrismaModule],
  controllers: [PagesController],
  providers: [PagesService],
  exports: [PagesService],
})
export class PagesModule {}
```

---

## Existing Modules

### Auth Module

**Endpoints:**

```
POST   /api/auth/login            # Login with email/password
POST   /api/auth/register         # Register new user (agency only)
POST   /api/auth/refresh          # Refresh access token
POST   /api/auth/logout           # Logout
GET    /api/auth/me               # Get current user
POST   /api/auth/forgot-password  # Request password reset
POST   /api/auth/reset-password   # Reset password
```

**Service Methods:**

- `register(dto)` - Create new user with hashed password
- `login(dto)` - Validate credentials, return tokens
- `refreshToken(token)` - Issue new access token
- `forgotPassword(email)` - Send reset email
- `resetPassword(token, newPassword)` - Update password
- `validateUser(email, password)` - Check credentials

---

### Tenants Module

**Endpoints:**

```
POST   /api/tenants               # Create tenant
GET    /api/tenants               # List all tenants
GET    /api/tenants/:id           # Get tenant by ID
GET    /api/tenants/slug/:slug    # Get tenant by slug
PATCH  /api/tenants/:id           # Update tenant
DELETE /api/tenants/:id           # Delete tenant
POST   /api/tenants/:id/domains   # Add custom domain
DELETE /api/tenants/:id/domains/:domainId  # Remove domain
```

**Tenant Model:**

```typescript
{
  id: string
  slug: string (unique)
  businessName: string
  businessType?: string
  status: 'active' | 'inactive'

  // Configuration (JSONB)
  enabledFeatures: {
    blog: boolean
    events: boolean
    donations: boolean
  }

  themeConfig: {
    colors: { ... }
    fonts: { ... }
    spacing: { ... }
  }

  // Site Config (JSONB) - TO ADD
  headerConfig?: { ... }
  footerConfig?: { ... }
  menusConfig?: { ... }
  logosConfig?: { ... }

  // Metadata
  logoUrl?: string
  metaDescription?: string
  contactEmail?: string
  contactPhone?: string

  // Relations
  domains: TenantDomain[]
  tenantUsers: TenantUser[]
  pages: Page[]
  posts: Post[]
  assets: Asset[]
}
```

---

### Pages Module

**Endpoints:**

```
POST   /api/pages                 # Create page
GET    /api/pages                 # List pages (filtered by tenant)
GET    /api/pages/:id             # Get page by ID
GET    /api/pages/slug/:slug      # Get page by slug
PATCH  /api/pages/:id             # Update page
DELETE /api/pages/:id             # Delete page
POST   /api/pages/:id/publish     # Publish page
POST   /api/pages/:id/unpublish   # Unpublish page
POST   /api/pages/:id/duplicate   # Duplicate page
```

**Page Model:**

```typescript
{
  id: string
  tenantId: string
  slug: string (unique per tenant)
  title: string

  // Content (JSONB) - Block-based content
  content: {
    sections: Section[]  // Array of sections
    seo?: { ... }
    accessibility?: { ... }
    performance?: { ... }
  }

  // SEO
  metaTitle?: string
  metaDescription?: string

  // Status
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  template?: string

  // Author
  authorId?: string

  // Timestamps
  createdAt: DateTime
  updatedAt: DateTime
  publishedAt?: DateTime
}
```

**Content Structure:**

```typescript
// Top level
Page.content = {
  sections: Section[]
}

// Section (top-level container)
Section = {
  _key: string
  _type: 'section'
  background?: 'default' | 'primary' | 'secondary' | ...
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  width?: 'narrow' | 'default' | 'wide' | 'full'
  blocks: Block[]  // Array of blocks
}

// Block (content or container)
Block = ContentBlock | ContainerBlock

// ContentBlock (leaf nodes)
ContentBlock =
  | HeadingBlock
  | TextBlock
  | ButtonBlock
  | ImageBlock
  | CardBlock
  | ... (24+ types)

// ContainerBlock (can nest other blocks)
ContainerBlock =
  | GridBlock
  | FlexBlock
  | StackBlock
  | ContainerBlock
```

**Service Methods:**

- `create(tenantId, dto)` - Create new page with blocks
- `findAll(tenantId, query)` - List pages with filters
- `findById(tenantId, id)` - Get single page
- `findBySlug(tenantId, slug)` - Get page by slug
- `update(tenantId, id, dto)` - Update page content/metadata
- `delete(tenantId, id)` - Delete page
- `publish(tenantId, id)` - Publish page (set status + publishedAt)
- `unpublish(tenantId, id)` - Unpublish page
- `duplicate(tenantId, id)` - Create copy of page

---

### Posts Module

Similar to Pages but for blog/announcements.

**Endpoints:**

```
POST   /api/posts                 # Create post
GET    /api/posts                 # List posts
GET    /api/posts/:id             # Get post
PATCH  /api/posts/:id             # Update post
DELETE /api/posts/:id             # Delete post
POST   /api/posts/:id/publish     # Publish post
GET    /api/posts/categories      # List categories
GET    /api/posts/tags            # List tags
```

**Post Model:**

```typescript
{
  id: string
  tenantId: string
  slug: string
  title: string
  excerpt?: string
  content: string  // Rich text or blocks
  featuredImageId?: string
  category?: string
  tags: string[]
  metaTitle?: string
  metaDescription?: string
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  authorId?: string
  viewCount: number
  createdAt: DateTime
  updatedAt: DateTime
  publishedAt?: DateTime
}
```

---

### Assets Module

Media and file management.

**Endpoints:**

```
POST   /api/assets/upload         # Upload file
GET    /api/assets                # List assets
GET    /api/assets/:id            # Get asset
PATCH  /api/assets/:id            # Update asset metadata
DELETE /api/assets/:id            # Delete asset
```

**Asset Model:**

```typescript
{
  id: string
  tenantId: string
  uploadedBy?: string

  // File info
  fileKey: string      // S3 key or local path
  fileName: string
  fileType: string     // 'image' | 'video' | 'audio' | 'document'
  mimeType?: string
  sizeBytes?: number

  // Image-specific
  width?: number
  height?: number

  // URLs
  url: string
  thumbnailUrl?: string

  // Metadata
  altText?: string
  usageContext?: string  // 'page' | 'post' | 'avatar' | 'logo'

  createdAt: DateTime
}
```

---

### Users Module

User management within tenants.

**Endpoints:**

```
GET    /api/users/:id             # Get user
PATCH  /api/users/:id             # Update user
GET    /api/users/tenant/:tenantId  # List tenant users
```

**User Model:**

```typescript
{
  id: string
  email: string (unique)
  firstName?: string
  lastName?: string
  avatarUrl?: string
  passwordHash?: string

  // Platform-level
  isSuperAdmin: boolean
  agencyRole?: 'owner' | 'developer' | 'designer'

  // Status
  status: 'active' | 'inactive'
  emailVerified: boolean

  // Security
  lastLoginAt?: DateTime
  lastLoginIp?: string

  // Relations
  tenantUsers: TenantUser[]  // Many-to-many with tenants
}
```

**TenantUser (Join Table):**

```typescript
{
  id: string
  tenantId: string
  userId: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'

  permissions: {
    pages: { view: boolean, create: boolean, edit: boolean, delete: boolean }
    posts: { view: boolean, create: boolean, edit: boolean, delete: boolean }
    assets: { view: boolean, create: boolean, edit: boolean, delete: boolean }
    settings: { view: boolean, edit: boolean }
  }

  invitedBy?: string
  invitationAcceptedAt?: DateTime
  lastActiveAt?: DateTime
  createdAt: DateTime
}
```

---

### Health Module

System health checks.

**Endpoints:**

```
GET    /api/health                # Health check
GET    /api/health/db             # Database connectivity
```

---

### Webhooks Module

Integration webhooks for external services.

**Endpoints:**

```
POST   /api/webhooks              # Create webhook
GET    /api/webhooks              # List webhooks
DELETE /api/webhooks/:id          # Delete webhook
POST   /api/webhooks/:id/test     # Test webhook
```

---

## Modules to Build

### SiteConfig Module (TO BUILD)

Centralized configuration for headers, footers, menus, and logos.

**Endpoints:**

```
GET    /api/tenants/:tenantId/config              # Get all config
PUT    /api/tenants/:tenantId/config              # Update all config
GET    /api/tenants/:tenantId/config/header       # Get header config
PUT    /api/tenants/:tenantId/config/header       # Update header config
GET    /api/tenants/:tenantId/config/footer       # Get footer config
PUT    /api/tenants/:tenantId/config/footer       # Update footer config
GET    /api/tenants/:tenantId/config/menus        # Get menus config
PUT    /api/tenants/:tenantId/config/menus        # Update menus config
GET    /api/tenants/:tenantId/config/logos        # Get logos config
PUT    /api/tenants/:tenantId/config/logos        # Update logos config
```

**Data Structure:**

```typescript
// Stored in Tenant.headerConfig (JSONB)
HeaderConfig = {
  template: 'standard' | 'centered' | 'split'
  logo: 'primary' | 'icon' | 'custom'
  navigation: {
    menu: 'main-menu'  // References menusConfig
    style: 'horizontal' | 'vertical'
    variant: 'default' | 'minimal' | 'bold'
  }
  actions: {
    cta?: { text: string, href: string, variant: string }
    search?: boolean
    language?: boolean
  }
  behavior: {
    sticky: boolean
    transparent: boolean
    hideOnScroll: boolean
  }
}

// Stored in Tenant.footerConfig (JSONB)
FooterConfig = {
  template: 'simple' | 'columns' | 'centered'
  logo: 'primary' | 'icon' | null
  columns: Array<{
    title: string
    menu?: string  // References menusConfig
    content?: string
  }>
  social: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
  }
  legal: {
    copyright: string
    privacyPolicy?: string
    termsOfService?: string
  }
}

// Stored in Tenant.menusConfig (JSONB)
MenusConfig = {
  'main-menu': {
    items: Array<{
      label: string
      href: string
      icon?: string
      children?: Array<{
        label: string
        href: string
        icon?: string
      }>
    }>
  }
  'footer-menu': { ... }
  'mobile-menu': { ... }
}

// Stored in Tenant.logosConfig (JSONB)
LogosConfig = {
  'primary': {
    type: 'svg' | 'image'
    svg?: string  // SVG markup
    imageUrl?: string
    alt: string
    width?: number
    height?: number
  }
  'icon': { ... }
  'custom': { ... }
}
```

**Service Methods:**

- `getConfig(tenantId)` - Get all site config
- `updateConfig(tenantId, dto)` - Update all config
- `getHeaderConfig(tenantId)` - Get header config
- `updateHeaderConfig(tenantId, dto)` - Update header
- `getFooterConfig(tenantId)` - Get footer config
- `updateFooterConfig(tenantId, dto)` - Update footer
- `getMenusConfig(tenantId)` - Get menus
- `updateMenusConfig(tenantId, dto)` - Update menus
- `getLogosConfig(tenantId)` - Get logos
- `updateLogosConfig(tenantId, dto)` - Update logos

---

## Block Type System (TO BUILD)

The API needs to validate all 24+ block types from the client.

**Current State:**

- Generic `ContentBlockDto` exists but doesn't validate specific block types
- No type-specific validation
- JSONB content field accepts any structure

**What to Build:**

1. **Create DTOs for each block type:**

```typescript
// dto/blocks/heading-block.dto.ts
export class HeadingBlockDto {
  @IsString()
  text: string;

  @IsEnum(["h1", "h2", "h3", "h4", "h5", "h6"])
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  @IsEnum(["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"])
  @IsOptional()
  size?: string;

  @IsEnum(["left", "center", "right"])
  @IsOptional()
  align?: "left" | "center" | "right";

  @IsEnum(["normal", "medium", "semibold", "bold"])
  @IsOptional()
  weight?: string;

  @IsEnum(["default", "primary", "secondary", "muted"])
  @IsOptional()
  color?: string;
}

// dto/blocks/text-block.dto.ts
export class TextBlockDto {
  @IsString()
  text: string;

  @IsEnum(["xs", "sm", "md", "lg", "xl"])
  @IsOptional()
  size?: string;

  @IsEnum(["left", "center", "right", "justify"])
  @IsOptional()
  align?: string;

  @IsEnum(["body", "muted", "caption"])
  @IsOptional()
  variant?: string;
}

// ... 22 more block DTOs
```

2. **Create discriminated union validator:**

```typescript
// dto/content-block.dto.ts
export class ContentBlockDto {
  @IsString()
  _key: string;

  @IsEnum([
    "heading-block",
    "text-block",
    "button-block",
    "image-block",
    // ... all 24+ block types
  ])
  _type: string;

  @ValidateNested()
  @Type(() => Object, {
    discriminator: {
      property: "_type",
      subTypes: [
        { value: HeadingBlockDto, name: "heading-block" },
        { value: TextBlockDto, name: "text-block" },
        { value: ButtonBlockDto, name: "button-block" },
        // ... all block types
      ],
    },
  })
  data: any;
}
```

3. **Update CreatePageDto:**

```typescript
export class CreatePageDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @ValidateNested()
  @Type(() => ContentDto)
  content: {
    sections: SectionDto[];
  };

  // ... other fields
}

export class SectionDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "section";

  @IsEnum(["default", "primary", "secondary", "accent", "muted"])
  @IsOptional()
  background?: string;

  @IsEnum(["none", "xs", "sm", "md", "lg", "xl", "2xl"])
  @IsOptional()
  spacing?: string;

  @IsEnum(["narrow", "default", "wide", "full"])
  @IsOptional()
  width?: string;

  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  blocks: ContentBlockDto[];
}
```

4. **Nesting Validation:**

```typescript
// Custom validator for max 4-level nesting
@ValidatorConstraint({ name: "maxNestingLevel", async: false })
export class MaxNestingLevelConstraint implements ValidatorConstraintInterface {
  validate(blocks: any[], args: ValidationArguments) {
    return this.checkNestingLevel(blocks, 0) <= 4;
  }

  private checkNestingLevel(blocks: any[], currentLevel: number): number {
    if (!Array.isArray(blocks)) return currentLevel;

    let maxLevel = currentLevel;
    for (const block of blocks) {
      if (block.blocks) {
        const nestedLevel = this.checkNestingLevel(
          block.blocks,
          currentLevel + 1,
        );
        maxLevel = Math.max(maxLevel, nestedLevel);
      }
    }
    return maxLevel;
  }

  defaultMessage(args: ValidationArguments) {
    return "Block nesting cannot exceed 4 levels";
  }
}
```

---

## Database Schema (Prisma)

**Current Schema:**

```prisma
model Tenant {
  id              String   @id @default(dbgenerated("gen_random_uuid()"))
  slug            String   @unique
  businessName    String
  businessType    String?
  status          String   @default("active")

  enabledFeatures Json     @default("{}") @db.JsonB
  themeConfig     Json     @default("{}") @db.JsonB
  planLimits      Json     @default("{}") @db.JsonB

  // Site configuration (ADDED)
  headerConfig    Json?    @db.JsonB
  footerConfig    Json?    @db.JsonB
  menusConfig     Json?    @db.JsonB
  logosConfig     Json?    @db.JsonB

  logoUrl         String?
  metaDescription String?
  contactEmail    String?
  contactPhone    String?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  domains         TenantDomain[]
  tenantUsers     TenantUser[]
  assets          Asset[]
  pages           Page[]
  posts           Post[]

  @@index([slug])
  @@index([status])
  @@map("tenants")
}

model Page {
  id              String    @id @default(dbgenerated("gen_random_uuid()"))
  tenantId        String
  slug            String
  title           String

  // Block-based content
  content         Json?     @db.JsonB

  metaTitle       String?
  metaDescription String?
  status          String    @default("draft")
  template        String?
  authorId        String?

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  publishedAt     DateTime?

  tenant          Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  author          User?     @relation(fields: [authorId], references: [id])

  @@unique([tenantId, slug])
  @@index([tenantId])
  @@index([tenantId, status])
  @@map("pages")
}

// ... other models (User, TenantUser, Asset, Post, etc.)
```

---

## API Response Format

**Success Response:**

```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

**Error Response:**

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

**Pagination:**

```typescript
GET /api/pages?page=1&limit=20&status=published&sort=-createdAt
```

---

## Security

**Authentication:**

- JWT tokens in httpOnly cookies
- CSRF protection
- Rate limiting (100 req/min for public, 1000 req/min for authenticated)

**Authorization:**

- Role-based access control (RBAC)
- Tenant-scoped data isolation
- Row-level security in Prisma queries

**Validation:**

- All DTOs validated with class-validator
- SQL injection prevention via Prisma
- XSS prevention via sanitization

**CORS:**

```typescript
// main.ts
app.enableCors({
  origin: [
    "http://localhost:3000", // Client
    "http://localhost:3001", // Builder
    process.env.CLIENT_URL,
    process.env.BUILDER_URL,
  ],
  credentials: true,
});
```

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/church_cms"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=4000
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:3000,http://localhost:3001"
CLIENT_URL="http://localhost:3000"
BUILDER_URL="http://localhost:3001"

# File Upload
MAX_FILE_SIZE_MB=10
UPLOAD_PATH="./uploads"
AWS_S3_BUCKET="your-bucket"  # Optional
AWS_ACCESS_KEY_ID="..."       # Optional
AWS_SECRET_ACCESS_KEY="..."   # Optional
```

---

## Next Steps

1. ✅ Clean up Prisma schema (DONE)
2. ✅ Remove e-commerce modules (DONE)
3. ⏳ Build block type validation DTOs
4. ⏳ Build SiteConfig module
5. ⏳ Test all endpoints
6. ⏳ Add integration tests
7. ⏳ Add API documentation (Swagger)
