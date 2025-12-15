"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Pencil } from "lucide-react";
import { useHeader, useDefaultHeader } from "@/lib/hooks/use-headers";
import { useMenu } from "@/lib/hooks/use-menus";
import type { Header, HeaderZone } from "@/lib/hooks/use-headers";
import "./header-renderer.css";

interface HeaderRendererProps {
  tenantId: string;
  headerId?: string | null;
  isBuilder?: boolean;
}

export function HeaderRenderer({
  tenantId,
  headerId,
  isBuilder = false,
}: HeaderRendererProps) {
  // Fetch specific header or default
  const { data: specificHeader, isLoading: specificLoading } = useHeader(
    tenantId,
    headerId && headerId !== "default" ? headerId : "",
  );

  const { data: defaultHeader, isLoading: defaultLoading } =
    useDefaultHeader(tenantId);

  // Determine which header to use
  const header: Header | null | undefined =
    headerId === "default" || !headerId
      ? defaultHeader
      : specificHeader || defaultHeader;

  const isLoading = specificLoading || defaultLoading;

  // Only return null if explicitly set to "none"
  // null/undefined/default should use the default header
  if (headerId === "none") {
    return null;
  }

  if (isLoading) {
    return (
      <header className="header-renderer header-loading">
        <div className="header-container">
          <div className="header-skeleton" />
        </div>
      </header>
    );
  }

  if (!header) {
    if (isBuilder) {
      return (
        <header className="header-renderer header-empty">
          <div className="header-container">
            <p className="header-empty-text">
              No default header configured. Create a header and set it as
              default.
            </p>
          </div>
        </header>
      );
    }
    return null;
  }

  const behaviorClass = `header-${header.behavior.toLowerCase()}`;
  const heightClass = header.style?.height
    ? `header-height-${header.style.height}`
    : "header-height-md";

  // Check if header has any content configured
  const hasContent =
    header.zones?.left?.logo?.src ||
    header.zones?.left?.menuId ||
    header.zones?.left?.blocks?.length ||
    header.zones?.center?.logo?.src ||
    header.zones?.center?.menuId ||
    header.zones?.center?.blocks?.length ||
    header.zones?.right?.logo?.src ||
    header.zones?.right?.menuId ||
    header.zones?.right?.blocks?.length;

  return (
    <header
      className={`header-renderer ${behaviorClass} ${heightClass} ${isBuilder && !hasContent ? "header-builder-empty" : ""}`}
      style={{
        backgroundColor: header.style?.backgroundColor || undefined,
        color: header.style?.textColor || undefined,
        borderBottom: header.style?.borderBottom || undefined,
        boxShadow: header.style?.boxShadow || undefined,
      }}
    >
      {/* Builder indicator with edit button */}
      {isBuilder && (
        <div className="header-builder-indicator">
          <span>{header.name}</span>
          <Link
            href={`/${tenantId}/headers/${header.id}/edit`}
            className="header-edit-button"
            title="Edit header"
          >
            <Pencil className="size-3" />
          </Link>
        </div>
      )}
      <div
        className={`header-container header-width-${header.style?.containerWidth || "container"}`}
      >
        <HeaderZoneRenderer
          zone={header.zones?.left}
          position="left"
          tenantId={tenantId}
          isBuilder={isBuilder}
        />
        <HeaderZoneRenderer
          zone={header.zones?.center}
          position="center"
          tenantId={tenantId}
          isBuilder={isBuilder}
        />
        <HeaderZoneRenderer
          zone={header.zones?.right}
          position="right"
          tenantId={tenantId}
          isBuilder={isBuilder}
        />
      </div>
    </header>
  );
}

interface HeaderZoneRendererProps {
  zone?: HeaderZone;
  position: "left" | "center" | "right";
  tenantId: string;
}

