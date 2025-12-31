"use client";

import * as React from "react";
import {
  type HeaderZones,
  type HeaderStyle,
  type HeaderBehavior,
} from "@/lib/hooks/use-headers";
import { useMenus, type Menu } from "@/lib/hooks/use-menus";
import { ResizablePreview } from "@/components/ui/resizable-preview";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Plus,
  Image,
  Menu as MenuIcon,
  MousePointer,
  Search,
  ShoppingCart,
  User,
  PlusCircle,
} from "lucide-react";

import "./header-canvas.css";

// =============================================================================
// Types
// =============================================================================

export type ZonePosition = "left" | "center" | "right";
export type BlockType =
  | "logo"
  | "menu"
  | "button"
  | "search"
  | "cart"
  | "account";

export interface ZoneBlock {
  type: BlockType;
  id: string;
  config: Record<string, unknown>;
}

export interface BlockSelection {
  zone: ZonePosition;
  blockIndex: number;
  block: ZoneBlock;
}

interface HeaderCanvasProps {
  tenantId: string;
  zones: HeaderZones;
  style: HeaderStyle;
  behavior: HeaderBehavior;
  selection: BlockSelection | null;
  onSelect: (selection: BlockSelection | null) => void;
  onAddBlock: (zone: ZonePosition, type: BlockType) => void;
}

const blockTypes: { type: BlockType; label: string; icon: React.ReactNode }[] =
  [
    { type: "logo", label: "Logo", icon: <Image className="size-4" /> },
    { type: "menu", label: "Menu", icon: <MenuIcon className="size-4" /> },
    {
      type: "button",
      label: "Button",
      icon: <MousePointer className="size-4" />,
    },
    { type: "search", label: "Search", icon: <Search className="size-4" /> },
    { type: "cart", label: "Cart", icon: <ShoppingCart className="size-4" /> },
    { type: "account", label: "Account", icon: <User className="size-4" /> },
  ];

// =============================================================================
// Helpers
// =============================================================================

