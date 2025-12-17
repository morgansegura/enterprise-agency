"use client";

import * as React from "react";
import { Settings2, ArrowRightLeft, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useHeader,
  useDefaultHeader,
  useUpdateHeader,
  useDuplicateHeader,
  type Header,
  type HeaderStyle,
} from "@/lib/hooks/use-headers";
import { HeaderSettingsPopover } from "./header-settings-popover";
import { HeaderLibraryPicker } from "./header-library-picker";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import "./editable-header.css";

// =============================================================================
// Style Conversion Helpers
// =============================================================================

/**
 * Convert background name to CSS color
 */
function getBackgroundColor(bg?: string): string | undefined {
  if (!bg || bg === "none") return undefined;

  const bgMap: Record<string, string> = {
    white: "#ffffff",
    gray: "#f4f4f5",
    dark: "#18181b",
    primary: "var(--primary)",
    secondary: "var(--secondary)",
  };
  return bgMap[bg] || bg;
}

/**
 * Convert height name to CSS height
 */
function getHeaderHeight(height?: string | number): string {
  if (typeof height === "number") return `${height}px`;

  const heightMap: Record<string, string> = {
    sm: "48px",
    md: "64px",
    lg: "80px",
    xl: "96px",
  };
  return heightMap[height || "md"] || "64px";
}

/**
 * Convert shadow name to CSS box-shadow
 */
function getBoxShadow(shadow?: string): string | undefined {
  if (!shadow || shadow === "none") return undefined;

  const shadowMap: Record<string, string> = {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  };
  return shadowMap[shadow] || undefined;
}

/**
 * Convert border name to CSS border
 */
function getBorderBottom(border?: string): string | undefined {
  if (!border || border === "none") return undefined;

  const borderMap: Record<string, string> = {
    light: "1px solid #e4e4e7",
    medium: "1px solid #a1a1aa",
    dark: "1px solid #52525b",
  };
  return borderMap[border] || border;
}

/**
 * Convert radius name to CSS border-radius
 */
function getBorderRadius(radius?: string): string | undefined {
  if (!radius || radius === "none") return undefined;

  const radiusMap: Record<string, string> = {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    full: "9999px",
  };
  return radiusMap[radius] || undefined;
}

/**
 * Convert spacing name to CSS value
 */
function getSpacing(spacing?: string): string | undefined {
  if (!spacing || spacing === "none") return undefined;

  const spacingMap: Record<string, string> = {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  };
  return spacingMap[spacing] || undefined;
}

/**
 * Get text color based on background
 */
function getTextColor(bg?: string, textColor?: string): string | undefined {
  if (textColor) return textColor;

  // Light text on dark backgrounds
  if (bg === "dark" || bg === "primary") {
    return "#ffffff";
  }
  return undefined;
}

interface EditableHeaderProps {
  tenantId: string;
  headerId?: string | null;
  onHeaderChange?: (headerId: string | null) => void;
}

/**
 * Editable Header Component
 *
 * Wraps a header for in-page editing with section-like behavior:
 * - Controls appear on hover (settings, clone, change)
 * - Border appears on hover
 * - No lock/unlock - always editable
 */
