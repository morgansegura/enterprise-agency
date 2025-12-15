"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useHeader,
  useUpdateHeader,
  type HeaderBehavior,
  type HeaderZones,
  type HeaderStyle,
  type TransparentStyle,
  type MobileMenu,
} from "@/lib/hooks/use-headers";
import { useMenus, type Menu } from "@/lib/hooks/use-menus";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  HeightControl,
  PaddingControl,
  BorderControl,
  type PaddingSize,
  type BorderValue,
  getBorderCss,
  parseBorderCss,
  getPaddingClass,
} from "@/components/ui/style-controls";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Save,
  Loader2,
  Plus,
  Image,
  Menu as MenuIcon,
  MousePointer,
  Search,
  ShoppingCart,
  User,
  Trash2,
  Pencil,
  ArrowLeft,
  ArrowRight,
  Copy,
  Settings,
  Palette,
  Smartphone,
  Pin,
  PinOff,
  Minus,
  EyeOff,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

import "./page.css";

// =============================================================================
// Types
// =============================================================================

type ZonePosition = "left" | "center" | "right";
type BlockType = "logo" | "menu" | "button" | "search" | "cart" | "account";

interface ZoneBlock {
  type: BlockType;
  id: string;
  config: Record<string, unknown>;
}

interface BlockSelection {
  zone: ZonePosition;
  blockIndex: number;
  block: ZoneBlock;
}

const headerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  behavior: z.enum(["STATIC", "FIXED", "STICKY", "SCROLL_HIDE", "TRANSPARENT"]),
  isDefault: z.boolean().optional(),
});

type HeaderForm = z.infer<typeof headerSchema>;

// =============================================================================
// Constants
// =============================================================================

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

const behaviorOptions: {
  value: HeaderBehavior;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "STATIC",
    label: "Static",
    description: "Normal flow, scrolls with page",
    icon: <Minus className="size-4" />,
  },
  {
    value: "FIXED",
    label: "Fixed",
    description: "Always visible at top",
    icon: <Pin className="size-4" />,
  },
  {
    value: "STICKY",
    label: "Sticky",
    description: "Sticks to top when scrolling past",
    icon: <PinOff className="size-4" />,
  },
  {
    value: "SCROLL_HIDE",
    label: "Scroll Hide",
    description: "Hides on scroll down, shows on scroll up",
    icon: <EyeOff className="size-4" />,
  },
  {
    value: "TRANSPARENT",
    label: "Transparent",
    description: "Transparent at top, solid on scroll",
    icon: <Layers className="size-4" />,
  },
];

const mobileMenuTypes = [
  { value: "slide-left", label: "Slide Left" },
  { value: "slide-right", label: "Slide Right" },
  { value: "dropdown", label: "Dropdown" },
  { value: "fullscreen", label: "Fullscreen" },
  { value: "bottom-nav", label: "Bottom Nav" },
];

const mobileBreakpoints = [
  { value: "sm", label: "Small (640px)" },
  { value: "md", label: "Medium (768px)" },
  { value: "lg", label: "Large (1024px)" },
];