function processSvgForColor(svg: string): string {
  return svg
    .replace(/fill="(?!none)[^"]*"/gi, 'fill="currentColor"')
    .replace(/fill:\s*(?!none)[^;}"']+/gi, "fill: currentColor");
}

function generateBlockId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// =============================================================================
// Add Block Popover
// =============================================================================

interface AddBlockPopoverProps {
  zone: ZonePosition;
  onAdd: (zone: ZonePosition, type: BlockType) => void;
}

function AddBlockPopover({ zone, onAdd }: AddBlockPopoverProps) {
  const [open, setOpen] = React.useState(false);

  const handleAdd = (type: BlockType) => {
    onAdd(zone, type);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="header-canvas-add-btn" title={`Add to ${zone} zone`}>
          <PlusCircle className="size-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="header-canvas-add-popover" align="center">
        <div className="header-canvas-add-grid">
          {blockTypes.map((blockType) => (
            <button
              key={blockType.type}
              className="header-canvas-add-option"
              onClick={() => handleAdd(blockType.type)}
            >
              {blockType.icon}
              <span>{blockType.label}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// =============================================================================
// Block Renderer
// =============================================================================

interface BlockRendererProps {
  block: ZoneBlock;
  menus: Menu[];
  isSelected: boolean;
  onClick: () => void;
}

function BlockRenderer({
  block,
  menus,
  isSelected,
  onClick,
}: BlockRendererProps) {
  const config = block.config;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  const wrapperClass = `header-canvas-block ${isSelected ? "is-selected" : ""}`;

  switch (block.type) {
    case "logo":
      const logoSvg = config.svg as string;
      const logoSrc = config.src as string;
      const logoHeight = (config.height as number) || 32;
      const logoColor = (config.color as string) || "currentColor";

      if (logoSvg) {
        const processedSvg = processSvgForColor(logoSvg);
        return (
          <div
            className={wrapperClass}
            onClick={handleClick}
            data-block-type="logo"
          >
            <div
              className="header-canvas-logo-svg"
              style={{ height: logoHeight, color: logoColor }}
              dangerouslySetInnerHTML={{ __html: processedSvg }}
            />
          </div>
        );
      }
      if (logoSrc) {
        return (
          <div
            className={wrapperClass}
            onClick={handleClick}
            data-block-type="logo"
          >
            <img
              src={logoSrc}
              alt={(config.alt as string) || "Logo"}
              className="header-canvas-logo-img"
              style={{ height: logoHeight }}
            />
          </div>
        );
      }
      // Placeholder logo
      return (
        <div
          className={`${wrapperClass} header-canvas-placeholder`}
          onClick={handleClick}
          data-block-type="logo"
        >
          <Image className="size-5 opacity-50" />
          <span>Logo</span>
        </div>
      );

    case "menu":
      const menuId = config.menuId as string;
      const menu = menus.find((m) => m.id === menuId);
      return (
        <div
          className={wrapperClass}
          onClick={handleClick}
          data-block-type="menu"
        >
          {menu ? (
            <nav className="header-canvas-nav">
              {menu.items.map((item) => (
                <span key={item.id} className="header-canvas-nav-item">
                  {item.label}
                </span>
              ))}
            </nav>
          ) : (
            <div className="header-canvas-placeholder">
              <MenuIcon className="size-5 opacity-50" />
              <span>Menu</span>
            </div>
          )}
        </div>
      );

    case "button":
      const variant = (config.variant as string) || "primary";
      const text = (config.text as string) || "Button";
      return (
        <div
          className={wrapperClass}
          onClick={handleClick}
          data-block-type="button"
        >
          <button className={`header-canvas-btn header-canvas-btn-${variant}`}>
            {text}
          </button>
        </div>
      );

    case "search":
      return (
        <div
          className={wrapperClass}
          onClick={handleClick}
          data-block-type="search"
        >
          <button className="header-canvas-icon-btn">
            <Search className="size-5" />
          </button>
        </div>
      );

    case "cart":
      return (
        <div
          className={wrapperClass}
          onClick={handleClick}
          data-block-type="cart"
        >
          <button className="header-canvas-icon-btn">
            <ShoppingCart className="size-5" />
          </button>
        </div>
      );

    case "account":
      return (
        <div
          className={wrapperClass}
          onClick={handleClick}
          data-block-type="account"
        >
          <button className="header-canvas-icon-btn">
            <User className="size-5" />
          </button>
        </div>
      );

    default:
      return null;
  }
}

// =============================================================================
// Zone Renderer
// =============================================================================

interface ZoneRendererProps {
  position: ZonePosition;
  zone: HeaderZones["left"];
  menus: Menu[];
  selection: BlockSelection | null;
  onSelect: (selection: BlockSelection | null) => void;
  onAddBlock: (zone: ZonePosition, type: BlockType) => void;
}

function ZoneRenderer({
  position,
  zone,
  menus,
  selection,
  onSelect,
  onAddBlock,
}: ZoneRendererProps) {
  const blocks = (zone?.blocks || []) as unknown as ZoneBlock[];
  const isEmpty = blocks.length === 0;

  const handleBlockClick = (index: number, block: ZoneBlock) => {
    onSelect({ zone: position, blockIndex: index, block });
  };

  return (
    <div
      className={`header-canvas-zone header-canvas-zone-${position} ${isEmpty ? "is-empty" : ""}`}
      data-zone={position}
    >
      {blocks.map((block, index) => {
        const isSelected =
          selection?.zone === position && selection?.blockIndex === index;
        return (
          <BlockRenderer
            key={block.id || index}
            block={block}
            menus={menus}
            isSelected={isSelected}
            onClick={() => handleBlockClick(index, block)}
          />
        );
      })}

      {/* Add button - always visible on hover */}
      <AddBlockPopover zone={position} onAdd={onAddBlock} />
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function HeaderCanvas({
  tenantId,
  zones,
  style,
  behavior,
  selection,
  onSelect,
  onAddBlock,
}: HeaderCanvasProps) {
  const { data: menus = [] } = useMenus(tenantId);

  const heightClass = style.height
    ? `header-height-${style.height}`
    : "header-height-md";
  const behaviorClass = `header-behavior-${behavior.toLowerCase()}`;
  const paddingClass = `header-padding-${style.paddingX || "md"}`;

  // Click on canvas background to deselect
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelect(null);
    }
  };

  return (
    <div className="header-canvas">
      <ResizablePreview height={300} showScrollContent={false}>
        <header
          className={`header-canvas-header ${heightClass} ${behaviorClass}`}
          style={{
            backgroundColor: style.backgroundColor || "#ffffff",
            color: style.textColor || "#000000",
            borderBottom: style.borderBottom || "1px solid var(--border)",
            boxShadow: style.boxShadow || undefined,
          }}
          onClick={handleCanvasClick}
        >
          <div
            className={`header-canvas-container header-width-${style.containerWidth || "container"} ${paddingClass}`}
          >
            <ZoneRenderer
              position="left"
              zone={zones?.left}
              menus={menus}
              selection={selection}
              onSelect={onSelect}
              onAddBlock={onAddBlock}
            />
            <ZoneRenderer
              position="center"
              zone={zones?.center}
              menus={menus}
              selection={selection}
              onSelect={onSelect}
              onAddBlock={onAddBlock}
            />
            <ZoneRenderer
              position="right"
              zone={zones?.right}
              menus={menus}
              selection={selection}
              onSelect={onSelect}
              onAddBlock={onAddBlock}
            />
          </div>
        </header>
      </ResizablePreview>

      {/* Selection indicator */}
      {selection && (
        <div className="header-canvas-selection-info">
          <span className="header-canvas-selection-zone">{selection.zone}</span>
          <span className="header-canvas-selection-type">
            {selection.block.type}
          </span>
        </div>
      )}
    </div>
  );
}

export { generateBlockId };
