"use client";

import * as React from "react";
import { type Menu } from "@/lib/hooks/use-menus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "@/components/ui/color-picker";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Image,
  Menu as MenuIcon,
  MousePointer,
  Search,
  ShoppingCart,
  User,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  type BlockSelection,
  type ZoneBlock,
  type BlockType,
} from "../header-canvas";

import "./block-properties-panel.css";

// =============================================================================
// Types
// =============================================================================

interface BlockPropertiesPanelProps {
  selection: BlockSelection;
  menus: Menu[];
  onUpdate: (block: ZoneBlock) => void;
  onDelete: () => void;
  onClose: () => void;
}

// =============================================================================
// Block Type Config
// =============================================================================

const blockTypeConfig: Record<
  BlockType,
  { label: string; icon: LucideIcon; description: string }
> = {
  logo: {
    label: "Logo",
    icon: Image,
    description: "Your brand logo or image",
  },
  menu: {
    label: "Navigation Menu",
    icon: MenuIcon,
    description: "Links to pages on your site",
  },
  button: {
    label: "Button",
    icon: MousePointer,
    description: "Call-to-action button",
  },
  search: {
    label: "Search",
    icon: Search,
    description: "Search functionality",
  },
  cart: {
    label: "Shopping Cart",
    icon: ShoppingCart,
    description: "Cart for e-commerce",
  },
  account: {
    label: "Account",
    icon: User,
    description: "User account access",
  },
};

// =============================================================================
// Logo Properties
// =============================================================================

