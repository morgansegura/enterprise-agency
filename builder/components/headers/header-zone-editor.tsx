"use client";

import * as React from "react";
import { type HeaderZone, type HeaderZones } from "@/lib/hooks/use-headers";
import { useMenus, type Menu } from "@/lib/hooks/use-menus";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Image,
  Menu as MenuIcon,
  Plus,
  Trash2,
  Settings,
  MousePointer,
  Search,
  ShoppingCart,
  User,
  PlusCircle,
} from "lucide-react";

import "./header-zone-editor.css";

interface HeaderZoneEditorProps {
  tenantId: string;
  zones: HeaderZones;
  onChange: (zones: HeaderZones) => void;
}

type ZonePosition = "left" | "center" | "right";
type BlockType = "logo" | "menu" | "button" | "search" | "cart" | "account";

interface ZoneBlock {
  type: BlockType;
  id: string;
  config: Record<string, unknown>;
}

const blockTypes: { type: BlockType; label: string; icon: React.ReactNode }[] =
  [
    { type: "logo", label: "Logo", icon: <Image /> },
    { type: "menu", label: "Menu", icon: <MenuIcon /> },
    { type: "button", label: "Button", icon: <MousePointer /> },
    { type: "search", label: "Search", icon: <Search /> },
    { type: "cart", label: "Cart", icon: <ShoppingCart /> },
    { type: "account", label: "Account", icon: <User /> },
  ];

function generateBlockId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

interface ZoneBlockEditorProps {
  block: ZoneBlock;
  menus: Menu[];
  onUpdate: (block: ZoneBlock) => void;
  onRemove: () => void;
}

