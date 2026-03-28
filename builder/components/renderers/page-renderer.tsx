"use client";

import type { Page, Section } from "@/lib/hooks/use-pages";
import { SectionRenderer } from "./section-renderer";

// Import to register all renderers
import "@/lib/renderer/implemented-renderers";

interface PageRendererProps {
  page: Page;
  breakpoint?: "desktop" | "tablet" | "mobile";
  onBlockChange?: (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
    updatedBlock: unknown,
  ) => void;
  isEditing?: boolean;
}

/**
 * PageRenderer - Renders a complete page with all its sections
 *
 * This is the main entry point for rendering published pages.
 * It handles:
 * - Section-level layout
 * - Block rendering delegation
 * - Responsive breakpoint handling
 */
export function PageRenderer({
  page,
  breakpoint = "desktop",
  onBlockChange,
  isEditing,
}: PageRendererProps) {
  // Get sections from page data (supports both flat and nested structure)
  const sections: Section[] = page.sections || page.content?.sections || [];

  if (sections.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-[var(--el-500)]">
        <p>This page has no content yet.</p>
      </div>
    );
  }

  return (
    <div className="page-content flex-1">
      {sections.map((section, sectionIndex) => (
        <SectionRenderer
          key={section._key}
          section={section}
          sectionIndex={sectionIndex}
          breakpoint={breakpoint}
          onBlockChange={onBlockChange}
          isEditing={isEditing}
        />
      ))}
    </div>
  );
}

/**
 * PageRendererSkeleton - Loading skeleton for page content
 */
export function PageRendererSkeleton() {
  return (
    <div className="animate-pulse space-y-8 p-8">
      <div className="h-8 bg-[var(--el-100)] rounded w-1/3" />
      <div className="space-y-4">
        <div className="h-4 bg-[var(--el-100)] rounded w-full" />
        <div className="h-4 bg-[var(--el-100)] rounded w-5/6" />
        <div className="h-4 bg-[var(--el-100)] rounded w-4/6" />
      </div>
      <div className="h-48 bg-[var(--el-100)] rounded" />
      <div className="space-y-4">
        <div className="h-4 bg-[var(--el-100)] rounded w-full" />
        <div className="h-4 bg-[var(--el-100)] rounded w-3/4" />
      </div>
    </div>
  );
}