interface LogoPropertiesProps {
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

function LogoProperties({ config, onChange }: LogoPropertiesProps) {
  const logoHeight = (config.height as number) || 32;

  return (
    <Tabs defaultValue="content" className="block-properties-tabs">
      <TabsList className="block-properties-tab-list">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="style">Style</TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="block-properties-tab-content">
        <div className="block-properties-section">
          <div className="block-properties-field">
            <Label>Image URL</Label>
            <Input
              placeholder="https://example.com/logo.png"
              value={(config.src as string) || ""}
              onChange={(e) =>
                onChange({ ...config, src: e.target.value, svg: "" })
              }
            />
          </div>

          <div className="block-properties-divider">
            <span>or</span>
          </div>

          <div className="block-properties-field">
            <Label>SVG Code</Label>
            <Textarea
              placeholder="<svg>...</svg>"
              value={(config.svg as string) || ""}
              onChange={(e) =>
                onChange({ ...config, svg: e.target.value, src: "" })
              }
              className="block-properties-svg-input"
            />
            {config.svg && (
              <div
                className="block-properties-svg-preview"
                style={{ color: (config.color as string) || "currentColor" }}
                dangerouslySetInnerHTML={{
                  __html: (config.svg as string)
                    .replace(/fill="(?!none)[^"]*"/gi, 'fill="currentColor"')
                    .replace(
                      /fill:\s*(?!none)[^;}"']+/gi,
                      "fill: currentColor",
                    ),
                }}
              />
            )}
          </div>

          <div className="block-properties-field">
            <Label>Alt Text</Label>
            <Input
              placeholder="Company Logo"
              value={(config.alt as string) || ""}
              onChange={(e) => onChange({ ...config, alt: e.target.value })}
            />
          </div>

          <div className="block-properties-field">
            <Label>Link URL</Label>
            <Input
              placeholder="/"
              value={(config.href as string) || "/"}
              onChange={(e) => onChange({ ...config, href: e.target.value })}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="style" className="block-properties-tab-content">
        <div className="block-properties-section">
          <div className="block-properties-field">
            <Label>Height ({logoHeight}px)</Label>
            <Slider
              value={[logoHeight]}
              onValueChange={([value]) =>
                onChange({ ...config, height: value })
              }
              min={16}
              max={80}
              step={2}
            />
          </div>

          <div className="block-properties-field">
            <ColorPicker
              label="Color"
              value={(config.color as string) || "#000000"}
              onChange={(value) => onChange({ ...config, color: value })}
            />
            <p className="block-properties-hint">Only applies to SVG logos</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

// =============================================================================
// Menu Properties
// =============================================================================

interface MenuPropertiesProps {
  config: Record<string, unknown>;
  menus: Menu[];
  onChange: (config: Record<string, unknown>) => void;
}

function MenuProperties({ config, menus, onChange }: MenuPropertiesProps) {
  return (
    <div className="block-properties-section">
      <div className="block-properties-field">
        <Label>Select Menu</Label>
        <Select
          value={(config.menuId as string) || ""}
          onValueChange={(value) => onChange({ ...config, menuId: value })}
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
              menus.map((menu) => (
                <SelectItem key={menu.id} value={menu.id}>
                  {menu.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {menus.length === 0 && (
          <p className="block-properties-hint">
            Create a menu in the Menus section first
          </p>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Button Properties
// =============================================================================

interface ButtonPropertiesProps {
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

function ButtonProperties({ config, onChange }: ButtonPropertiesProps) {
  return (
    <Tabs defaultValue="content" className="block-properties-tabs">
      <TabsList className="block-properties-tab-list">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="style">Style</TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="block-properties-tab-content">
        <div className="block-properties-section">
          <div className="block-properties-field">
            <Label>Button Text</Label>
            <Input
              placeholder="Get Started"
              value={(config.text as string) || ""}
              onChange={(e) => onChange({ ...config, text: e.target.value })}
            />
          </div>

          <div className="block-properties-field">
            <Label>Link URL</Label>
            <Input
              placeholder="/contact"
              value={(config.href as string) || ""}
              onChange={(e) => onChange({ ...config, href: e.target.value })}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="style" className="block-properties-tab-content">
        <div className="block-properties-section">
          <div className="block-properties-field">
            <Label>Variant</Label>
            <Select
              value={(config.variant as string) || "primary"}
              onValueChange={(value) => onChange({ ...config, variant: value })}
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
        </div>
      </TabsContent>
    </Tabs>
  );
}

// =============================================================================
// Search Properties
// =============================================================================

interface SearchPropertiesProps {
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

function SearchProperties({ config, onChange }: SearchPropertiesProps) {
  return (
    <div className="block-properties-section">
      <div className="block-properties-field">
        <Label>Placeholder</Label>
        <Input
          placeholder="Search..."
          value={(config.placeholder as string) || "Search..."}
          onChange={(e) => onChange({ ...config, placeholder: e.target.value })}
        />
      </div>

      <div className="block-properties-field">
        <Label>Style</Label>
        <Select
          value={(config.style as string) || "icon"}
          onValueChange={(value) => onChange({ ...config, style: value })}
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
    </div>
  );
}

// =============================================================================
// Simple Link Properties (Cart, Account)
// =============================================================================

interface LinkPropertiesProps {
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
  placeholder: string;
}

function LinkProperties({
  config,
  onChange,
  placeholder,
}: LinkPropertiesProps) {
  return (
    <div className="block-properties-section">
      <div className="block-properties-field">
        <Label>Link URL</Label>
        <Input
          placeholder={placeholder}
          value={(config.href as string) || ""}
          onChange={(e) => onChange({ ...config, href: e.target.value })}
        />
      </div>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function BlockPropertiesPanel({
  selection,
  menus,
  onUpdate,
  onDelete,
  onClose,
}: BlockPropertiesPanelProps) {
  const { block } = selection;
  const typeConfig = blockTypeConfig[block.type];
  const Icon = typeConfig.icon;

  const handleConfigChange = (newConfig: Record<string, unknown>) => {
    onUpdate({
      ...block,
      config: newConfig,
    });
  };

  const renderProperties = () => {
    switch (block.type) {
      case "logo":
        return (
          <LogoProperties config={block.config} onChange={handleConfigChange} />
        );
      case "menu":
        return (
          <MenuProperties
            config={block.config}
            menus={menus}
            onChange={handleConfigChange}
          />
        );
      case "button":
        return (
          <ButtonProperties
            config={block.config}
            onChange={handleConfigChange}
          />
        );
      case "search":
        return (
          <SearchProperties
            config={block.config}
            onChange={handleConfigChange}
          />
        );
      case "cart":
        return (
          <LinkProperties
            config={block.config}
            onChange={handleConfigChange}
            placeholder="/cart"
          />
        );
      case "account":
        return (
          <LinkProperties
            config={block.config}
            onChange={handleConfigChange}
            placeholder="/account"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="block-properties-panel">
      <CardHeader className="block-properties-header">
        <div className="block-properties-header-content">
          <div className="block-properties-header-info">
            <div className="block-properties-header-icon">
              <Icon className="size-4" />
            </div>
            <div>
              <CardTitle className="block-properties-title">
                {typeConfig.label}
              </CardTitle>
              <p className="block-properties-description">
                {typeConfig.description}
              </p>
            </div>
          </div>
          <div className="block-properties-header-actions">
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="block-properties-delete"
            >
              <Trash2 className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="block-properties-content">
        {renderProperties()}
      </CardContent>
    </Card>
  );
}
