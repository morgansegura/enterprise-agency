"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  ChevronRight,
  Copy,
  Trash2,
  Type,
  Heading,
  Image,
  Video,
  Music,
  MousePointerClick,
  Quote,
  List,
  Minus,
  Space,
  Code,
  MapPin,
  LayoutGrid,
  Layers,
  Columns3,
  Rows3,
  Box,
  AlignVerticalSpaceAround,
  BarChart3,
  ChevronDown,
  Star,
  FileText,
  Table,
  Share2,
  Calendar,
  AlertCircle,
  Navigation,
  ArrowRight,
  Gauge,
  Mail,
  ImageIcon,
  Users,
  DollarSign,
  Grid3X3,
  CreditCard,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlockSettings } from "@/components/editor/block-settings";
import type { Block } from "@/lib/types/section";

import "./block-card.css";

// =============================================================================
// Icon & Label Mapping
// =============================================================================

const BLOCK_ICONS: Record<string, React.ElementType> = {
  "heading-block": Heading,
  "text-block": Type,
  "rich-text-block": FileText,
  "image-block": Image,
  "video-block": Video,
  "audio-block": Music,
  "button-block": MousePointerClick,
  "quote-block": Quote,
  "list-block": List,
  "divider-block": Minus,
  "spacer-block": Space,
  "icon-block": Sparkles,
  "card-block": CreditCard,
  "logo-block": ImageIcon,
  "map-block": MapPin,
  "embed-block": Code,
  "code-block": Code,
  "container-block": Box,
  "grid-block": Grid3X3,
  "flex-block": Layers,
  "columns-block": Columns3,
  "stack-block": AlignVerticalSpaceAround,
  "accordion-block": ChevronDown,
  "tabs-block": LayoutGrid,
  "stats-block": BarChart3,
  "hero-block": Star,
  "features-block": LayoutGrid,
  "cta-block": ArrowRight,
  "faq-block": MessageSquare,
  "testimonials-block": Quote,
  "pricing-block": DollarSign,
  "contact-block": Mail,
  "team-block": Users,
  "logo-cloud-block": ImageIcon,
  "newsletter-block": Mail,
  "gallery-block": Grid3X3,
  "form-block": FileText,
  "navigation-block": Navigation,
  "footer-block": Rows3,
  "social-links-block": Share2,
  "product-card-block": CreditCard,
  "product-grid-block": Grid3X3,
  "table-block": Table,
  "countdown-block": Calendar,
  "alert-block": AlertCircle,
  "breadcrumb-block": ArrowRight,
  "progress-block": Gauge,
};

export function getBlockIcon(blockType: string): React.ElementType {
  return BLOCK_ICONS[blockType] || Box;
}

export function getBlockLabel(blockType: string): string {
  return blockType
    .replace(/-block$/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getBlockSummary(block: Block): string {
  const data = block.data || {};
  const textFields = ["title", "text", "label", "heading", "name", "content"];
  for (const field of textFields) {
    const val = data[field];
    if (typeof val === "string" && val.trim()) {
      const stripped = val.replace(/<[^>]*>/g, "").trim();
      return stripped.length > 50 ? `${stripped.slice(0, 50)}...` : stripped;
    }
  }
  return "";
}

// =============================================================================
// Component
// =============================================================================

interface BlockCardProps {
  block: Block;
  sortableId: string;
  onUpdate: (dataUpdates: Record<string, unknown>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function BlockCard({
  block,
  sortableId,
  onUpdate,
  onDelete,
  onDuplicate,
}: BlockCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sortableId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = getBlockIcon(block._type);
  const label = getBlockLabel(block._type);
  const summary = getBlockSummary(block);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "block-card",
        isDragging && "block-card--dragging",
        expanded && "block-card--expanded",
      )}
    >
      <div className="block-card__header">
        <button
          type="button"
          className="block-card__drag"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="block-card__drag-icon" />
        </button>

        <button
          type="button"
          className="block-card__toggle"
          onClick={() => setExpanded(!expanded)}
        >
          <ChevronRight
            className={cn(
              "block-card__chevron",
              expanded && "block-card__chevron--open",
            )}
          />
        </button>

        <button
          type="button"
          className="block-card__label"
          onClick={() => setExpanded(!expanded)}
        >
          <Icon className="block-card__icon" />
          <span className="block-card__name">{label}</span>
          {!expanded && summary && (
            <span className="block-card__summary">{summary}</span>
          )}
        </button>

        <div className="block-card__actions">
          <Button
            variant="ghost"
            size="icon"
            onClick={onDuplicate}
            className="block-card__action-btn"
          >
            <Copy />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="block-card__action-btn"
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="block-card__body">
          <BlockSettings block={block} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}
