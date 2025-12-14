import { draftMode } from "next/headers";
import Link from "next/link";
import "./preview-banner.css";

/**
 * Preview Banner
 *
 * Displays a fixed banner at the bottom of the page when Draft Mode is enabled.
 * Shows the user they are viewing unpublished content and provides an exit link.
 *
 * This is a Server Component that checks draftMode status.
 */
export async function PreviewBanner() {
  const { isEnabled } = await draftMode();

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="preview-banner" role="alert" aria-live="polite">
      <div className="preview-banner-content">
        <span className="preview-badge">Preview Mode</span>
        <p className="preview-text">
          You are viewing unpublished content. Changes may not be saved.
        </p>
        <Link
          href="/api/preview/disable"
          className="preview-exit-link"
          prefetch={false}
        >
          Exit Preview
        </Link>
      </div>
    </div>
  );
}
