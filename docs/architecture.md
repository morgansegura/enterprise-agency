# Church Website Builder - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Multi-Tenant System                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────┐      ┌────────────┐      ┌────────────┐   │
│  │  Client    │      │  Builder   │      │    API     │   │
│  │  (Next.js) │◄────►│  (Next.js) │◄────►│  (NestJS)  │   │
│  │            │      │            │      │            │   │
│  │ Frontend   │      │   Admin    │      │  Backend   │   │
│  │ Template   │      │    UI      │      │  + Auth    │   │
│  └────────────┘      └────────────┘      └─────┬──────┘   │
│       │                                         │          │
│       │                                         │          │
│       │                                    ┌────▼────┐     │
│       └────────────────────────────────────►PostgreSQL│     │
│                                            └─────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Core Principles

1. **One API, One Builder, Multiple Frontends**
   - Single NestJS API serves all customers
   - Single Next.js builder for content management
   - Each customer gets their own custom Next.js frontend

2. **Full Ownership**
   - No vendor lock-in
   - Custom codebase you control
   - Deploy anywhere

3. **Agency-First Design**
   - YOU design and build customer sites
   - Customers optionally edit content (if they pay)
   - Builder is YOUR tool

4. **Block-Based Content**
   - Reusable component blocks
   - Flexible layout system
   - Type-safe data structures

## Technology Stack

### API (Backend)

- **Framework:** NestJS 10.x
- **Language:** TypeScript 5.x
- **Database:** PostgreSQL 16.x
- **ORM:** Prisma 5.x
- **Auth:** JWT + bcrypt
- **API Style:** REST (GraphQL optional later)

### Builder (Admin)

- **Framework:** Next.js 15.x
- **Language:** TypeScript 5.x
- **UI:** Radix UI + Tailwind CSS 4
- **Forms:** React Hook Form + Zod
- **State:** React Query (TanStack Query)

### Client (Customer Frontends)

- **Framework:** Next.js 16.x
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 4 + CSS Custom Properties
- **Rendering:** Server Components + ISR
- **Deployment:** Vercel (or any Next.js host)

## Project Structure

```
/
├── client/              # Frontend template (existing)
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── styles/
│
├── api/                 # Backend API (NestJS)
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── sites/
│   │   ├── pages/
│   │   ├── config/
│   │   ├── auth/
│   │   └── common/
│   └── prisma/
│
├── builder/             # Admin builder (Next.js)
│   ├── app/
│   ├── components/
│   └── lib/
│
└── docs/
    ├── architecture.md  # This file
    ├── api/            # API documentation
    └── builder/        # Builder documentation
```

## Data Flow

### Content Creation Flow

```
1. Agency owner opens Builder
2. Creates new site for customer
3. Designs pages using block editor
4. Saves to API (PostgreSQL)
5. Deploys customer frontend
6. Frontend fetches content from API
```

### Content Editing Flow (Optional - if customer pays)

```
1. Customer logs into Builder
2. Views their site's pages
3. Edits text/images in blocks
4. Saves changes to API
5. Frontend auto-updates (ISR/revalidation)
```

## Multi-Tenancy Strategy

### Approach: Shared Database, Isolated Data

**Database:**

- Single PostgreSQL instance
- All customers in same database
- Data isolated by `siteId` foreign keys
- Row-level security via Prisma queries

**Benefits:**

- Simple to manage
- Cost-effective
- Easy backups
- Can split later if needed

**Alternative (Future):**

- Database per customer (more isolation)
- Schema per customer (PostgreSQL schemas)

## Authentication & Authorization

### Levels

1. **Agency Owner** (you)
   - Full access to all sites
   - Can create/delete sites
   - Can manage all content

2. **Customer Editor** (optional paid feature)
   - Access to their site only
   - Can edit content within constraints
   - Cannot change structure/design

3. **API Key** (for frontend)
   - Read-only access
   - Can fetch published content
   - Rate limited

### Implementation

- JWT tokens for Builder authentication
- API keys for frontend authentication
- Role-based access control (RBAC)

## Content Storage