export function EditableHeader({
  tenantId,
  headerId,
  onHeaderChange,
}: EditableHeaderProps) {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [libraryOpen, setLibraryOpen] = React.useState(false);

  // Fetch header data
  const { data: specificHeader } = useHeader(
    tenantId,
    headerId && headerId !== "default" ? headerId : "",
  );
  const { data: defaultHeader } = useDefaultHeader(tenantId);

  const header: Header | null | undefined =
    headerId === "default" || !headerId
      ? defaultHeader
      : specificHeader || defaultHeader;

  const updateHeader = useUpdateHeader(tenantId);
  const duplicateHeader = useDuplicateHeader(tenantId);

  // Handle style changes (saves globally)
  const handleStyleChange = (style: Partial<HeaderStyle>) => {
    if (!header) return;

    updateHeader.mutate(
      {
        id: header.id,
        data: {
          style: { ...header.style, ...style },
        },
      },
      {
        onSuccess: () => {
          toast.success("Header updated");
        },
      },
    );
  };

  // Handle header property changes
  const handleHeaderChange = (field: string, value: unknown) => {
    if (!header) return;

    updateHeader.mutate({
      id: header.id,
      data: { [field]: value },
    });
  };

  // Clone header and switch to the clone
  const handleClone = () => {
    if (!header) return;

    duplicateHeader.mutate(
      { id: header.id, name: `${header.name} (Copy)` },
      {
        onSuccess: (newHeader) => {
          toast.success("Header cloned");
          onHeaderChange?.(newHeader.id);
        },
      },
    );
  };

  // Handle header selection from library
  const handleSelectHeader = (selectedHeaderId: string | null) => {
    onHeaderChange?.(selectedHeaderId);
    setLibraryOpen(false);
  };

  // No header state
  if (!header) {
    return (
      <div className="editable-header editable-header-empty">
        <div className="editable-header-empty-content">
          <p>No header assigned</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLibraryOpen(true)}
          >
            <ArrowRightLeft className="h-4 w-4" />
            Choose Header
          </Button>
        </div>
        <HeaderLibraryPicker
          tenantId={tenantId}
          currentHeaderId={null}
          open={libraryOpen}
          onOpenChange={setLibraryOpen}
          onSelect={handleSelectHeader}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "editable-header",
        settingsOpen && "is-settings-open",
        libraryOpen && "is-popover-open",
      )}
    >
      {/* Header Visual - with border on hover */}
      <div className="editable-header-visual">
        {/* Header Content */}
        <HeaderContent header={header} tenantId={tenantId} />

        {/* Settings Handle - Right side (like section-actions-handle) */}
        <HeaderSettingsPopover
          header={header}
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          onStyleChange={handleStyleChange}
          onHeaderChange={handleHeaderChange}
        >
          <button
            className="header-settings-handle"
            aria-label="Header settings"
          >
            <Settings2 className="h-4 w-4" />
          </button>
        </HeaderSettingsPopover>

        {/* Actions row - shows on hover */}
        <div className="header-actions-row">
          {/* Clone */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleClone}
            className="header-action-btn"
            disabled={duplicateHeader.isPending}
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Clone</span>
          </Button>

          {/* Change header */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLibraryOpen(true)}
            className="header-action-btn"
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            <span>Change</span>
          </Button>
        </div>

        {/* Header name badge */}
        <div className="header-name-badge">{header.name}</div>
      </div>

      {/* Library picker modal */}
      <HeaderLibraryPicker
        tenantId={tenantId}
        currentHeaderId={header.id}
        open={libraryOpen}
        onOpenChange={setLibraryOpen}
        onSelect={handleSelectHeader}
      />
    </div>
  );
}

/**
 * Header Content - renders the actual header
 *
 * Follows Wrapper → Container pattern:
 * - Wrapper (header bar): full-width, background, height, shadow, border, blur
 * - Container: max-width, padding, background, radius, shadow, border, margin
 */
