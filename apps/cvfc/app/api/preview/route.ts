import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const PREVIEW_SECRET = process.env.PREVIEW_SECRET || "preview-dev";

/**
 * Enables Next draft mode for the CMS editor preview, then redirects to the
 * requested path. The CMS links here with `?secret=…&path=…`; the secret gates
 * access so the public can't force draft rendering.
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
  return NextResponse.redirect(new URL(safePath, req.url));
}