### Page Content Structure

```json
{
  "sections": [
    {
      "_key": "hero-section",
      "_type": "section",
      "background": "primary",
      "spacing": "2xl",
      "blocks": [
        {
          "_key": "hero-heading",
          "_type": "heading-block",
          "data": {
            "text": "Welcome to Our Church",
            "level": "h1",
            "size": "6xl"
          }
        }
      ]
    }
  ]
}
```

**Stored as:**

- PostgreSQL JSONB column
- Validated against TypeScript types
- Queryable with JSON operators (future)

## Deployment Strategy

### Development

```
API:      http://localhost:3000
Builder:  http://localhost:3001
Client:   http://localhost:3002
```

### Production

```
API:      api.yourcompany.com
Builder:  builder.yourcompany.com
Client:   customer-domain.com (custom per customer)
```

### Hosting Recommendations

- **API:** Railway, Render, DigitalOcean App Platform
- **Builder:** Vercel, Netlify
- **Client:** Vercel, Netlify (per customer)
- **Database:** Managed PostgreSQL (Railway, Render, Neon)

## Scaling Considerations

### Phase 1 (0-10 customers)

- Single API server
- Single database instance
- Simple deployment

### Phase 2 (10-50 customers)

- Add Redis for caching
- Database connection pooling
- CDN for static assets
- Image optimization service

### Phase 3 (50+ customers)

- Horizontal API scaling
- Database read replicas
- Separate media storage (S3/R2)
- Advanced caching strategies

## Security Considerations

1. **API Security**
   - CORS configured properly
   - Rate limiting
   - Input validation (Zod)
   - SQL injection prevention (Prisma)
   - XSS prevention

2. **Authentication**
   - Secure password hashing (bcrypt)
   - JWT with expiration
   - Refresh token rotation
   - HTTP-only cookies

3. **Data Protection**
   - Row-level security
   - Audit logging
   - Regular backups
   - GDPR compliance ready

## Future Enhancements

### Short-term (3-6 months)

- Visual drag-and-drop editor
- Block library (save/reuse sections)
- Image optimization pipeline
- Version history

### Medium-term (6-12 months)

- Multi-user collaboration
- Real-time preview
- A/B testing
- Analytics integration
- SEO optimization tools

### Long-term (12+ months)

- AI content suggestions
- Template marketplace
- White-label for other agencies
- Advanced workflows
- Headless commerce integration

## Development Roadmap

### Week 1: Foundation

- [ ] API setup (NestJS + Prisma)
- [ ] Database schema
- [ ] Sites CRUD
- [ ] Basic Builder UI

### Week 2: Pages & Content

- [ ] Pages CRUD API
- [ ] Block editor foundation
- [ ] Preview system

### Week 3: Block Editors

- [ ] All block type editors
- [ ] Config management
- [ ] Image upload

### Week 4: Integration & Deploy

- [ ] Connect client to API
- [ ] Polish UX
- [ ] Deploy to production
- [ ] First customer live

## Success Metrics

### Week 4 Goals

- ✅ Can create a new site in < 5 minutes
- ✅ Can build a homepage in < 30 minutes
- ✅ Customer can edit content without breaking design
- ✅ Changes reflect on live site within 1 minute
- ✅ Zero downtime deployments

### Month 3 Goals

- 5+ customer sites live
- Builder is stable and fast
- Documentation complete
- Automated tests in place

## Support & Maintenance

### Monitoring

- API uptime monitoring
- Error tracking (Sentry)
- Performance monitoring
- Database health checks

### Backup Strategy

- Daily database backups
- 30-day retention
- Point-in-time recovery available
- Test restores monthly

## Questions to Resolve

1. Image storage: Database vs S3/R2?
2. Email for notifications: SendGrid/Resend?
3. Domain management: Manual vs automatic?
4. SSL certificates: Let's Encrypt manual or Vercel automatic?
5. Analytics: Self-hosted or Google Analytics?

## Next Steps

1. Read API documentation: `docs/api/`
2. Read Builder documentation: `docs/builder/`
3. Set up development environment
4. Start building!
