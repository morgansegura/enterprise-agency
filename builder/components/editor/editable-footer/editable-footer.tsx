"use client";

import * as React from "react";
import { Settings2, Copy, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useFooter,
  useDefaultFooter,
  useUpdateFooter,
  useDuplicateFooter,
  type Footer,
  type FooterStyle,
} from "@/lib/hooks/use-footers";
import { FooterSettingsPopover } from "./footer-settings-popover";
import { FooterLibraryPicker } from "./footer-library-picker";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import "./editable-footer.css";

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
function getBorder(border?: string): string | undefined {
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
    xs: "0.5rem",
    sm: "1rem",
    md: "2rem",
    lg: "3rem",
    xl: "4rem",
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

interface EditableFooterProps {
  tenantId: string;
  footerId?: string | null;
  onFooterChange?: (footerId: string | null) => void;
}

/**
 * Editable Footer Component
 *
 * Wraps a footer for in-page editing with section-like behavior:
 * - Controls appear on hover (settings, clone, change)
 * - Border appears on hover
 * - No lock/unlock - always editable
 */
export function EditableFooter({
  tenantId,
  footerId,
  onFooterChange,
}: EditableFooterProps) {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [libraryOpen, setLibraryOpen] = React.useState(false);

  // Fetch footer data
  const { data: specificFooter } = useFooter(
    tenantId,
    footerId && footerId !== "default" ? footerId : "",
  );
  const { data: defaultFooter } = useDefaultFooter(tenantId);

  const footer: Footer | null | undefined =
    footerId === "default" || !footerId
      ? defaultFooter
      : specificFooter || defaultFooter;

  const updateFooter = useUpdateFooter(tenantId);
  const duplicateFooter = useDuplicateFooter(tenantId);

  // Handle style changes
  const handleStyleChange = (style: Partial<FooterStyle>) => {
    if (!footer) return;

    updateFooter.mutate(
      {
        id: footer.id,
        data: {
          style: { ...footer.style, ...style },
        },
      },
      {
        onSuccess: () => {
          toast.success("Footer updated");
        },
      },
    );
  };

  // Handle footer property changes
  const handleFooterChange = (field: string, value: unknown) => {
    if (!footer) return;

    updateFooter.mutate({
      id: footer.id,
      data: { [field]: value },
    });
  };

  // Clone footer and switch to the clone
  const handleClone = () => {
    if (!footer) return;

    duplicateFooter.mutate(
      { id: footer.id, name: `${footer.name} (Copy)` },
      {
        onSuccess: (newFooter) => {
          toast.success("Footer cloned");
          onFooterChange?.(newFooter.id);
        },
      },
    );
  };

  // Handle footer selection from library
  const handleSelectFooter = (selectedFooterId: string | null) => {
    onFooterChange?.(selectedFooterId);
    setLibraryOpen(false);
  };

  // No footer state
  if (!footer) {
    return (
      <div className="editable-footer editable-footer-empty">
        <div className="editable-footer-empty-content">
          <p>No footer assigned</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLibraryOpen(true)}
          >
            <ArrowRightLeft className="h-4 w-4" />
            Choose Footer
          </Button>
        </div>
        <FooterLibraryPicker
          tenantId={tenantId}
          currentFooterId={null}
          open={libraryOpen}
          onOpenChange={setLibraryOpen}
          onSelect={handleSelectFooter}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "editable-footer",
        settingsOpen && "is-settings-open",
        libraryOpen && "is-popover-open",
      )}
    >
      {/* Footer Visual - with border on hover */}
      <div className="editable-footer-visual">
        {/* Footer Content */}
        <FooterContent footer={footer} />

        {/* Settings Handle - Right side (like section-actions-handle) */}
        <FooterSettingsPopover
          footer={footer}
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          onStyleChange={handleStyleChange}
          onFooterChange={handleFooterChange}
        >
          <button
            className="footer-settings-handle"
            aria-label="Footer settings"
          >
            <Settings2 className="h-4 w-4" />
          </button>
        </FooterSettingsPopover>

        {/* Actions row - shows on hover */}
        <div className="footer-actions-row">
          {/* Clone */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleClone}
            className="footer-action-btn"
            disabled={duplicateFooter.isPending}
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Clone</span>
          </Button>

          {/* Change footer */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLibraryOpen(true)}
            className="footer-action-btn"
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            <span>Change</span>
          </Button>
        </div>

        {/* Footer name badge */}
        <div className="footer-name-badge">{footer.name}</div>
      </div>

      {/* Library picker modal */}
      <FooterLibraryPicker
        tenantId={tenantId}
        currentFooterId={footer.id}
        open={libraryOpen}
        onOpenChange={setLibraryOpen}
        onSelect={handleSelectFooter}
      />
    </div>
  );
}

/**
 * Footer Content - renders the actual footer
 *
 * Follows Wrapper → Container pattern:
 * - Wrapper (footer bar): full-width, background, padding, shadow, border
 * - Container: max-width, padding, background, radius, shadow, border
 */
