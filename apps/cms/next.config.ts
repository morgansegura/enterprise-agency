import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  // Headless CMS — no homepage. Send the bare root to the admin.
  async redirects() {
    return [{ source: '/', destination: '/admin', permanent: false }]
  },
  experimental: {
    // Image uploads go through a server action; default limit is 1MB.
    serverActions: {
      bodySizeLimit: '15mb',
    },
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    // Workspace root — deps (incl. next) are hoisted to the repo-root
    // node_modules, so Turbopack's root must include it, not just apps/cms.
    root: path.resolve(dirname, '..', '..'),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