function HeaderContent({
  header,
  tenantId,
}: {
  header: Header;
  tenantId: string;
}) {
  const behaviorClass = `header-${header.behavior.toLowerCase()}`;
  const style = header.style || {};

  // Wrapper (bar) styles
  const wrapperStyles: React.CSSProperties = {
    backgroundColor: getBackgroundColor(style.backgroundColor),
    color: getTextColor(style.backgroundColor, style.textColor),
    borderBottom: getBorderBottom(style.borderBottom),
    boxShadow: getBoxShadow(style.boxShadow),
    minHeight: getHeaderHeight(style.height),
  };

  // Add blur effect if enabled
  if (style.blur) {
    wrapperStyles.backdropFilter = "blur(8px)";
    wrapperStyles.WebkitBackdropFilter = "blur(8px)";
    // Make background slightly transparent for blur effect
    if (wrapperStyles.backgroundColor === "#ffffff") {
      wrapperStyles.backgroundColor = "rgba(255, 255, 255, 0.8)";
    } else if (wrapperStyles.backgroundColor === "#18181b") {
      wrapperStyles.backgroundColor = "rgba(24, 24, 27, 0.8)";
    }
  }

  // Container styles
  const containerStyles: React.CSSProperties = {
    backgroundColor: getBackgroundColor(style.containerBackground),
    borderRadius: getBorderRadius(style.containerBorderRadius),
    boxShadow: getBoxShadow(style.containerShadow),
    border:
      style.containerBorder && style.containerBorder !== "none"
        ? getBorderBottom(style.containerBorder)
        : undefined,
    paddingLeft: getSpacing(style.containerPaddingX) || "1rem",
    paddingRight: getSpacing(style.containerPaddingX) || "1rem",
    marginTop: getSpacing(style.containerMarginY),
    marginBottom: getSpacing(style.containerMarginY),
    marginLeft: getSpacing(style.containerMarginX) || "auto",
    marginRight: getSpacing(style.containerMarginX) || "auto",
  };

  return (
    <header
      className={cn("editable-header-content", behaviorClass)}
      style={wrapperStyles}
    >
      <div
        className={cn(
          "editable-header-container",
          `header-width-${style.containerWidth || "container"}`,
        )}
        style={containerStyles}
      >
        <HeaderZone
          zone={header.zones?.left}
          position="left"
          tenantId={tenantId}
        />
        <HeaderZone
          zone={header.zones?.center}
          position="center"
          tenantId={tenantId}
        />
        <HeaderZone
          zone={header.zones?.right}
          position="right"
          tenantId={tenantId}
        />
      </div>
    </header>
  );
}

/**
 * Header Zone - renders a single zone
 */
function HeaderZone({
  zone,
  position,
  tenantId: _tenantId,
}: {
  zone?: import("@/lib/hooks/use-headers").HeaderZone;
  position: "left" | "center" | "right";
  tenantId: string;
}) {
  if (!zone) {
    return <div className={`editable-header-zone zone-${position}`} />;
  }

  const hasContent =
    zone.logo?.src || zone.menuId || (zone.blocks && zone.blocks.length > 0);

  return (
    <div className={`editable-header-zone zone-${position}`}>
      {/* Logo */}
      {zone.logo?.src && (
        <a href={zone.logo.href || "/"} className="header-logo">
          <img
            src={zone.logo.src}
            alt={zone.logo.alt || "Logo"}
            className="header-logo-image"
          />
        </a>
      )}

      {/* Blocks */}
      {zone.blocks?.map((block, index) => (
        <HeaderBlock key={index} block={block} />
      ))}

      {/* Empty zone placeholder */}
      {!hasContent && (
        <span className="editable-header-zone-placeholder">{position}</span>
      )}
    </div>
  );
}

/**
 * Header Block - renders a block in the header
 */
function HeaderBlock({ block }: { block: Record<string, unknown> }) {
  const blockType = (block.type || block._type) as string;
  const config = (block.config || block) as Record<string, unknown>;

  switch (blockType) {
    case "logo":
      if (config.src) {
        return (
          <a href={(config.href as string) || "/"} className="header-logo">
            <img
              src={config.src as string}
              alt={(config.alt as string) || "Logo"}
              className="header-logo-image"
            />
          </a>
        );
      }
      return null;

    case "button":
      return (
        <a
          href={(config.href as string) || "#"}
          className={`header-button header-button-${(config.variant as string) || "primary"}`}
        >
          {(config.text as string) || "Button"}
        </a>
      );

    case "menu":
      return <span className="header-menu-placeholder">Menu</span>;

    default:
      return null;
  }
}
