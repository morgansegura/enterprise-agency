"use client";

import * as React from "react";

type Options = {
  /** Min scroll delta (px) before toggling. */
  threshold?: number;
  /** Always-visible zone from the top (px). */
  topGuard?: number;
};

/**
 * Hide-on-scroll-down / show-on-scroll-up header state. Headless — the site
 * styles a header off the returned `visible` (e.g. `data-visible`). Shared so
 * every site's header gets the same behavior for free.
 */
export function useHeaderVisibility({
  threshold = 8,
  topGuard = 64,
}: Options = {}) {
  const [visible, setVisible] = React.useState(true);
  const lastY = React.useRef(0);
  const ticking = React.useRef(false);

  React.useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;

        if (y < topGuard) {
          setVisible(true);
        } else if (Math.abs(delta) >= threshold) {
          setVisible(delta < 0);
        }

        lastY.current = y;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, topGuard]);

  return visible;
}
