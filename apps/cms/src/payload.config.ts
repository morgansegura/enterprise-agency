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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Pages, Products, Posts, Staff, Tenants, SiteSettings, Menus, Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      ssl: { rejectUnauthorized: false },
    },
  }),
  sharp,
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
        siteSettings: { isGlobal: true },
        menus: {},
        forms: {},
      },
      // Single agency admin manages all client tenants (super-admin).
      userHasAccessToAllTenants: () => true,
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
            collections: { media: true },
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
