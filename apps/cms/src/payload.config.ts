import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Tenants } from './collections/Tenants'
import { SiteSettings } from './collections/SiteSettings'
import { Menus } from './collections/Menus'
import { Products } from './collections/Products'
import { Posts } from './collections/Posts'
import { Staff } from './collections/Staff'
import { Testimonials } from './collections/Testimonials'
import { Facilities } from './collections/Facilities'
import { isSuperAdmin, superAdminFieldAccess, SUPER_ADMIN_EMAILS } from './access/roles'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Auth-cookie allowlist (cors + csrf). The CMS admin's own origin must be here
// or the admin can't save; the FE origins are needed for Live Preview.
const allowedOrigins = [
  'http://localhost:4010', // CMS admin (local)
  'http://localhost:4011', // FE (local)
  'https://webandfunnel.onrender.com', // CMS admin (prod)
  process.env.FRONTEND_URL, // FE (prod)
  process.env.CMS_URL, // CMS (prod override, if set)
].filter(Boolean) as string[]

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      graphics: {
        Logo: '@/components/graphics/logo#Logo',
        Icon: '@/components/graphics/icon#Icon',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Pages,
    Products,
    Posts,
    Staff,
    Testimonials,
    Facilities,
    Tenants,
    SiteSettings,
    Menus,
    Users,
    Media,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  // Origins allowed to use the auth cookie. MUST include the CMS admin's own
  // origin (else the admin can't save — CSRF rejects its own requests) AND the
  // front-end origins (for Live Preview's populate fetch). Add each tenant's prod
  // FE domain as sites launch.
  cors: allowedOrigins,
  csrf: allowedOrigins,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    // Schema is MIGRATION-managed (never auto-pushed) so a code deploy can't
    // half-change the shared multi-tenant DB and take every client down. Change
    // a field → `bun run payload migrate:create <name>` → commit the migration;
    // the Render deploy runs `payload migrate` before serving (atomic).
    push: false,
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      ssl: { rejectUnauthorized: false },
    },
  }),
  sharp,
  // Jobs queue — powers scheduled publish/unpublish (drafts.schedulePublish).
  // autoRun only on the live server (a single persistent instance); local dev
  // shares the same DB, so gating to production avoids two runners racing.
  jobs: {
    autoRun: [{ cron: '* * * * *', allQueues: true }],
    shouldAutoRun: async () => process.env.NODE_ENV === 'production',
  },
  plugins: [
    // Form builder runs first so its `forms` collection exists for multi-tenant
    // to scope below.
    formBuilderPlugin({
      fields: {
        text: true,
        textarea: true,
        email: true,
        select: true,
        checkbox: true,
        number: true,
        message: true,
      },
    }),
    multiTenantPlugin({
      collections: {
        pages: {},
        products: {},
        posts: {},
        staff: {},
        testimonials: {},
        facilities: {},
        siteSettings: { isGlobal: true },
        menus: {},
        forms: {},
      },
      // Super-admins (SUPER_ADMIN_EMAILS) see every tenant; everyone else is
      // scoped to their assigned tenant(s). SAFETY: until SUPER_ADMIN_EMAILS is
      // set, keep open access so a deploy can't lock the admin out — isolation
      // switches on the moment the env var is configured.
      userHasAccessToAllTenants: (user) =>
        SUPER_ADMIN_EMAILS.length === 0 ? true : isSuperAdmin(user),
      // Only a super-admin may assign/change a user's tenants (no self-escalation).
      tenantsArrayField: {
        includeDefaultField: true,
        arrayFieldAccess: {
          create: superAdminFieldAccess,
          update: superAdminFieldAccess,
        },
        tenantFieldAccess: {
          create: superAdminFieldAccess,
          update: superAdminFieldAccess,
        },
      },
      // Show the tenant field in the admin while we build.
      debug: true,
    }),
    // Cloudflare R2 (S3-compatible) for media storage in production. Activates
    // only when R2_BUCKET is set — dev with no env vars stays on local disk.
    // Env: R2_BUCKET, R2_ENDPOINT (https://<account>.r2.cloudflarestorage.com),
    // R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.
    ...(process.env.R2_BUCKET
      ? [
          s3Storage({
            collections: {
              media: {
                // Serve straight from the R2 public (CDN) URL instead of
                // proxying bytes through the CMS.
                disablePayloadAccessControl: true,
                generateFileURL: ({ filename, prefix }) =>
                  `${process.env.R2_PUBLIC_URL}/${prefix ? `${prefix}/` : ''}${filename}`,
              },
            },
            bucket: process.env.R2_BUCKET,
            config: {
              endpoint: process.env.R2_ENDPOINT,
              region: 'auto',
              credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
              },
              forcePathStyle: true,
            },
          }),
        ]
      : []),
  ],
})
