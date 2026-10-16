// `cn` now lives in the shared @wf/ui library; re-export so existing
// `@/lib/utils` imports across the site keep working unchanged.
export { cn } from "@wf/ui";

/** True for a full link to another site, which should open in a new tab. */
export function isExternalHref(href: string): boolean {
  try {
    const { protocol, hostname } = new URL(href);
    return (
      /^https?:$/.test(protocol) &&
      hostname.replace(/^www\./, "") !== "chulavistafc.com"
    );
  } catch {
    return false;
  }
}
