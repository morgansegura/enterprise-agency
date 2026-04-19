"use client";

import * as React from "react";
import "./builder-interactive-shell.css";

type Kind = "section" | "container" | "block" | "box";

interface BuilderInteractiveShellProps {
  blockKey: string;
  label: string;
  elementType: Kind;
  children: React.ReactNode;
  /** Optional chip rendered absolutely-positioned inside the shell. */
  chip?: React.ReactNode;
}

/**
 * Wraps a user-styled element (section / container / box) with an outer
 * shell that the builder uses for hover/selection overlays (outline,
 * label chip, "+" FAB).
 *
 * Why a separate wrapper? User-authored CSS — including `::after` gradient
 * overlays, `z-index` scopes, and `position: absolute` children — is
 * applied to the inner element. If the builder tried to draw its overlay
 * on the SAME element, the two styling systems would collide. The shell
 * is a builder-only concern: `display: contents` would not give us an
 * anchor for the chip, so we use a block-level wrapper that inherits
 * size from its child.
 */
export function BuilderInteractiveShell({
  blockKey,
  label,
  elementType,
  children,
  chip,
}: BuilderInteractiveShellProps) {
  return (
    <div
      className="builder-interactive-shell"
      data-block-key={blockKey}
      data-block-label={label}
      data-element-type={elementType}
    >
      {chip}
      {children}
    </div>
  );
}
