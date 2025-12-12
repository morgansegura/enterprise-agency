"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Type,
  Image,
  Square,
  Play,
  Music,
  FileText,
  Layers,
  Minus,
  MapPin,
  Code,
  Quote,
  Mail,
  ChevronDown,
  Search,
} from "lucide-react";

import "./add-block-popover.css";

interface BlockType {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: string;
}

const BLOCK_TYPES: BlockType[] = [
  // Basic
  { id: "text-block", label: "Text", icon: <Type className="h-5 w-5" />, category: "Basic" },
  { id: "image-block", label: "Image", icon: <Image className="h-5 w-5" />, category: "Basic" },
  { id: "button-block", label: "Button", icon: <Square className="h-5 w-5" />, category: "Basic" },
  { id: "video-block", label: "Video", icon: <Play className="h-5 w-5" />, category: "Basic" },
  { id: "form-block", label: "Form", icon: <FileText className="h-5 w-5" />, category: "Basic" },
  { id: "audio-block", label: "Audio", icon: <Music className="h-5 w-5" />, category: "Basic" },
  { id: "newsletter-block", label: "Newsletter", icon: <Mail className="h-5 w-5" />, category: "Basic" },
  { id: "accordion-block", label: "Accordion", icon: <ChevronDown className="h-5 w-5" />, category: "Basic" },
  { id: "shape-block", label: "Shape", icon: <Layers className="h-5 w-5" />, category: "Basic" },
  { id: "scrolling-block", label: "Scrolling", icon: <Type className="h-5 w-5" />, category: "Basic" },
  { id: "line-block", label: "Line", icon: <Minus className="h-5 w-5" />, category: "Basic" },
  { id: "quote-block", label: "Quote", icon: <Quote className="h-5 w-5" />, category: "Basic" },
  { id: "map-block", label: "Map", icon: <MapPin className="h-5 w-5" />, category: "Basic" },
  { id: "embed-block", label: "Embed", icon: <Code className="h-5 w-5" />, category: "Basic" },
  { id: "markdown-block", label: "Markdown", icon: <Type className="h-5 w-5" />, category: "Basic" },
  { id: "code-block", label: "Code", icon: <Code className="h-5 w-5" />, category: "Basic" },
  { id: "heading-block", label: "Heading", icon: <Type className="h-5 w-5" />, category: "Basic" },
];

interface AddBlockPopoverProps {
  onAddBlock: (blockType: string) => void;
  children: React.ReactNode;
}

export function AddBlockPopover({ onAddBlock, children }: AddBlockPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filteredBlocks = BLOCK_TYPES.filter((block) =>
    block.label.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(filteredBlocks.map((b) => b.category))];

  const handleSelectBlock = (blockType: string) => {
    onAddBlock(blockType);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="add-block-popover" align="start" sideOffset={8}>
        {/* Search */}
        <div className="add-block-search">
          <Search className="h-4 w-4 text-(--muted-foreground)" />
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="add-block-search-input"
          />
        </div>

        {/* Block Grid */}
        <div className="add-block-content">
          {categories.map((category) => (
            <div key={category} className="add-block-category">
              <h4 className="add-block-category-title">{category}</h4>
              <div className="add-block-grid">
                {filteredBlocks
                  .filter((b) => b.category === category)
                  .map((block) => (
                    <button
                      key={block.id}
                      className="add-block-item"
                      onClick={() => handleSelectBlock(block.id)}
                    >
                      {block.icon}
                      <span>{block.label}</span>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
