import { redirect } from "next/navigation";

/**
 * Root Landing Page
 *
 * For multi-tenant architecture, redirects to the default tenant
 * or shows a tenant selection page.
 *
 * URL structure:
 * - / (this page) → redirects to default tenant
 * - /{tenantSlug} → tenant home page
 * - /{tenantSlug}/{pageSlug} → tenant page
 */
export default function Home() {
  // Redirect to default tenant from env, or show error
  const defaultTenant = process.env.NEXT_PUBLIC_TENANT_SLUG;

  if (defaultTenant) {
    redirect(`/${defaultTenant}`);
  }

  // No default tenant configured - show info page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Multi-Tenant Client
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Access a tenant site using the URL pattern:
        </p>
        <code className="block bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-sm font-mono text-gray-800 dark:text-gray-200">
          /{"{tenant-slug}"}/{"{page-slug}"}
        </code>
        <p className="text-gray-500 dark:text-gray-500 mt-6 text-sm">
          Example: /mh-bible-baptist/about
        </p>
      </div>
    </div>
  );
}
