import { cookies, draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { CMS_ORIGIN_COOKIE } from "@/lib/preview";

const PREVIEW_SECRET = process.env.PREVIEW_SECRET || "preview-dev";

/** Accept only a bare `scheme://host[:port]` origin (no path), else ignore it. */
function safeOrigin(value: string | null): string | null {
  if (!value) return null;
  try {
    const u = new URL(value);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.origin;
  } catch {
    return null;
  }
}

/**
 * Enables Next draft mode for the CMS editor preview, then redirects to the
 * requested path. The CMS links here with `?secret=…&path=…&origin=…`; the
 * secret gates access, and the CMS origin is stored so Live Preview's
 * postMessage handshake targets the right window.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  if (searchParams.get("secret") !== PREVIEW_SECRET) {
    return new NextResponse("Invalid preview token", { status: 401 });
  }

  (await draftMode()).enable();
  // Read the token draftMode() just generated so we can re-issue the cookie
  // ourselves — see below.
  const bypass = (await cookies()).get("__prerender_bypass")?.value;

  const path = searchParams.get("path") || "/";
  // Only allow internal paths (no open redirect).
  const safePath = path.startsWith("/") ? path : "/";
  const res = NextResponse.redirect(new URL(safePath, req.url));

  // draftMode().enable() writes `__prerender_bypass` via the cookie store — which
  // (a) may not attach to a manually-returned redirect and (b) defaults to
  // SameSite=Lax, which browsers DROP inside the cross-site admin↔FE preview
  // iframe (admin on one domain, FE on another). Without it, draft mode never
  // turns on in the iframe, so Live Preview never mounts. Re-issue it on THIS
  // response as SameSite=None; Secure so draft mode both attaches and survives.
  if (bypass) {
    res.cookies.set("__prerender_bypass", bypass, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      partitioned: true,
      path: "/",
    });
  }

  // Persist the CMS origin (fall back to the request's referer origin) so the
  // live-preview iframe can address messages back to the admin window. Same
  // SameSite=None so it survives the cross-site iframe too.
  const origin =
    safeOrigin(searchParams.get("origin")) ||
    safeOrigin(req.headers.get("referer"));
  if (origin) {
    res.cookies.set(CMS_ORIGIN_COOKIE, origin, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      partitioned: true,
      path: "/",
    });
  }

  return res;
}
