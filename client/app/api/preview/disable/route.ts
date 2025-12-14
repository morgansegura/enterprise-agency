import { draftMode, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

/**
 * Disable Preview API Route
 *
 * Disables Next.js Draft Mode and clears preview context.
 *
 * GET /api/preview/disable?returnUrl=/path
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const returnUrl = searchParams.get("returnUrl") || "/";

  // Disable Draft Mode
  const draft = await draftMode();
  draft.disable();

  // Clear preview context cookie
  const cookieStore = await cookies();
  cookieStore.delete("preview_context");

  // Redirect to return URL
  redirect(returnUrl);
}
