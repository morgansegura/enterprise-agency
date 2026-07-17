import { draftMode } from "next/headers";
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

  const path = searchParams.get("path") || "/";
  // Only allow internal paths (no open redirect).
  const safePath = path.startsWith("/") ? path : "/";
  const res = NextResponse.redirect(new URL(safePath, req.url));

  // Persist the CMS origin (fall back to the request's referer origin) so the
  // live-preview iframe can address messages back to the admin window. Set on
  // the redirect response directly so it can't be dropped by the cookies() API.
  const origin =
    safeOrigin(searchParams.get("origin")) ||
    safeOrigin(req.headers.get("referer"));
  if (origin) {
    res.cookies.set(CMS_ORIGIN_COOKIE, origin, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });
  }

  return res;
}
