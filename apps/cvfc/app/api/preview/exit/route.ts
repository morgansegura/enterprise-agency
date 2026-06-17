import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

/** Leaves draft-mode preview and returns to the (published) path. */
export async function GET(req: NextRequest) {
  (await draftMode()).disable();
  const path = req.nextUrl.searchParams.get("path") || "/";
  const safePath = path.startsWith("/") ? path : "/";
  return NextResponse.redirect(new URL(safePath, req.url));
}
