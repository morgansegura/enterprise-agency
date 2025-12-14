import { draftMode, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

const API_URL = process.env.API_URL || "http://localhost:3001/api/v1";

interface ValidatedToken {
  contentType: "page" | "post";
  contentId: string;
  tenantSlug: string;
  contentSlug: string;
}

/**
 * Preview API Route
 *
 * Enables Next.js Draft Mode for previewing unpublished content.
 * Called with a preview token from the builder app.
 *
 * GET /api/preview?token=xxx
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Missing preview token" },
      { status: 400 },
    );
  }

  try {
    // Validate token with API
    const response = await fetch(`${API_URL}/preview/validate?token=${token}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Invalid or expired preview token" },
        { status: 401 },
      );
    }

    const data = await response.json();

    // Check if token validation failed
    if ("valid" in data && data.valid === false) {
      return NextResponse.json(
        { error: data.message || "Invalid preview token" },
        { status: 401 },
      );
    }

    const validated = data as ValidatedToken;

    // Enable Draft Mode
    const draft = await draftMode();
    draft.enable();

    // Store preview context in a cookie for the session
    const cookieStore = await cookies();
    cookieStore.set(
      "preview_context",
      JSON.stringify({
        contentType: validated.contentType,
        contentId: validated.contentId,
        tenantSlug: validated.tenantSlug,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
      },
    );

    // Build redirect URL based on content type
    const redirectUrl = buildRedirectUrl(validated);

    // Redirect to the content
    redirect(redirectUrl);
  } catch (error) {
    logger.error("Failed to enable preview mode", error, {
      context: "PreviewRoute",
    });
    return NextResponse.json(
      { error: "Failed to enable preview mode" },
      { status: 500 },
    );
  }
}

function buildRedirectUrl(validated: ValidatedToken): string {
  const { tenantSlug, contentType, contentSlug } = validated;

  switch (contentType) {
    case "page":
      // For home page, redirect to root
      if (contentSlug === "home") {
        return `/${tenantSlug}`;
      }
      return `/${tenantSlug}/${contentSlug}`;
    case "post":
      return `/${tenantSlug}/blog/${contentSlug}`;
    default:
      return `/${tenantSlug}`;
  }
}