function generateBlockId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function processSvgForColor(svg: string): string {
  return svg
    .replace(/fill="(?!none)[^"]*"/gi, 'fill="currentColor"')
    .replace(/fill:\s*(?!none)[^;}"']+/gi, "fill: currentColor");
}

// =============================================================================
// Block Floating Toolbar Component
// =============================================================================

interface BlockToolbarProps {
  onEdit: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  canMoveLeft: boolean;
  canMoveRight: boolean;
}

function BlockToolbar({
  onEdit,
  onMoveLeft,
  onMoveRight,
  onDuplicate,
  onDelete,
  canMoveLeft,
  canMoveRight,
}: BlockToolbarProps) {
  return (
    <div className="block-toolbar" onClick={(e) => e.stopPropagation()}>
      <button className="block-toolbar-btn" onClick={onEdit} title="Edit">
        <Pencil className="size-4" />
      </button>
      <button
        className="block-toolbar-btn"
        onClick={onMoveLeft}
        disabled={!canMoveLeft}
        title="Move left"
      >
        <ArrowLeft className="size-4" />
      </button>
      <button
        className="block-toolbar-btn"
        onClick={onMoveRight}
        disabled={!canMoveRight}
        title="Move right"
      >
        <ArrowRight className="size-4" />
      </button>
      <div className="block-toolbar-divider" />
      <button
        className="block-toolbar-btn"
        onClick={onDuplicate}
        title="Duplicate"
      >
        <Copy className="size-4" />
      </button>
      <button
        className="block-toolbar-btn block-toolbar-btn-danger"
        onClick={onDelete}
        title="Delete"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

// =============================================================================
// Block Settings Popover Component
// =============================================================================

interface BlockSettingsPopoverProps {
  block: ZoneBlock;
  menus: Menu[];
  onUpdate: (block: ZoneBlock) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

type BlockTab = "content" | "style";

function BlockSettingsPopover({
  block,
  menus,
  onUpdate,
  open,
  onOpenChange,
  children,
}: BlockSettingsPopoverProps) {
  const [tab, setTab] = React.useState<BlockTab>("content");
  const config = block.config;
  const blockType = blockTypes.find((b) => b.type === block.type);

  const updateConfig = (newConfig: Record<string, unknown>) => {
    onUpdate({ ...block, config: newConfig });
  };

  const renderContent = () => {
    switch (block.type) {
      case "logo":
        const logoHeight = (config.height as number) || 32;
        return (
          <>
            {tab === "content" && (
              <>
                <div className="block-popover-field">
                  <Label>Image URL</Label>
                  <Input
                    placeholder="https://example.com/logo.png"
                    value={(config.src as string) || ""}
                    onChange={(e) =>
                      updateConfig({ ...config, src: e.target.value, svg: "" })
                    }
                  />
                </div>
                <div className="block-popover-divider">
                  <span>or paste SVG</span>
                </div>
                <div className="block-popover-field">
                  <Textarea
                    placeholder="<svg>...</svg>"
                    value={(config.svg as string) || ""}
                    onChange={(e) =>
                      updateConfig({ ...config, svg: e.target.value, src: "" })
                    }
                    className="block-popover-svg"
                  />
                </div>
                <div className="block-popover-field">
                  <Label>Alt Text</Label>
                  <Input
                    placeholder="Company Logo"
                    value={(config.alt as string) || ""}
                    onChange={(e) =>
                      updateConfig({ ...config, alt: e.target.value })
                    }
                  />
                </div>
                <div className="block-popover-field">
                  <Label>Link URL</Label>
                  <Input
                    placeholder="/"
                    value={(config.href as string) || "/"}
                    onChange={(e) =>
                      updateConfig({ ...config, href: e.target.value })
                    }
                  />
                </div>
              </>
            )}
            {tab === "style" && (
              <>
                <div className="block-popover-field">
                  <Label>Height ({logoHeight}px)</Label>
                  <Slider
                    value={[logoHeight]}
                    onValueChange={([v]) =>
                      updateConfig({ ...config, height: v })
                    }
                    min={16}
                    max={80}
                    step={2}
                  />
                </div>
                <div className="block-popover-field">
                  <ColorPicker
                    label="Color (SVG only)"
                    value={(config.color as string) || "#000000"}
                    onChange={(value) =>
                      updateConfig({ ...config, color: value })
                    }
                  />
                </div>
                <div className="block-popover-field">
                  <Label>Opacity</Label>
                  <Slider
                    value={[(config.opacity as number) || 100]}
                    onValueChange={([v]) =>
                      updateConfig({ ...config, opacity: v })
                    }
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>
              </>
            )}
          </>
        );

      case "menu":
        return (
          <>
            {tab === "content" && (
              <div className="block-popover-field">
                <Label>Select Menu</Label>
                <Select
                  value={(config.menuId as string) || ""}
                  onValueChange={(v) => updateConfig({ ...config, menuId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a menu" />
                  </SelectTrigger>
                  <SelectContent>
                    {menus.length === 0 ? (
                      <SelectItem value="__none__" disabled>
                        No menus available
                      </SelectItem>
                    ) : (
                      menus.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {menus.length === 0 && (
                  <p className="block-popover-hint">
                    Create a menu in the Menus section first
                  </p>
                )}
              </div>
            )}
            {tab === "style" && (
              <>
                <div className="block-popover-field">
                  <Label>Font Size</Label>
                  <Select
                    value={(config.fontSize as string) || "md"}
                    onValueChange={(v) =>
                      updateConfig({ ...config, fontSize: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="block-popover-field">
                  <Label>Font Weight</Label>
                  <Select
                    value={(config.fontWeight as string) || "medium"}
                    onValueChange={(v) =>
                      updateConfig({ ...config, fontWeight: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="semibold">Semibold</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="block-popover-field">
                  <Label>Item Spacing</Label>
                  <Select
                    value={(config.spacing as string) || "md"}
                    onValueChange={(v) =>
                      updateConfig({ ...config, spacing: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="block-popover-field">
                  <Label>Hover Effect</Label>
                  <Select
                    value={(config.hoverStyle as string) || "underline"}
                    onValueChange={(v) =>
                      updateConfig({ ...config, hoverStyle: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="underline">Underline</SelectItem>
                      <SelectItem value="background">Background</SelectItem>
                      <SelectItem value="color">Color Change</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </>
        );

      case "button":
        return (
          <>
            {tab === "content" && (
              <>
                <div className="block-popover-field">
                  <Label>Button Text</Label>
                  <Input
                    placeholder="Get Started"
                    value={(config.text as string) || ""}
                    onChange={(e) =>
                      updateConfig({ ...config, text: e.target.value })
                    }
                  />
                </div>
                <div className="block-popover-field">
                  <Label>Link URL</Label>
                  <Input
                    placeholder="/contact"
                    value={(config.href as string) || ""}
                    onChange={(e) =>
                      updateConfig({ ...config, href: e.target.value })
                    }
                  />
                </div>
                <div className="block-popover-field-row">
                  <Label>Open in New Tab</Label>
                  <Switch
                    checked={(config.target as string) === "_blank"}
                    onCheckedChange={(v) =>
                      updateConfig({
                        ...config,
                        target: v ? "_blank" : "_self",
                      })
                    }
                  />
                </div>
              </>
            )}
            {tab === "style" && (
              <>
                <div className="block-popover-field">
                  <Label>Variant</Label>
                  <Select
                    value={(config.variant as string) || "primary"}
                    onValueChange={(v) =>
                      updateConfig({ ...config, variant: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="outline">Outline</SelectItem>
                      <SelectItem value="ghost">Ghost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="block-popover-field">
                  <Label>Size</Label>
                  <Select
                    value={(config.size as string) || "md"}
                    onValueChange={(v) => updateConfig({ ...config, size: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="block-popover-field">
                  <Label>Border Radius</Label>
                  <Select
                    value={(config.radius as string) || "md"}
                    onValueChange={(v) =>
                      updateConfig({ ...config, radius: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                      <SelectItem value="full">Pill</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </>
        );

      case "search":
        return (
          <>
            {tab === "content" && (
              <>
                <div className="block-popover-field">
                  <Label>Placeholder</Label>
                  <Input
                    placeholder="Search..."
                    value={(config.placeholder as string) || "Search..."}
                    onChange={(e) =>
                      updateConfig({ ...config, placeholder: e.target.value })
                    }
                  />
                </div>
                <div className="block-popover-field">
                  <Label>Search Action</Label>
                  <Input
                    placeholder="/search?q="
                    value={(config.action as string) || "/search?q="}
                    onChange={(e) =>
                      updateConfig({ ...config, action: e.target.value })
                    }
                  />
                </div>
              </>
            )}
            {tab === "style" && (
              <>
                <div className="block-popover-field">
                  <Label>Display Style</Label>
                  <Select
                    value={(config.style as string) || "icon"}
                    onValueChange={(v) => updateConfig({ ...config, style: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="icon">Icon Only</SelectItem>
                      <SelectItem value="input">Input Field</SelectItem>
                      <SelectItem value="expandable">Expandable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="block-popover-field">
                  <Label>Size</Label>
                  <Select
                    value={(config.size as string) || "md"}
                    onValueChange={(v) => updateConfig({ ...config, size: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </>
        );

      case "cart":
        return (
          <>
            {tab === "content" && (
              <>
                <div className="block-popover-field">
                  <Label>Link URL</Label>
                  <Input
                    placeholder="/cart"
                    value={(config.href as string) || "/cart"}
                    onChange={(e) =>
                      updateConfig({ ...config, href: e.target.value })
                    }
                  />
                </div>
                <div className="block-popover-field-row">
                  <Label>Show Badge</Label>
                  <Switch
                    checked={(config.showBadge as boolean) ?? true}
                    onCheckedChange={(v) =>
                      updateConfig({ ...config, showBadge: v })
                    }
                  />
                </div>
              </>
            )}
            {tab === "style" && (
              <>
                <div className="block-popover-field">
                  <Label>Size</Label>
                  <Select
                    value={(config.size as string) || "md"}
                    onValueChange={(v) => updateConfig({ ...config, size: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(config.showBadge as boolean) !== false && (
                  <div className="block-popover-field">
                    <ColorPicker
                      label="Badge Color"
                      value={(config.badgeColor as string) || "#ef4444"}
                      onChange={(value) =>
                        updateConfig({ ...config, badgeColor: value })
                      }
                    />
                  </div>
                )}
              </>
            )}
          </>
        );

      case "account":
        return (
          <>
            {tab === "content" && (
              <>
                <div className="block-popover-field">
                  <Label>Link URL</Label>
                  <Input
                    placeholder="/account"
                    value={(config.href as string) || "/account"}
                    onChange={(e) =>
                      updateConfig({ ...config, href: e.target.value })
                    }
                  />
                </div>
                <div className="block-popover-field">
                  <Label>Behavior</Label>
                  <Select
                    value={(config.behavior as string) || "link"}
                    onValueChange={(v) =>
                      updateConfig({ ...config, behavior: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="link">Direct Link</SelectItem>
                      <SelectItem value="dropdown">Dropdown Menu</SelectItem>
                      <SelectItem value="modal">Login Modal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {tab === "style" && (
              <>
                <div className="block-popover-field">
                  <Label>Size</Label>
                  <Select
                    value={(config.size as string) || "md"}
                    onValueChange={(v) => updateConfig({ ...config, size: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="block-popover-field">
                  <Label>Display</Label>
                  <Select
                    value={(config.display as string) || "icon"}
                    onValueChange={(v) =>
                      updateConfig({ ...config, display: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="icon">Icon Only</SelectItem>
                      <SelectItem value="text">Text Only</SelectItem>
                      <SelectItem value="both">Icon + Text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </>
        );

      default:
        return null;
    }
  };

  // Check if this block type supports style tab
  const hasStyleTab = [
    "logo",
    "menu",
    "button",
    "search",
    "cart",
    "account",
  ].includes(block.type);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="block-popover" align="start" sideOffset={8}>
        <div className="block-popover-header">
          <div className="block-popover-header-info">
            <div className="block-popover-header-icon">{blockType?.icon}</div>
            <span className="block-popover-title">{blockType?.label}</span>
          </div>
          {hasStyleTab && (
            <div className="block-popover-tabs">
              <button
                className={cn(
                  "block-popover-tab",
                  tab === "content" && "active",
                )}
                onClick={() => setTab("content")}
              >
                Content
              </button>
              <button
                className={cn("block-popover-tab", tab === "style" && "active")}
                onClick={() => setTab("style")}
              >
                Style
              </button>
            </div>
          )}
        </div>
        <div className="block-popover-content">{renderContent()}</div>
      </PopoverContent>
    </Popover>
  );
}

// =============================================================================
// Header Settings Popover Component (Floating inline editor - all settings)
// =============================================================================

type PopoverTab = "style" | "layout" | "scroll" | "details" | "mobile";

interface HeaderSettingsPopoverProps {
  // Style
  style: HeaderStyle;
  onStyleChange: (style: HeaderStyle) => void;
  // Behavior
  behavior: HeaderBehavior;
  onBehaviorChange: (behavior: HeaderBehavior) => void;
  // Transparent style
  transparentStyle: TransparentStyle;
  onTransparentStyleChange: (style: TransparentStyle) => void;
  // Mobile menu
  mobileMenu: MobileMenu;
  onMobileMenuChange: (menu: MobileMenu) => void;
  // Form data
  name: string;
  slug: string;
  isDefault: boolean;
  onNameChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onIsDefaultChange: (value: boolean) => void;
  // Popover state
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function HeaderSettingsPopover({
  style,
  onStyleChange,
  behavior,
  onBehaviorChange,
  transparentStyle,
  onTransparentStyleChange,
  mobileMenu,
  onMobileMenuChange,
  name,
  slug,
  isDefault,
  onNameChange,
  onSlugChange,
  onIsDefaultChange,
  open,
  onOpenChange,
  children,
}: HeaderSettingsPopoverProps) {
  const [tab, setTab] = React.useState<PopoverTab>("style");
  const borderValue = parseBorderCss(style.borderBottom || "");

  const handleNameChange = (value: string) => {
    onNameChange(value);
    const newSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    onSlugChange(newSlug);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="header-settings-popover"
        align="start"
        side="bottom"
        sideOffset={8}
      >
        <div className="header-popover-header">
          <div className="header-popover-tabs">
            <button
              className={cn("header-popover-tab", tab === "style" && "active")}
              onClick={() => setTab("style")}
            >
              <Palette className="size-3.5" />
              Style
            </button>
            <button
              className={cn("header-popover-tab", tab === "layout" && "active")}
              onClick={() => setTab("layout")}
            >
              <Layers className="size-3.5" />
              Layout
            </button>
            <button
              className={cn("header-popover-tab", tab === "scroll" && "active")}
              onClick={() => setTab("scroll")}
            >
              <Pin className="size-3.5" />
              Scroll
            </button>
            <button
              className={cn("header-popover-tab", tab === "mobile" && "active")}
              onClick={() => setTab("mobile")}
            >
              <Smartphone className="size-3.5" />
              Mobile
            </button>
            <button
              className={cn(
                "header-popover-tab",
                tab === "details" && "active",
              )}
              onClick={() => setTab("details")}
            >
              <Settings className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="header-popover-content">
          {/* Style Tab */}
          {tab === "style" && (
            <div className="header-popover-section">
              <div className="header-popover-row">
                <ColorPicker
                  label="Background"
                  value={style.backgroundColor || "#ffffff"}
                  onChange={(value) =>
                    onStyleChange({ ...style, backgroundColor: value })
                  }
                />
                <ColorPicker
                  label="Text"
                  value={style.textColor || "#000000"}
                  onChange={(value) =>
                    onStyleChange({ ...style, textColor: value })
                  }
                />
              </div>

              <div className="header-popover-row">
                <HeightControl
                  label="Height"
                  value={(style.height as number) || 64}
                  onChange={(value) =>
                    onStyleChange({
                      ...style,
                      height: value as unknown as HeaderStyle["height"],
                    })
                  }
                  min={40}
                  max={120}
                  step={4}
                />
                <div className="settings-field">
                  <Label className="settings-label">Shadow</Label>
                  <Select
                    value={style.boxShadow || "none"}
                    onValueChange={(v) =>
                      onStyleChange({ ...style, boxShadow: v })
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <BorderControl
                label="Border"
                value={borderValue}
                onChange={(value) =>
                  onStyleChange({ ...style, borderBottom: getBorderCss(value) })
                }
              />
            </div>
          )}

          {/* Layout Tab */}
          {tab === "layout" && (
            <div className="header-popover-section">
              <div className="header-popover-row">
                <PaddingControl
                  label="Padding X"
                  value={(style.paddingX as PaddingSize) || "md"}
                  onChange={(value) =>
                    onStyleChange({ ...style, paddingX: value })
                  }
                />
                <PaddingControl
                  label="Padding Y"
                  value={(style.paddingY as PaddingSize) || "none"}
                  onChange={(value) =>
                    onStyleChange({ ...style, paddingY: value })
                  }
                />
              </div>

              <div className="header-popover-divider" />
              <p className="text-xs font-medium text-(--muted-foreground) mb-2">
                Container
              </p>

              <div className="header-popover-row">
                <div className="settings-field">
                  <Label className="settings-label">Width</Label>
                  <Select
                    value={style.containerWidth || "full"}
                    onValueChange={(v) =>
                      onStyleChange({
                        ...style,
                        containerWidth: v as HeaderStyle["containerWidth"],
                      })
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full</SelectItem>
                      <SelectItem value="container">Container</SelectItem>
                      <SelectItem value="narrow">Narrow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="settings-field">
                  <Label className="settings-label">Radius</Label>
                  <Select
                    value={style.containerBorderRadius || "none"}
                    onValueChange={(v) =>
                      onStyleChange({ ...style, containerBorderRadius: v })
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                      <SelectItem value="full">Pill</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="header-popover-row">
                <ColorPicker
                  label="Background"
                  value={style.containerBackground || "transparent"}
                  onChange={(value) =>
                    onStyleChange({ ...style, containerBackground: value })
                  }
                />
                <div className="settings-field">
                  <Label className="settings-label">Shadow</Label>
                  <Select
                    value={style.containerShadow || "none"}
                    onValueChange={(v) =>
                      onStyleChange({ ...style, containerShadow: v })
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="header-popover-row">
                <BorderControl
                  label="Border"
                  value={parseBorderCss(style.containerBorder || "")}
                  onChange={(value) =>
                    onStyleChange({
                      ...style,
                      containerBorder: getBorderCss(value),
                    })
                  }
                />
                <PaddingControl
                  label="Margin"
                  value={(style.containerMarginY as PaddingSize) || "none"}
                  onChange={(value) =>
                    onStyleChange({
                      ...style,
                      containerMarginY: value,
                      containerMarginX: value,
                    })
                  }
                />
              </div>

              <div className="header-popover-row">
                <PaddingControl
                  label="Inner Padding"
                  value={(style.containerPaddingY as PaddingSize) || "none"}
                  onChange={(value) =>
                    onStyleChange({
                      ...style,
                      containerPaddingY: value,
                      containerPaddingX: value,
                    })
                  }
                />
                <div className="settings-field">
                  <Label className="settings-label">Zone Gap</Label>
                  <Select
                    value={style.containerGap || "md"}
                    onValueChange={(v) =>
                      onStyleChange({ ...style, containerGap: v })
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="xs">Extra Small</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                      <SelectItem value="xl">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Scroll Tab */}
          {tab === "scroll" && (
            <div className="header-popover-section">
              <div className="settings-field">
                <Label className="settings-label">Behavior</Label>
                <Select
                  value={behavior}
                  onValueChange={(v) => onBehaviorChange(v as HeaderBehavior)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {behaviorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-(--muted-foreground) mt-1">
                  {
                    behaviorOptions.find((o) => o.value === behavior)
                      ?.description
                  }
                </p>
              </div>

              {(behavior === "STICKY" ||
                behavior === "SCROLL_HIDE" ||
                behavior === "TRANSPARENT") && (
                <>
                  <div className="header-popover-divider" />
                  <p className="text-xs font-medium text-(--muted-foreground) mb-2">
                    Scrolled State
                  </p>
                  <div className="header-popover-row">
                    <ColorPicker
                      label="Background"
                      value={
                        style.scrolledBackgroundColor ||
                        style.backgroundColor ||
                        "#ffffff"
                      }
                      onChange={(value) =>
                        onStyleChange({
                          ...style,
                          scrolledBackgroundColor: value,
                        })
                      }
                    />
                    <ColorPicker
                      label="Text"
                      value={
                        style.scrolledTextColor || style.textColor || "#000000"
                      }
                      onChange={(value) =>
                        onStyleChange({ ...style, scrolledTextColor: value })
                      }
                    />
                  </div>
                  <div className="settings-field">
                    <Label className="settings-label">Shadow</Label>
                    <Select
                      value={style.scrolledShadow || "sm"}
                      onValueChange={(v) =>
                        onStyleChange({ ...style, scrolledShadow: v })
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="md">Medium</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {behavior === "TRANSPARENT" && (
                <>
                  <div className="header-popover-divider" />
                  <p className="text-xs font-medium text-(--muted-foreground) mb-2">
                    Transparent State
                  </p>
                  <div className="header-popover-row">
                    <ColorPicker
                      label="Background"
                      value={transparentStyle.backgroundColor || "transparent"}
                      onChange={(value) =>
                        onTransparentStyleChange({
                          ...transparentStyle,
                          backgroundColor: value,
                        })
                      }
                    />
                    <ColorPicker
                      label="Text"
                      value={transparentStyle.textColor || "#ffffff"}
                      onChange={(value) =>
                        onTransparentStyleChange({
                          ...transparentStyle,
                          textColor: value,
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Mobile Tab */}
          {tab === "mobile" && (
            <div className="header-popover-section">
              <div className="header-popover-row">
                <div className="settings-field">
                  <Label className="settings-label">Menu Type</Label>
                  <Select
                    value={mobileMenu.type || "slide-left"}
                    onValueChange={(v) =>
                      onMobileMenuChange({
                        ...mobileMenu,
                        type: v as MobileMenu["type"],
                      })
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mobileMenuTypes.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="settings-field">
                  <Label className="settings-label">Breakpoint</Label>
                  <Select
                    value={mobileMenu.breakpoint || "md"}
                    onValueChange={(v) =>
                      onMobileMenuChange({
                        ...mobileMenu,
                        breakpoint: v as MobileMenu["breakpoint"],
                      })
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mobileBreakpoints.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="header-popover-row">
                <ColorPicker
                  label="Background"
                  value={mobileMenu.backgroundColor || "#ffffff"}
                  onChange={(value) =>
                    onMobileMenuChange({
                      ...mobileMenu,
                      backgroundColor: value,
                    })
                  }
                />
                <ColorPicker
                  label="Text"
                  value={mobileMenu.textColor || "#000000"}
                  onChange={(value) =>
                    onMobileMenuChange({ ...mobileMenu, textColor: value })
                  }
                />
              </div>

              <div className="header-popover-divider" />

              <div className="header-popover-toggle-row">
                <span className="text-xs">Show Overlay</span>
                <Switch
                  checked={mobileMenu.showOverlay ?? true}
                  onCheckedChange={(v) =>
                    onMobileMenuChange({ ...mobileMenu, showOverlay: v })
                  }
                />
              </div>
              <div className="header-popover-toggle-row">
                <span className="text-xs">Close on Outside Click</span>
                <Switch
                  checked={mobileMenu.closeOnOutsideClick ?? true}
                  onCheckedChange={(v) =>
                    onMobileMenuChange({
                      ...mobileMenu,
                      closeOnOutsideClick: v,
                    })
                  }
                />
              </div>
              <div className="header-popover-toggle-row">
                <span className="text-xs">Close on Link Click</span>
                <Switch
                  checked={mobileMenu.closeOnLinkClick ?? true}
                  onCheckedChange={(v) =>
                    onMobileMenuChange({ ...mobileMenu, closeOnLinkClick: v })
                  }
                />
              </div>
              <div className="header-popover-toggle-row">
                <span className="text-xs">Include Search</span>
                <Switch
                  checked={mobileMenu.includeSearch ?? false}
                  onCheckedChange={(v) =>
                    onMobileMenuChange({ ...mobileMenu, includeSearch: v })
                  }
                />
              </div>
              <div className="header-popover-toggle-row">
                <span className="text-xs">Show Logo</span>
                <Switch
                  checked={mobileMenu.showLogo ?? false}
                  onCheckedChange={(v) =>
                    onMobileMenuChange({ ...mobileMenu, showLogo: v })
                  }
                />
              </div>
            </div>
          )}

          {/* Details Tab */}
          {tab === "details" && (
            <div className="header-popover-section">
              <div className="settings-field">
                <Label className="settings-label">Name</Label>
                <Input
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Main Header"
                  className="h-8"
                />
              </div>
              <div className="settings-field">
                <Label className="settings-label">Slug</Label>
                <Input
                  value={slug}
                  onChange={(e) => onSlugChange(e.target.value)}
                  placeholder="main-header"
                  className="h-8"
                />
              </div>
              <div className="header-popover-toggle-row">
                <span className="text-xs">Set as Default</span>
                <Switch
                  checked={isDefault}
                  onCheckedChange={onIsDefaultChange}
                />
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// =============================================================================
// Header Canvas Component
// =============================================================================

interface HeaderCanvasProps {
  zones: HeaderZones;
  style: HeaderStyle;
  behavior: HeaderBehavior;
  transparentStyle: TransparentStyle;
  mobileMenu: MobileMenu;
  name: string;
  slug: string;
  isDefault: boolean;
  menus: Menu[];
  selection: BlockSelection | null;
  editingBlock: boolean;
  editingHeader: boolean;
  onSelect: (selection: BlockSelection | null) => void;
  onEditBlock: () => void;
  onEditHeader: (editing: boolean) => void;
  onStyleChange: (style: HeaderStyle) => void;
  onBehaviorChange: (behavior: HeaderBehavior) => void;
  onTransparentStyleChange: (style: TransparentStyle) => void;
  onMobileMenuChange: (menu: MobileMenu) => void;
  onNameChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onIsDefaultChange: (value: boolean) => void;
  onAddBlock: (zone: ZonePosition, type: BlockType) => void;
  onUpdateBlock: (block: ZoneBlock) => void;
  onDeleteBlock: (zone: ZonePosition, index: number) => void;
  onMoveBlock: (
    zone: ZonePosition,
    index: number,
    direction: "left" | "right",
  ) => void;
  onDuplicateBlock: (zone: ZonePosition, index: number) => void;
}

function HeaderCanvas({
  zones,
  style,
  behavior,
  transparentStyle,
  mobileMenu,
  name,
  slug,
  isDefault,
  menus,
  selection,
  editingBlock,
  editingHeader,
  onSelect,
  onEditBlock,
  onEditHeader,
  onStyleChange,
  onBehaviorChange,
  onTransparentStyleChange,
  onMobileMenuChange,
  onNameChange,
  onSlugChange,
  onIsDefaultChange,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
  onDuplicateBlock,
}: HeaderCanvasProps) {
  const renderBlock = (block: ZoneBlock, zone: ZonePosition, index: number) => {
    const config = block.config;
    const isSelected =
      selection?.zone === zone && selection?.blockIndex === index;

    const handleSelect = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isSelected) {
        onSelect(null);
      } else {
        onSelect({ zone, blockIndex: index, block });
      }
    };

    const blockContent = (() => {
      switch (block.type) {
        case "logo":
          const svg = config.svg as string;
          const src = config.src as string;
          const height = (config.height as number) || 32;
          const color = (config.color as string) || "currentColor";

          if (svg) {
            return (
              <div
                className="canvas-logo-svg"
                style={{ height, color }}
                dangerouslySetInnerHTML={{ __html: processSvgForColor(svg) }}
              />
            );
          }
          if (src) {
            return (
              <img
                src={src}
                alt="Logo"
                style={{ height }}
                className="canvas-logo-img"
              />
            );
          }
          return <div className="canvas-placeholder">Logo</div>;

        case "menu":
          const menu = menus.find((m) => m.id === config.menuId);
          if (!menu) return <div className="canvas-placeholder">Menu</div>;
          return (
            <nav className="canvas-nav">
              {menu.items.map((item) => (
                <span key={item.id} className="canvas-nav-item">
                  {item.label}
                </span>
              ))}
            </nav>
          );

        case "button":
          const variant = (config.variant as string) || "primary";
          return (
            <button className={`canvas-btn canvas-btn-${variant}`}>
              {(config.text as string) || "Button"}
            </button>
          );

        case "search":
          return <Search className="canvas-icon" />;
        case "cart":
          return <ShoppingCart className="canvas-icon" />;
        case "account":
          return <User className="canvas-icon" />;

        default:
          return null;
      }
    })();

    return (
      <BlockSettingsPopover
        key={block.id || index}
        block={block}
        menus={menus}
        onUpdate={onUpdateBlock}
        open={isSelected && editingBlock}
        onOpenChange={(open) => {
          if (!open && editingBlock) onEditBlock();
        }}
      >
        <div
          className={cn("canvas-block", isSelected && "is-selected")}
          onClick={handleSelect}
        >
          {blockContent}
        </div>
      </BlockSettingsPopover>
    );
  };

  const renderZone = (position: ZonePosition) => {
    const zone = zones[position];
    const blocks = (zone?.blocks || []) as unknown as ZoneBlock[];

    return (
      <div
        className={cn("canvas-zone", `canvas-zone-${position}`)}
        onClick={() => onSelect(null)}
      >
        {blocks.map((block, index) => renderBlock(block, position, index))}

        {/* Zone add button */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="canvas-zone-add"
              onClick={(e) => e.stopPropagation()}
            >
              <Plus className="size-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="add-block-menu" align="start">
            <div className="add-block-grid">
              {blockTypes.map((bt) => (
                <button
                  key={bt.type}
                  className="add-block-option"
                  onClick={() => onAddBlock(position, bt.type)}
                >
                  {bt.icon}
                  <span>{bt.label}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  const paddingClass = getPaddingClass(
    (style.paddingX as PaddingSize) || "md",
    "x",
  );

  const widthClass = {
    full: "max-w-none",
    container: "max-w-7xl",
    narrow: "max-w-5xl",
  }[style.containerWidth || "full"];

  const borderValue = parseBorderCss(style.borderBottom || "");

  // Shadow values
  const shadowMap: Record<string, string> = {
    none: "none",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  };

  // Border radius values
  const radiusMap: Record<string, string> = {
    none: "0",
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    full: "9999px",
  };

  // Padding/margin values
  const spacingMap: Record<string, string> = {
    none: "0",
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: style.containerBackground || "transparent",
    borderRadius: radiusMap[style.containerBorderRadius || "none"],
    boxShadow: shadowMap[style.containerShadow || "none"],
    border:
      style.containerBorder && style.containerBorder !== "none"
        ? style.containerBorder
        : undefined,
    margin: `${spacingMap[style.containerMarginY || "none"]} ${spacingMap[style.containerMarginX || "none"]}`,
    padding: `${spacingMap[style.containerPaddingY || "none"]} ${spacingMap[style.containerPaddingX || "none"]}`,
    gap: spacingMap[style.containerGap || "md"],
  };

  // Calculate total header height including padding
  const headerHeight = (style.height as number) || 64;
  const verticalPadding = spacingMap[style.paddingY || "none"];

  return (
    <div className="canvas-area">
      {/* Toolbar area - outside scroll */}
      {selection && !editingBlock && (
        <div className="canvas-toolbar-area">
          <BlockToolbar
            onEdit={onEditBlock}
            onMoveLeft={() =>
              onMoveBlock(selection.zone, selection.blockIndex, "left")
            }
            onMoveRight={() =>
              onMoveBlock(selection.zone, selection.blockIndex, "right")
            }
            onDuplicate={() =>
              onDuplicateBlock(selection.zone, selection.blockIndex)
            }
            onDelete={() => onDeleteBlock(selection.zone, selection.blockIndex)}
            canMoveLeft={selection.blockIndex > 0}
            canMoveRight={
              selection.blockIndex <
              ((zones[selection.zone]?.blocks || []) as unknown[]).length - 1
            }
          />
        </div>
      )}

      {/* Scrollable preview */}
      <div
        className="canvas-scroll-area"
        onClick={() => {
          onSelect(null);
          onEditHeader(false);
        }}
      >
        <div className="canvas-wrapper">
          <HeaderSettingsPopover
            style={style}
            onStyleChange={onStyleChange}
            behavior={behavior}
            onBehaviorChange={onBehaviorChange}
            transparentStyle={transparentStyle}
            onTransparentStyleChange={onTransparentStyleChange}
            mobileMenu={mobileMenu}
            onMobileMenuChange={onMobileMenuChange}
            name={name}
            slug={slug}
            isDefault={isDefault}
            onNameChange={onNameChange}
            onSlugChange={onSlugChange}
            onIsDefaultChange={onIsDefaultChange}
            open={editingHeader}
            onOpenChange={onEditHeader}
          >
            <div
              className={cn("canvas-header", editingHeader && "is-editing")}
              style={{
                minHeight: headerHeight,
                backgroundColor: style.backgroundColor || "#ffffff",
                color: style.textColor || "#000000",
                borderBottom: getBorderCss(borderValue),
                borderTop:
                  style.borderTop && style.borderTop !== "none"
                    ? style.borderTop
                    : undefined,
                boxShadow: shadowMap[style.boxShadow || "none"],
                padding: `${verticalPadding} 0`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!selection) {
                  onEditHeader(!editingHeader);
                }
              }}
            >
              <div
                className={cn("canvas-container", paddingClass, widthClass)}
                style={containerStyle}
                onClick={(e) => e.stopPropagation()}
              >
                {renderZone("left")}
                {renderZone("center")}
                {renderZone("right")}
              </div>
            </div>
          </HeaderSettingsPopover>
        </div>
        {/* Fake page content for scroll testing */}
        <div
          className="canvas-page-content"
          onClick={() => {
            onSelect(null);
            onEditHeader(false);
          }}
        />
      </div>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export default function HeaderEditorPage({
  params,
}: {
  params: Promise<{ id: string; headerId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id, headerId } = resolvedParams;
  const router = useRouter();
  const { data: header, isLoading, error } = useHeader(id, headerId);
  const { data: menus = [] } = useMenus(id);
  const updateHeader = useUpdateHeader(id);

  // State
  const [zones, setZones] = React.useState<HeaderZones>({});
  const [style, setStyle] = React.useState<HeaderStyle>({});
  const [transparentStyle, setTransparentStyle] =
    React.useState<TransparentStyle>({});
  const [mobileMenu, setMobileMenu] = React.useState<MobileMenu>({});
  const [scrollThreshold, setScrollThreshold] = React.useState<number>(100);
  const [animation, setAnimation] = React.useState<string>("none");
  const [hasChanges, setHasChanges] = React.useState(false);
  const [selection, setSelection] = React.useState<BlockSelection | null>(null);
  const [editingBlock, setEditingBlock] = React.useState(false);
  const [editingHeader, setEditingHeader] = React.useState(false);

  const form = useForm<HeaderForm>({
    resolver: zodResolver(headerSchema),
    defaultValues: { name: "", slug: "", behavior: "STATIC", isDefault: false },
  });

  // Initialize form with header data
  React.useEffect(() => {
    if (header) {
      form.reset({
        name: header.name,
        slug: header.slug,
        behavior: header.behavior,
        isDefault: header.isDefault,
      });
      setZones(header.zones || {});
      setStyle(header.style || {});
      setTransparentStyle(header.transparentStyle || {});
      setMobileMenu(header.mobileMenu || {});
      setScrollThreshold(header.scrollThreshold || 100);
      setAnimation(header.animation || "none");
    }
  }, [header, form]);

  // Track changes
  React.useEffect(() => {
    if (header) {
      const formValues = form.getValues();
      const changed =
        formValues.name !== header.name ||
        formValues.slug !== header.slug ||
        formValues.behavior !== header.behavior ||
        formValues.isDefault !== header.isDefault ||
        JSON.stringify(zones) !== JSON.stringify(header.zones || {}) ||
        JSON.stringify(style) !== JSON.stringify(header.style || {}) ||
        JSON.stringify(transparentStyle) !==
          JSON.stringify(header.transparentStyle || {}) ||
        JSON.stringify(mobileMenu) !== JSON.stringify(header.mobileMenu || {});
      setHasChanges(changed);
    }
  }, [form, zones, style, transparentStyle, mobileMenu, header]);

  // Handlers
  const handleSave = async () => {
    const formValues = form.getValues();
    if (!(await form.trigger())) {
      toast.error("Please fix form errors");
      return;
    }

    updateHeader.mutate(
      {
        id: headerId,
        data: {
          ...formValues,
          scrollThreshold,
          animation,
          zones,
          style,
          transparentStyle,
          mobileMenu,
        },
      },
      {
        onSuccess: () => {
          toast.success("Header saved");
          setHasChanges(false);
        },
        onError: (err) => toast.error(err.message || "Failed to save"),
      },
    );
  };

  const handleAddBlock = (zone: ZonePosition, type: BlockType) => {
    const newBlock: ZoneBlock = { type, id: generateBlockId(), config: {} };
    const currentZone = zones[zone] || { blocks: [] };
    const blocks = [
      ...((currentZone.blocks || []) as unknown as ZoneBlock[]),
      newBlock,
    ];

    setZones({
      ...zones,
      [zone]: {
        ...currentZone,
        blocks: blocks as unknown as Record<string, unknown>[],
      },
    });
    setSelection({ zone, blockIndex: blocks.length - 1, block: newBlock });
    setEditingBlock(true);
  };

  const handleDeleteBlock = (zone: ZonePosition, index: number) => {
    const currentZone = zones[zone] || { blocks: [] };
    const blocks = (currentZone.blocks || []) as unknown as ZoneBlock[];
    const newBlocks = blocks.filter((_, i) => i !== index);

    setZones({
      ...zones,
      [zone]: {
        ...currentZone,
        blocks: newBlocks as unknown as Record<string, unknown>[],
      },
    });
    if (selection?.zone === zone && selection?.blockIndex === index) {
      setSelection(null);
      setEditingBlock(false);
    }
  };

  const handleUpdateBlock = (updatedBlock: ZoneBlock) => {
    if (!selection) return;
    const currentZone = zones[selection.zone] || { blocks: [] };
    const blocks = [...((currentZone.blocks || []) as unknown as ZoneBlock[])];
    blocks[selection.blockIndex] = updatedBlock;

    setZones({
      ...zones,
      [selection.zone]: {
        ...currentZone,
        blocks: blocks as unknown as Record<string, unknown>[],
      },
    });
    setSelection({ ...selection, block: updatedBlock });
  };

  const handleMoveBlock = (
    zone: ZonePosition,
    index: number,
    direction: "left" | "right",
  ) => {
    const currentZone = zones[zone] || { blocks: [] };
    const blocks = [...((currentZone.blocks || []) as unknown as ZoneBlock[])];
    const newIndex = direction === "left" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= blocks.length) return;

    [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
    setZones({
      ...zones,
      [zone]: {
        ...currentZone,
        blocks: blocks as unknown as Record<string, unknown>[],
      },
    });

    if (selection?.zone === zone && selection?.blockIndex === index) {
      setSelection({ ...selection, blockIndex: newIndex });
    }
  };

  const handleDuplicateBlock = (zone: ZonePosition, index: number) => {
    const currentZone = zones[zone] || { blocks: [] };
    const blocks = [...((currentZone.blocks || []) as unknown as ZoneBlock[])];
    const blockToDuplicate = blocks[index];
    const duplicatedBlock: ZoneBlock = {
      ...blockToDuplicate,
      id: generateBlockId(),
      config: { ...blockToDuplicate.config },
    };

    blocks.splice(index + 1, 0, duplicatedBlock);
    setZones({
      ...zones,
      [zone]: {
        ...currentZone,
        blocks: blocks as unknown as Record<string, unknown>[],
      },
    });
    setSelection({ zone, blockIndex: index + 1, block: duplicatedBlock });
  };

  if (isLoading) {
    return (
      <div className="header-editor-loading">
        <Loader2 className="size-8 animate-spin" />
        <p>Loading header...</p>
      </div>
    );
  }

  if (error || !header) {
    return (
      <div className="header-editor-error">
        <p>Failed to load header</p>
        <Button variant="outline" onClick={() => router.push(`/${id}/headers`)}>
          Back
        </Button>
      </div>
    );
  }

  const formValues = form.watch();

  return (
    <PageLayout
      title={formValues.name || header.name}
      description="Design your header"
      onBack={() => router.push(`/${id}/headers`)}
      actions={
        <Button
          onClick={handleSave}
          disabled={!hasChanges || updateHeader.isPending}
          size="sm"
        >
          {updateHeader.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          Save
        </Button>
      }
    >
      <div className="header-editor">
        {/* Header Preview Canvas */}
        <div className="header-editor-canvas">
          <HeaderCanvas
            zones={zones}
            style={style}
            behavior={formValues.behavior}
            transparentStyle={transparentStyle}
            mobileMenu={mobileMenu}
            name={formValues.name}
            slug={formValues.slug}
            isDefault={formValues.isDefault || false}
            menus={menus}
            selection={selection}
            editingBlock={editingBlock}
            editingHeader={editingHeader}
            onSelect={(sel) => {
              setSelection(sel);
              setEditingBlock(false);
              if (sel) setEditingHeader(false);
            }}
            onEditBlock={() => setEditingBlock(!editingBlock)}
            onEditHeader={setEditingHeader}
            onStyleChange={setStyle}
            onBehaviorChange={(value) => form.setValue("behavior", value)}
            onTransparentStyleChange={setTransparentStyle}
            onMobileMenuChange={setMobileMenu}
            onNameChange={(value) => form.setValue("name", value)}
            onSlugChange={(value) => form.setValue("slug", value)}
            onIsDefaultChange={(value) => form.setValue("isDefault", value)}
            onAddBlock={handleAddBlock}
            onUpdateBlock={handleUpdateBlock}
            onDeleteBlock={handleDeleteBlock}
            onMoveBlock={handleMoveBlock}
            onDuplicateBlock={handleDuplicateBlock}
          />
        </div>
      </div>
    </PageLayout>
  );
}
