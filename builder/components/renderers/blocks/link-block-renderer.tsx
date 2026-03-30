"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";

/**
 * LinkBlockRenderer — wraps content in a clickable link
 *
 * In edit mode: shows as a bordered container with link URL indicator
 * In view mode: renders as an <a> tag wrapping children
 */
export function LinkBlockRenderer({
  block,
  isEditing,
  onChange,
}: BlockRendererProps) {
  const data = block.data as Record<string, unknown>;
  const href = (data.href as string) || "#";
  const target = (data.target as string) || "_self";

  if (isEditing) {
    return (
      <div
        data-link-block
        style={{
          border: "1px dashed var(--accent-primary)",
          borderRadius: "3px",
          padding: "4px",
          position: "relative",
          minHeight: "40px",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "-10px",
            left: "8px",
            background: "var(--el-0)",
            padding: "0 4px",
            fontSize: "10px",
            color: "var(--accent-primary)",
            fontWeight: 600,
          }}
        >
          Link → {href === "#" ? "(set URL)" : href}
        </span>
        {/* Children would render here in a nested block system */}
        <div style={{ padding: "8px", textAlign: "center", color: "var(--el-400)", fontSize: "12px" }}>
          Drop blocks here to wrap in a link
        </div>
      </div>
    );
  }

  return (
    <a href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined}>
      {/* Children render here */}
    </a>
  );
}