function ZoneBlockEditor({
  block,
  menus,
  onUpdate,
  onRemove,
}: ZoneBlockEditorProps) {
  const blockType = blockTypes.find((b) => b.type === block.type);

  const renderBlockConfig = () => {
    switch (block.type) {
      case "logo":
        const logoHeight = (block.config.height as number) || 32;
        return (
          <div className="zone-block-config">
            <div className="zone-block-field">
              <Label>Logo URL</Label>
              <Input
                placeholder="/logo.svg"
                value={(block.config.src as string) || ""}
                onChange={(e) =>
                  onUpdate({
                    ...block,
                    config: { ...block.config, src: e.target.value, svg: "" },
                  })
                }
              />
            </div>
            <div className="zone-block-field">
              <Label>Or paste SVG code</Label>
              <Textarea
                placeholder="<svg>...</svg>"
                value={(block.config.svg as string) || ""}
                onChange={(e) =>
                  onUpdate({
                    ...block,
                    config: { ...block.config, svg: e.target.value, src: "" },
                  })
                }
                className="zone-block-svg-input"
              />
              {block.config.svg && (
                <div
                  className="zone-block-svg-preview"
                  style={{
                    color: (block.config.color as string) || "currentColor",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: (block.config.svg as string)
                      .replace(/fill="(?!none)[^"]*"/gi, 'fill="currentColor"')
                      .replace(
                        /fill:\s*(?!none)[^;}"']+/gi,
                        "fill: currentColor",
                      ),
                  }}
                />
              )}
            </div>
            <div className="zone-block-field">
              <Label>Height ({logoHeight}px)</Label>
              <Slider
                value={[logoHeight]}
                onValueChange={([value]) =>
                  onUpdate({
                    ...block,
                    config: { ...block.config, height: value },
                  })
                }
                min={4}
                max={80}
                step={2}
              />
            </div>
            <div className="zone-block-field">
              <ColorPicker
                label="Color"
                value={(block.config.color as string) || "#000000"}
                onChange={(value) =>
                  onUpdate({
                    ...block,
                    config: { ...block.config, color: value },
                  })
                }
              />
            </div>
            <div className="zone-block-field">
              <Label>Alt Text</Label>
              <Input
                placeholder="Company Logo"
                value={(block.config.alt as string) || ""}
                onChange={(e) =>
                  onUpdate({
                    ...block,
                    config: { ...block.config, alt: e.target.value },
                  })
                }
              />
            </div>
            <div className="zone-block-field">
              <Label>Link URL</Label>
              <Input
                placeholder="/"
                value={(block.config.href as string) || "/"}
                onChange={(e) =>
                  onUpdate({
                    ...block,
                    config: { ...block.config, href: e.target.value },
                  })
                }
              />
            </div>
          </div>
        );

      case "menu":
        return (
          <div className="zone-block-config">
            <div className="zone-block-field">
              <Label>Select Menu</Label>
              <Select
                value={(block.config.menuId as string) || ""}
                onValueChange={(value) =>
                  onUpdate({
                    ...block,
                    config: { ...block.config, menuId: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a menu" />
                </SelectTrigger>
                <SelectContent>
                  {menus.map((menu) => (
                    <SelectItem key={menu.id} value={menu.id}>
                      {menu.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "button":
        return (
          <div className="zone-block-config">
            <div className="zone-block-field">
              <Label>Button Text</Label>
              <Input
                placeholder="Get Started"
                value={(block.config.text as string) || ""}
                onChange={(e) =>
                  onUpdate({
                    ...block,
                    config: { ...block.config, text: e.target.value },
                  })
                }
              />
            </div>
            <div className="zone-block-field">
              <Label>Link URL</Label>
              <Input
                placeholder="/contact"
                value={(block.config.href as string) || ""}
                onChange={(e) =>
                  onUpdate({
                    ...block,
                    config: { ...block.config, href: e.target.value },
                  })
                }
              />
            </div>
            <div className="zone-block-field">
              <Label>Variant</Label>
              <Select
                value={(block.config.variant as string) || "primary"}
                onValueChange={(value) =>
                  onUpdate({
                    ...block,
                    config: { ...block.config, variant: value },
                  })
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
          </div>
        );

      case "search":
        return (
          <div className="zone-block-config">
            <div className="zone-block-field">
              <Label>Placeholder</Label>
              <Input
                placeholder="Search..."
                value={(block.config.placeholder as string) || "Search..."}
                onChange={(e) =>
                  onUpdate({
                    ...block,
                    config: { ...block.config, placeholder: e.target.value },
                  })
                }
              />
            </div>
            <div className="zone-block-field">
              <Label>Style</Label>
              <Select
                value={(block.config.style as string) || "icon"}
                onValueChange={(value) =>
                  onUpdate({
                    ...block,
                    config: { ...block.config, style: value },
                  })
                }
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

      case "cart":
      case "account":
        return (
          <div className="zone-block-config">
            <div className="zone-block-field">
              <Label>Link URL</Label>
              <Input
                placeholder={block.type === "cart" ? "/cart" : "/account"}
                value={(block.config.href as string) || ""}
                onChange={(e) =>
                  onUpdate({
                    ...block,
                    config: { ...block.config, href: e.target.value },
                  })
                }
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="zone-block">
      <div className="zone-block-header">
        <div className="zone-block-info">
          {blockType?.icon}
          <span>{blockType?.label}</span>
        </div>
        <div className="zone-block-actions">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="zone-block-popover" align="end">
              <div className="zone-block-popover-header">
                <h4>{blockType?.label} Settings</h4>
              </div>
              {renderBlockConfig()}
            </PopoverContent>
          </Popover>
          <Button variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ZonePanelProps {
  position: ZonePosition;
  zone: HeaderZone | undefined;
  menus: Menu[];
  onUpdate: (zone: HeaderZone) => void;
}

function ZonePanel({ position, zone, menus, onUpdate }: ZonePanelProps) {
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  // Convert zone to blocks array, ensuring all blocks have IDs
  const blocks: ZoneBlock[] = React.useMemo(() => {
    if (!zone?.blocks) return [];
    return (zone.blocks as unknown as ZoneBlock[]).map((block, index) => ({
      ...block,
      id: block.id || `block-${position}-${index}`,
    }));
  }, [zone?.blocks, position]);

  // Legacy: if zone has logo or menuId directly, convert to blocks
  React.useEffect(() => {
    if (zone && !zone.blocks) {
      const newBlocks: ZoneBlock[] = [];
      if (zone.logo?.src) {
        newBlocks.push({
          type: "logo",
          id: generateBlockId(),
          config: zone.logo,
        });
      }
      if (zone.menuId) {
        newBlocks.push({
          type: "menu",
          id: generateBlockId(),
          config: { menuId: zone.menuId },
        });
      }
      if (newBlocks.length > 0) {
        onUpdate({
          ...zone,
          blocks: newBlocks as unknown as Record<string, unknown>[],
        });
      }
    }
  }, [zone, onUpdate]);

  const handleAddBlock = (type: BlockType) => {
    const newBlock: ZoneBlock = {
      type,
      id: generateBlockId(),
      config: {},
    };
    const newBlocks = [...blocks, newBlock];
    onUpdate({
      ...zone,
      blocks: newBlocks as unknown as Record<string, unknown>[],
    });
    setIsAddOpen(false);
  };

  const handleUpdateBlock = (index: number, updatedBlock: ZoneBlock) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updatedBlock;
    onUpdate({
      ...zone,
      blocks: newBlocks as unknown as Record<string, unknown>[],
    });
  };

  const handleRemoveBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    onUpdate({
      ...zone,
      blocks: newBlocks as unknown as Record<string, unknown>[],
    });
  };

  const positionLabels: Record<ZonePosition, string> = {
    left: "Left Zone",
    center: "Center Zone",
    right: "Right Zone",
  };

  return (
    <div className="zone-panel" data-position={position}>
      <div className="zone-panel-header">
        <h4>{positionLabels[position]}</h4>
        <Popover open={isAddOpen} onOpenChange={setIsAddOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusCircle />
              Add
            </Button>
          </PopoverTrigger>
          <PopoverContent className="zone-add-popover" align="end">
            <div className="zone-add-grid">
              {blockTypes.map((blockType) => (
                <button
                  key={blockType.type}
                  className="zone-add-option"
                  onClick={() => handleAddBlock(blockType.type)}
                >
                  {blockType.icon}
                  <span>{blockType.label}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="zone-panel-content">
        {blocks.length === 0 ? (
          <div className="zone-panel-empty">
            <p>No blocks added</p>
          </div>
        ) : (
          <div className="zone-panel-blocks">
            {blocks.map((block, index) => (
              <ZoneBlockEditor
                key={block.id}
                block={block}
                menus={menus}
                onUpdate={(updated) => handleUpdateBlock(index, updated)}
                onRemove={() => handleRemoveBlock(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function HeaderZoneEditor({
  tenantId,
  zones,
  onChange,
}: HeaderZoneEditorProps) {
  const { data: menus = [] } = useMenus(tenantId);

  const handleZoneUpdate = (position: ZonePosition, zone: HeaderZone) => {
    onChange({
      ...zones,
      [position]: zone,
    });
  };

  return (
    <div className="header-zone-editor">
      <div className="header-zone-editor-panels">
        <ZonePanel
          position="left"
          zone={zones.left}
          menus={menus}
          onUpdate={(zone) => handleZoneUpdate("left", zone)}
        />
        <ZonePanel
          position="center"
          zone={zones.center}
          menus={menus}
          onUpdate={(zone) => handleZoneUpdate("center", zone)}
        />
        <ZonePanel
          position="right"
          zone={zones.right}
          menus={menus}
          onUpdate={(zone) => handleZoneUpdate("right", zone)}
        />
      </div>
    </div>
  );
}
