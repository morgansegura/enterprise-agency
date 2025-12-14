import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

/**
 * Revalidation API Route
 *
 * Called by the API server when content is published/unpublished
 * to invalidate the Next.js cache for specific paths or tags.
 *
 * POST /api/revalidate
 * Headers: x-revalidate-secret: <secret>
 * Body: { path?: string, tag?: string }
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");

  // Validate secret
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: "Invalid revalidation secret" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const { path, tag } = body;

    if (path) {
      revalidatePath(path);
      logger.info(`Revalidated path: ${path}`, { context: "Revalidation" });
      return NextResponse.json({
        revalidated: true,
        type: "path",
        value: path,
        timestamp: new Date().toISOString(),
      });
    }

    if (tag) {
      // In Next.js 16, use revalidatePath with tag option
      // Tags are typically used with fetch cache tags, so we revalidate by path pattern
      revalidatePath("/", "layout");
      logger.info(`Revalidated layout for tag: ${tag}`, {
        context: "Revalidation",
      });
      return NextResponse.json({
        revalidated: true,
        type: "tag",
        value: tag,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: "Must provide path or tag to revalidate" },
      { status: 400 },
    );
  } catch (error) {
    logger.error("Failed to revalidate", error, { context: "Revalidation" });
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 },
    );
  }
}
