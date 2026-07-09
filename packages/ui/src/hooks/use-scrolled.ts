"use client";

import * as React from "react";

/**
 * `true` once the page is scrolled past `threshold` px. Headless — a header
 * styles a transparent-over-hero → solid-on-scroll state off it (`data-scrolled`).
 */
export function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