function FooterContent({ footer }: { footer: Footer }) {
  const style = footer.style || {};

  // Wrapper styles
  const wrapperStyles: React.CSSProperties = {
    backgroundColor: getBackgroundColor(style.backgroundColor),
    color: getTextColor(style.backgroundColor, style.textColor),
    borderTop: getBorder(style.borderTop),
    boxShadow: getBoxShadow(style.boxShadow),
    paddingTop: getSpacing(style.paddingY) || "2rem",
    paddingBottom: getSpacing(style.paddingY) || "2rem",
  };

  // Container styles
  const containerStyles: React.CSSProperties = {
    backgroundColor: getBackgroundColor(style.containerBackground),
    borderRadius: getBorderRadius(style.containerBorderRadius),
    boxShadow: getBoxShadow(style.containerShadow),
    border:
      style.containerBorder && style.containerBorder !== "none"
        ? getBorder(style.containerBorder)
        : undefined,
    paddingLeft: getSpacing(style.containerPaddingX) || "1rem",
    paddingRight: getSpacing(style.containerPaddingX) || "1rem",
    paddingTop: getSpacing(style.containerPaddingY),
    paddingBottom: getSpacing(style.containerPaddingY),
    marginLeft: "auto",
    marginRight: "auto",
  };

  return (
    <footer
      className={cn(
        "editable-footer-content",
        `layout-${footer.layout.toLowerCase()}`,
      )}
      style={wrapperStyles}
    >
      <div
        className={cn(
          "editable-footer-container",
          `footer-width-${style.containerWidth || "container"}`,
        )}
        style={containerStyles}
      >
        <FooterLayout footer={footer} />
      </div>
    </footer>
  );
}

/**
 * Footer Layout - renders content based on layout type
 */
function FooterLayout({ footer }: { footer: Footer }) {
  const { layout, zones, copyright, socialLinks } = footer;

  const renderCopyright = () => {
    if (!copyright) return null;

    const year = copyright.showYear ? new Date().getFullYear() : "";
    const text = copyright.text || "";
    const company = copyright.companyName || "";

    return (
      <p className="footer-copyright">
        {year && `© ${year} `}
        {company}
        {text && ` ${text}`}
      </p>
    );
  };

  const renderSocialLinks = () => {
    if (!socialLinks || socialLinks.length === 0) return null;

    return (
      <div className="footer-social-links">
        {socialLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            className="footer-social-link"
            target="_blank"
            rel="noopener noreferrer"
            title={link.platform}
          >
            {link.icon || link.platform}
          </a>
        ))}
      </div>
    );
  };

  switch (layout) {
    case "SIMPLE":
      return (
        <div className="footer-layout-simple">
          <div className="footer-left">
            {zones?.left?.logo?.src && (
              <img
                src={zones.left.logo.src}
                alt={zones.left.logo.alt || "Logo"}
                className="footer-logo"
              />
            )}
            {renderCopyright()}
          </div>
          <div className="footer-right">{renderSocialLinks()}</div>
        </div>
      );

    case "COLUMNS":
      return (
        <div className="footer-layout-columns">
          {zones?.column1 && (
            <div className="footer-column">
              <FooterZone zone={zones.column1} />
            </div>
          )}
          {zones?.column2 && (
            <div className="footer-column">
              <FooterZone zone={zones.column2} />
            </div>
          )}
          {zones?.column3 && (
            <div className="footer-column">
              <FooterZone zone={zones.column3} />
            </div>
          )}
          {zones?.column4 && (
            <div className="footer-column">
              <FooterZone zone={zones.column4} />
            </div>
          )}
          {zones?.bottom && (
            <div className="footer-bottom">
              {renderCopyright()}
              {renderSocialLinks()}
            </div>
          )}
        </div>
      );

    case "STACKED":
      return (
        <div className="footer-layout-stacked">
          <div className="footer-top">
            {zones?.left?.logo?.src && (
              <img
                src={zones.left.logo.src}
                alt={zones.left.logo.alt || "Logo"}
                className="footer-logo"
              />
            )}
            <FooterZone zone={zones?.center} />
          </div>
          <div className="footer-bottom">
            {renderCopyright()}
            {renderSocialLinks()}
          </div>
        </div>
      );

    case "CENTERED":
      return (
        <div className="footer-layout-centered">
          {zones?.center?.logo?.src && (
            <img
              src={zones.center.logo.src}
              alt={zones.center.logo.alt || "Logo"}
              className="footer-logo"
            />
          )}
          <FooterZone zone={zones?.center} />
          {renderSocialLinks()}
          {renderCopyright()}
        </div>
      );

    case "MINIMAL":
    default:
      return (
        <div className="footer-layout-minimal">
          {renderCopyright()}
          {renderSocialLinks()}
        </div>
      );
  }
}

/**
 * Footer Zone - renders a single zone
 */
function FooterZone({
  zone,
}: {
  zone?: import("@/lib/hooks/use-footers").FooterZone;
}) {
  if (!zone) return null;

  return (
    <div className="footer-zone">
      {zone.logo?.src && (
        <a href={zone.logo.href || "/"} className="footer-logo-link">
          <img
            src={zone.logo.src}
            alt={zone.logo.alt || "Logo"}
            className="footer-logo"
          />
        </a>
      )}
      {zone.blocks?.map((block, index) => (
        <div key={index} className="footer-block">
          {/* Block content would be rendered here */}
        </div>
      ))}
    </div>
  );
}
