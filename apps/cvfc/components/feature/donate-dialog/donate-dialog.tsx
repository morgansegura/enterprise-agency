"use client";

import * as React from "react";

import { Modal, ModalClose, ModalContent } from "@/components/ui";
import { trackEvent } from "@/lib/analytics";
import { ZEFFY_FORM_URL, donationsEnabled } from "@/lib/donate";
import { cn } from "@/lib/utils";

import "./donate-dialog.css";

const FALLBACK_HEIGHT = 700;
const MIN_HEIGHT = 420;
const MAX_HEIGHT = 920;

function isZeffyOrigin(origin: string): boolean {
  if (!origin) return false;
  try {
    const host = new URL(origin).hostname;
    return host === "zeffy.com" || host.endsWith(".zeffy.com");
  } catch {
    return false;
  }
}

/** Zeffy posts its content height in a few different shapes. */
function extractHeight(data: unknown): number | null {
  if (typeof data === "number") return data;
  if (typeof data === "string") {
    const m = data.match(/(\d{2,5})/);
    return m ? Number(m[1]) : null;
  }
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (typeof obj.height === "number") return obj.height;
    if (typeof obj.iframeHeight === "number") return obj.iframeHeight;
    const payload = obj.payload as Record<string, unknown> | undefined;
    if (payload && typeof payload.height === "number") return payload.height;
  }
  return null;
}

type DonateDialogProps = {
  /** Trigger element — a single element, e.g. a styled button or link. */
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  /** Where the click came from; lands on the `donate_open` event. */
  source?: string;
  formUrl?: string;
  className?: string;
};

/**
 * Wraps a trigger so clicking it opens the Zeffy form in a modal — the donor
 * never leaves the site. Listens for Zeffy's postMessage resize so the popup
 * tracks the form's real height.
 *
 * With no form URL configured the trigger is returned untouched, so a "Donate"
 * link keeps working as an ordinary link until Zeffy is wired up.
 */
export function DonateDialog({
  children,
  source = "modal",
  formUrl = ZEFFY_FORM_URL,
  className,
}: DonateDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [measuredHeight, setMeasuredHeight] = React.useState<number | null>(
    null,
  );

  React.useEffect(() => {
    if (!open) return;
    const handler = (event: MessageEvent) => {
      if (!isZeffyOrigin(event.origin)) return;
      const height = extractHeight(event.data);
      if (height && height >= MIN_HEIGHT && height <= MAX_HEIGHT) {
        setMeasuredHeight(height);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [open]);

  const handleOpenChange = (next: boolean) => {
    if (!next) setMeasuredHeight(null);
    setOpen(next);
  };

  const trigger = React.cloneElement(children, {
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      children.props.onClick?.(event);
      if (event.defaultPrevented) return;
      // The trigger is usually a link to /support — take over the click.
      event.preventDefault();
      trackEvent("donate_open", {
        donate_source: source,
        page_path: window.location.pathname,
      });
      setOpen(true);
    },
  });

  if (!donationsEnabled || !formUrl) return children;

  return (
    <>
      {trigger}
      <Modal open={open} onOpenChange={handleOpenChange}>
        <ModalContent
          title="Donate to Chula Vista FC"
          description="Make a one-time or monthly gift to Chula Vista FC."
          size="md"
          className={cn("donate-dialog", className)}
          style={{
            height: `min(90vh, ${measuredHeight ?? FALLBACK_HEIGHT}px)`,
          }}
        >
          <ModalClose
            className="donate-dialog-close"
            aria-label="Close donation form"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="donate-dialog-close-icon"
              aria-hidden="true"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </ModalClose>
          <iframe
            src={formUrl}
            title="Donate to Chula Vista FC"
            className="donate-dialog-frame"
            allow="payment *"
          />
        </ModalContent>
      </Modal>
    </>
  );
}
