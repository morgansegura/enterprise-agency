"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Image,
  Square,
  Play,
  Music,
  MapPin,
  Code,
  Quote,
  ChevronDown,
  Search,
  Heading1,
  AlignLeft,
  Box,
  SeparatorHorizontal,
  LayoutList,
  List,
  Star,
  MousePointer,
  Sparkles,
  Type,
} from "lucide-react";

import "./add-block-popover.css";

// =============================================================================
// Block Categories
// =============================================================================

const CATEGORIES = [
  { id: "text", label: "Text" },
  { id: "media", label: "Media" },
  { id: "interactive", label: "Interactive" },
  { id: "layout", label: "Layout" },
  { id: "content", label: "Content" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

interface BlockType {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: CategoryId;
}

const BLOCK_TYPES: BlockType[] = [
  // Text
  {
    id: "heading-block",
    label: "Heading",
    description: "Title or section header",
    icon: <Heading1 className="h-5 w-5" />,
    category: "text",
  },
  {
    id: "text-block",
    label: "Text",
    description: "Paragraph text",
    icon: <AlignLeft className="h-5 w-5" />,
    category: "text",
  },
  {
    id: "rich-text-block",
    label: "Rich Text",
    description: "Formatted text editor",
    icon: <Type className="h-5 w-5" />,
    category: "text",
  },
  {
    id: "quote-block",
    label: "Quote",
    description: "Blockquote with attribution",
    icon: <Quote className="h-5 w-5" />,
    category: "text",
  },
  {
    id: "list-block",
    label: "List",
    description: "Bullet or numbered list",
    icon: <List className="h-5 w-5" />,
    category: "text",
  },

  // Media
  {
    id: "image-block",
    label: "Image",
    description: "Single image with caption",
    // eslint-disable-next-line jsx-a11y/alt-text -- lucide-react icon
    icon: <Image className="h-5 w-5" />,
    category: "media",
  },
  {
    id: "video-block",
    label: "Video",
    description: "YouTube, Vimeo, or upload",
    icon: <Play className="h-5 w-5" />,
    category: "media",
  },
  {
    id: "audio-block",
    label: "Audio",
    description: "Audio player",
    icon: <Music className="h-5 w-5" />,
    category: "media",
  },
  {
    id: "embed-block",
    label: "Embed",
    description: "External embed code",
    icon: <Code className="h-5 w-5" />,
    category: "media",
  },
  {
    id: "map-block",
    label: "Map",
    description: "Interactive map embed",
    icon: <MapPin className="h-5 w-5" />,
    category: "media",
  },

  // Interactive
  {
    id: "button-block",
    label: "Button",
    description: "Call-to-action button",
    icon: <MousePointer className="h-5 w-5" />,
    category: "interactive",
  },
  {
    id: "accordion-block",
    label: "Accordion",
    description: "Expandable sections",
    icon: <ChevronDown className="h-5 w-5" />,
    category: "interactive",
  },
  {
    id: "tabs-block",
    label: "Tabs",
    description: "Tabbed content panels",
    icon: <LayoutList className="h-5 w-5" />,
    category: "interactive",
  },

  // Layout
  {
    id: "container-block",
    label: "Box",
    description: "Container for grouping blocks (card, panel)",
    icon: <Square className="h-5 w-5" />,
    category: "layout",
  },

  // Content
  {
    id: "divider-block",
    label: "Divider",
    description: "Horizontal separator",
    icon: <SeparatorHorizontal className="h-5 w-5" />,
    category: "content",
  },
  {
    id: "spacer-block",
    label: "Spacer",
    description: "Vertical spacing",
    icon: <Box className="h-5 w-5" />,
    category: "content",
  },
  {
    id: "icon-block",
    label: "Icon",
    description: "Icon with optional label",
    icon: <Sparkles className="h-5 w-5" />,
    category: "content",
  },
  {
    id: "logo-block",
    label: "Logo",
    description: "Logo image with link",
    icon: <Star className="h-5 w-5" />,
    category: "content",
  },
];

interface AddBlockPopoverProps {
  onAddBlock: (blockType: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function AddBlockPopover({
  onAddBlock,
  open: controlledOpen,
  onOpenChange,
  children,
}: AddBlockPopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<
    CategoryId | "all"
  >("all");

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value);
    }
    onOpenChange?.(value);
  };

  // Filter blocks by search
  const searchFilteredBlocks = BLOCK_TYPES.filter(
    (block) =>
      block.label.toLowerCase().includes(search.toLowerCase()) ||
      block.description.toLowerCase().includes(search.toLowerCase()),
  );

  // Further filter by category if not "all"
  const filteredBlocks =
    activeCategory === "all"
      ? searchFilteredBlocks
      : searchFilteredBlocks.filter((b) => b.category === activeCategory);

  // Get categories that have matching blocks
  const visibleCategories = CATEGORIES.filter((cat) =>
    filteredBlocks.some((b) => b.category === cat.id),
  );

  const handleSelectBlock = (blockType: string) => {
    onAddBlock(blockType);
    setOpen(false);
    setSearch("");
    setActiveCategory("all");
  };

  // Reset category when search changes
  React.useEffect(() => {
    if (search) {
      setActiveCategory("all");
    }
  }, [search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="add-block-popover"
        align="start"
        sideOffset={8}
      >
        {/* Search */}
        <div className="add-block-search">
          <Search className="h-4 w-4 text-[var(--el-500)]" />
          <Input
            placeholder="Search blocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="add-block-search-input"
          />
        </div>

        {/* Category Tabs */}
        {!search && (
          <div className="add-block-tabs">
            <button
              className={cn(
                "add-block-tab",
                activeCategory === "all" && "active",
              )}
              onClick={() => setActiveCategory("all")}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={cn(
                  "add-block-tab",
                  activeCategory === cat.id && "active",
                )}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Block Grid */}
        <div className="add-block-content">
          {filteredBlocks.length === 0 ? (
            <div className="add-block-empty">
              <Sparkles className="h-8 w-8 text-[var(--el-500)]/50" />
              <p>No blocks found</p>
            </div>
          ) : activeCategory === "all" ? (
            // Show grouped by category when "All" is selected
            visibleCategories.map((category) => (
              <div key={category.id} className="add-block-category">
                <h4 className="add-block-category-title">{category.label}</h4>
                <div className="add-block-grid">
                  {filteredBlocks
                    .filter((b) => b.category === category.id)
                    .map((block) => (
                      <button
                        key={block.id}
                        className="add-block-item"
                        onClick={() => handleSelectBlock(block.id)}
                        title={block.description}
                      >
                        <span className="add-block-item-icon">
                          {block.icon}
                        </span>
                        <span className="add-block-item-label">
                          {block.label}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            ))
          ) : (
            // Show flat grid for single category
            <div className="add-block-grid">
              {filteredBlocks.map((block) => (
                <button
                  key={block.id}
                  className="add-block-item"
                  onClick={() => handleSelectBlock(block.id)}
                  title={block.description}
                >
                  <span className="add-block-item-icon">{block.icon}</span>
                  <span className="add-block-item-label">{block.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
