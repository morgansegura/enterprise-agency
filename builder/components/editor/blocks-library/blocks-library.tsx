"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Type,
  Image,
  Video,
  List,
  Quote,
  ChevronDown,
  Minus,
  MousePointer,
  Box,
  Music,
  Code,
  TrendingUp,
  Map,
  ImageIcon,
  Columns2,
  Rows3,
  AlignJustify,
  Layout,
  Square,
  Sparkles,
  Lock,
  Search,
  Mail,
  MessageSquare,
  Grid3X3,
  Share2,
  HelpCircle,
} from "lucide-react";
import { TierGate } from "@/components/tier";
import { useIsBuilder } from "@/lib/hooks/use-tier";
import "./blocks-library.css";

interface BlockDef {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  type: string;
}

interface Category {
  label: string;
  blocks: BlockDef[];
  tier?: "BUILDER";
}

const CATEGORIES: Category[] = [
  {
    label: "Structure",
    blocks: [
      { id: "container", name: "Container", icon: Layout, type: "container-block" },
      { id: "columns", name: "Columns", icon: Columns2, type: "columns-block" },
      { id: "grid", name: "Grid", icon: Square, type: "grid-block" },
      { id: "flex", name: "Flex", icon: Rows3, type: "flex-block" },
      { id: "stack", name: "Stack", icon: Rows3, type: "stack-block" },
    ],
    tier: "BUILDER",
  },
  {
    label: "Typography",
    blocks: [
      { id: "heading", name: "Heading", icon: Type, type: "heading-block" },
      { id: "text", name: "Paragraph", icon: AlignJustify, type: "text-block" },
      { id: "rich-text", name: "Rich Text", icon: Type, type: "rich-text-block" },
      { id: "quote", name: "Block Quote", icon: Quote, type: "quote-block" },
      { id: "list", name: "List", icon: List, type: "list-block" },
    ],
  },
  {
    label: "Basic",
    blocks: [
      { id: "button", name: "Button", icon: MousePointer, type: "button-block" },
      { id: "card", name: "Card", icon: Box, type: "card-block" },
      { id: "icon", name: "Icon", icon: ImageIcon, type: "icon-block" },
      { id: "divider", name: "Divider", icon: Minus, type: "divider-block" },
      { id: "spacer", name: "Spacer", icon: AlignJustify, type: "spacer-block" },
      { id: "logo", name: "Logo", icon: Sparkles, type: "logo-block" },
    ],
  },
  {
    label: "Media",
    blocks: [
      { id: "image", name: "Image", icon: Image, type: "image-block" },
      { id: "video", name: "Video", icon: Video, type: "video-block" },
      { id: "audio", name: "Audio", icon: Music, type: "audio-block" },
      { id: "embed", name: "Embed", icon: Code, type: "embed-block" },
      { id: "map", name: "Map", icon: Map, type: "map-block" },
    ],
  },
  {
    label: "Interactive",
    blocks: [
      { id: "accordion", name: "Accordion", icon: ChevronDown, type: "accordion-block" },
      { id: "tabs", name: "Tabs", icon: Columns2, type: "tabs-block" },
      { id: "stats", name: "Stats", icon: TrendingUp, type: "stats-block" },
    ],
  },
  {
    label: "Forms",
    blocks: [
      { id: "contact-form", name: "Contact", icon: MessageSquare, type: "contact-form-block" },
      { id: "newsletter", name: "Newsletter", icon: Mail, type: "newsletter-block" },
      { id: "faq", name: "FAQ", icon: HelpCircle, type: "faq-block" },
      { id: "feature-grid", name: "Features", icon: Grid3X3, type: "feature-grid-block" },
      { id: "social-links", name: "Social", icon: Share2, type: "social-links-block" },
    ],
  },
];

export function BlocksLibrary() {
  const params = useParams();
  const tenantId = params?.id as string;
  useIsBuilder(tenantId);
  const [search, setSearch] = React.useState("");
  const [collapsed, setCollapsed] = React.useState<Set<string>>(new Set());

  const toggleCategory = (label: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const handleBlockClick = (block: BlockDef) => {
    window.dispatchEvent(
      new CustomEvent("add-block", {
        detail: { blockId: block.id, blockType: block.type },
      }),
    );
  };

  const filteredCategories = React.useMemo(() => {
    if (!search.trim()) return CATEGORIES;
    const q = search.toLowerCase();
    return CATEGORIES.map((cat) => ({
      ...cat,
      blocks: cat.blocks.filter((b) => b.name.toLowerCase().includes(q)),
    })).filter((cat) => cat.blocks.length > 0);
  }, [search]);

  const renderCategory = (cat: Category) => {
    const isCollapsed = collapsed.has(cat.label);

    const content = (
      <div className="blocks-library-category" key={cat.label}>
        <button
          type="button"
          className="blocks-library-category-header"
          data-collapsed={isCollapsed || undefined}
          onClick={() => toggleCategory(cat.label)}
        >
          <span className="blocks-library-category-title">{cat.label}</span>
          <ChevronDown className="blocks-library-category-chevron" />
        </button>

        {!isCollapsed && (
          <div className="blocks-library-grid">
            {cat.blocks.map((block) => {
              const Icon = block.icon;
              return (
                <button
                  key={block.id}
                  type="button"
                  className="blocks-library-card"
                  onClick={() => handleBlockClick(block)}
                  title={block.name}
                >
                  <div className="blocks-library-card-icon">
                    <Icon className="size-5" />
                  </div>
                  <span className="blocks-library-card-label">
                    {block.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );

    if (cat.tier && tenantId) {
      return (
        <TierGate
          key={cat.label}
          tenantId={tenantId}
          requiredTier={cat.tier}
          fallback={
            <div className="blocks-library-category blocks-library-locked">
              <div className="blocks-library-category-header">
                <span className="blocks-library-category-title">
                  {cat.label}
                </span>
                <Lock className="size-3 text-(--el-400)" />
              </div>
            </div>
          }
        >
          {content}
        </TierGate>
      );
    }

    return content;
  };

  return (
    <div className="blocks-library">
      {/* Search */}
      <div className="blocks-library-search">
        <Search className="size-3.5 shrink-0" />
        <input
          type="text"
          className="blocks-library-search-input"
          placeholder="Search elements"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Categories */}
      {filteredCategories.map(renderCategory)}
    </div>
  );
}
