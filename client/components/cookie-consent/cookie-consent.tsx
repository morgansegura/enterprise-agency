"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import "./cookie-consent.css";

const COOKIE_CONSENT_KEY = "cookie-consent";

interface WindowWithGtag extends Window {
  gtag?: (
    command: string,
    action: string,
    params: { analytics_storage: string },
  ) => void;
}

/**
 * Cookie Consent Banner
 * Simple agree/disagree model
 *
 * Enterprise practices:
 * - Stores consent in localStorage
 * - Only shows once
 * - Minimal design
 * - Accessibility compliant
 */
export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(() => {
    // Check if user has already made a choice during initial render
    if (typeof window !== "undefined") {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      return !consent;
    }
    return false;
  });

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
    // Optional: Track acceptance
    if (
      typeof window !== "undefined" &&
      (window as WindowWithGtag).gtag !== undefined
    ) {
      (window as WindowWithGtag).gtag?.("consent", "update", {
        analytics_storage: "granted",
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setIsVisible(false);
    // Optional: Track decline
    if (
      typeof window !== "undefined" &&
      (window as WindowWithGtag).gtag !== undefined
    ) {
      (window as WindowWithGtag).gtag?.("consent", "update", {
        analytics_storage: "denied",
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="cookie-consent"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="cookie-consent-content">
        <div className="cookie-consent-text">
          <h3 id="cookie-consent-title" className="cookie-consent-title">
            We use cookies
          </h3>
          <p
            id="cookie-consent-description"
            className="cookie-consent-description"
          >
            We use cookies to improve your browsing experience, analyze site
            traffic, and personalize content. By clicking &ldquo;Accept&rdquo;,
            you consent to our use of cookies.{" "}
            <Link href="/cookie-policy" className="cookie-consent-link">
              Learn more
            </Link>
          </p>
        </div>
        <div className="cookie-consent-actions">
          <Button
            variant="outline"
            onClick={handleDecline}
            className="cookie-consent-button"
          >
            Decline
          </Button>
          <Button onClick={handleAccept} className="cookie-consent-button">
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
