import { notFound } from "next/navigation";

import { LiveBlocks } from "@/components/blocks/live-blocks";
import { getPageDraft } from "@/lib/cms";

// Always render fresh — this is the editor's Live Preview surface, never cached.
export const dynamic = "force-dynamic";

const PREVIEW_SECRET = process.env.PREVIEW_SECRET || "preview-dev";

/**
 * Cookie-free Live Preview. The admin (Render) and FE (Vercel) are different
 * sites, so the browser blocks the draft-mode cookie inside the preview iframe.
 * Instead the CMS links here with `?secret=…&path=…&origin=…` — the secret gates
 * access, `path` picks the page, and `origin` tells useLivePreview which window
 * to talk to. No cookies involved, so it works in every browser.
 */
export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const secret = typeof sp.secret === "string" ? sp.secret : "";
  if (secret !== PREVIEW_SECRET) notFound();

  const path = typeof sp.path === "string" ? sp.path : "/";
  const origin = typeof sp.origin === "string" ? sp.origin : undefined;
  const slug = path === "/" || path === "" ? "home" : path.replace(/^\/+/, "");

  const page = await getPageDraft(slug);
  if (!page) notFound();

  return <LiveBlocks initialData={page} serverURL={origin} />;
}