function HeaderZoneRenderer({
  zone,
  position,
  tenantId,
  isBuilder = false,
}: HeaderZoneRendererProps & { isBuilder?: boolean }) {
  const hasLogo = zone?.logo?.src;
  const hasMenu = zone?.menuId;
  const hasBlocks = zone?.blocks && zone.blocks.length > 0;
  const hasContent = hasLogo || hasMenu || hasBlocks;

  if (!zone) {
    return <div className={`header-zone header-zone-${position}`} />;
  }

  return (
    <div
      className={`header-zone header-zone-${position} header-zone-align-${zone.alignment || position}`}
    >
      {/* Logo */}
      {hasLogo && (
        <a href={zone.logo!.href || "/"} className="header-logo">
          <img
            src={zone.logo!.src}
            alt={zone.logo!.alt || "Logo"}
            width={zone.logo!.width || 120}
            height={zone.logo!.height || 40}
            className="header-logo-image"
          />
        </a>
      )}

      {/* Menu */}
      {hasMenu && (
        <HeaderMenuRenderer tenantId={tenantId} menuId={zone.menuId!} />
      )}

      {/* Custom blocks would be rendered here */}
      {zone.blocks?.map((block, index) => (
        <HeaderBlockRenderer key={index} block={block} />
      ))}

      {/* Builder placeholder when zone is empty */}
      {isBuilder && !hasContent && (
        <span className="header-zone-placeholder">{position} zone</span>
      )}
    </div>
  );
}

interface HeaderMenuRendererProps {
  tenantId: string;
  menuId: string;
}

function HeaderMenuRenderer({ tenantId, menuId }: HeaderMenuRendererProps) {
  const { data: menu, isLoading } = useMenu(tenantId, menuId);

  if (isLoading) {
    return <nav className="header-menu header-menu-loading" />;
  }

  if (!menu) {
    return null;
  }

  return (
    <nav className="header-menu">
      <ul className={`header-menu-list header-menu-${menu.type}`}>
        {menu.items.map((item) => (
          <li key={item.id} className="header-menu-item">
            <a
              href={item.url}
              target={item.target || "_self"}
              className={`header-menu-link ${item.highlight ? "header-menu-link-highlight" : ""}`}
            >
              {item.label}
            </a>
            {item.children && item.children.length > 0 && (
              <ul className="header-submenu">
                {item.children.map((child) => (
                  <li key={child.id} className="header-submenu-item">
                    <a
                      href={child.url}
                      target={child.target || "_self"}
                      className="header-submenu-link"
                    >
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

interface HeaderBlockRendererProps {
  block: Record<string, unknown>;
}

function HeaderBlockRenderer({ block }: HeaderBlockRendererProps) {
  const blockType = (block.type || block._type) as string;
  const config = (block.config || block) as Record<string, unknown>;

  switch (blockType) {
    case "logo":
      const logoSvg = config.svg as string;
      const logoSrc = config.src as string;
      const logoHref = (config.href as string) || "/";
      const logoAlt = (config.alt as string) || "Logo";

      if (logoSvg) {
        return (
          <a href={logoHref} className="header-logo" aria-label={logoAlt}>
            <span
              className="header-logo-svg"
              dangerouslySetInnerHTML={{ __html: logoSvg }}
            />
          </a>
        );
      }

      if (logoSrc) {
        return (
          <a href={logoHref} className="header-logo">
            <img src={logoSrc} alt={logoAlt} className="header-logo-image" />
          </a>
        );
      }

      return null;

    case "menu":
      // Menu is handled separately via zone.menuId or HeaderMenuRenderer
      return null;

    case "button":
      return (
        <a
          href={(config.href as string) || "#"}
          className={`header-button header-button-${(config.variant as string) || "primary"}`}
        >
          {(config.text as string) || (config.label as string) || "Button"}
        </a>
      );

    case "search":
      return (
        <button type="button" className="header-search-trigger">
          <svg
            className="header-search-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      );

    case "cart":
      return (
        <button type="button" className="header-cart-trigger">
          <svg
            className="header-cart-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </button>
      );

    case "account":
      return (
        <button type="button" className="header-account-trigger">
          <svg
            className="header-account-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </button>
      );

    default:
      return null;
  }
}
