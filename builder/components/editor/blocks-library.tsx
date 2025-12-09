"use client";

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
  Play,
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
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TierGate } from "@/components/tier";
import { useIsBuilder } from "@/lib/hooks/use-tier";
import "./blocks-library.css";

interface Block {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  type: string; // The actual block type for the API
}

const CONTENT_BLOCKS: Block[] = [
  {
    id: "heading",
    name: "Heading",
    icon: Type,
    description: "Add a title or heading",
    type: "heading-block",
  },
  {
    id: "text",
    name: "Text",
    icon: Type,
    description: "Simple text content",
    type: "text-block",
  },
  {
    id: "rich-text",
    name: "Rich Text",
    icon: Type,
    description: "Formatted text editor",
    type: "rich-text-block",
  },
  {
    id: "button",
    name: "Button",
    icon: MousePointer,
    description: "Call-to-action button",
    type: "button-block",
  },
  {
    id: "card",
    name: "Card",
    icon: Box,
    description: "Content card",
    type: "card-block",
  },
  {
    id: "list",
    name: "List",
    icon: List,
    description: "Ordered or unordered list",
    type: "list-block",
  },
  {
    id: "quote",
    name: "Quote",
    icon: Quote,
    description: "Blockquote with author",
    type: "quote-block",
  },
  {
    id: "icon",
    name: "Icon",
    icon: ImageIcon,
    description: "Display an icon",
    type: "icon-block",
  },
  {
    id: "divider",
    name: "Divider",
    icon: Minus,
    description: "Horizontal divider",
    type: "divider-block",
  },
  {
    id: "spacer",
    name: "Spacer",
    icon: AlignJustify,
    description: "Vertical spacing",
    type: "spacer-block",
  },
];

const MEDIA_BLOCKS: Block[] = [
  {
    id: "image",
    name: "Image",
    icon: Image,
    description: "Upload or embed an image",
    type: "image-block",
  },
  {
    id: "video",
    name: "Video",
    icon: Video,
    description: "Embed a video",
    type: "video-block",
  },
  {
    id: "audio",
    name: "Audio",
    icon: Music,
    description: "Audio player",
    type: "audio-block",
  },
  {
    id: "embed",
    name: "Embed",
    icon: Code,
    description: "Embed external content",
    type: "embed-block",
  },
  {
    id: "map",
    name: "Map",
    icon: Map,
    description: "Embedded map",
    type: "map-block",
  },
  {
    id: "logo",
    name: "Logo",
    icon: Sparkles,
    description: "Brand logo image",
    type: "logo-block",
  },
];

const INTERACTIVE_BLOCKS: Block[] = [
  {
    id: "accordion",
    name: "Accordion",
    icon: ChevronDown,
    description: "Collapsible content",
    type: "accordion-block",
  },
  {
    id: "tabs",
    name: "Tabs",
    icon: Columns2,
    description: "Tabbed interface",
    type: "tabs-block",
  },
  {
    id: "stats",
    name: "Stats",
    icon: TrendingUp,
    description: "Display statistics",
    type: "stats-block",
  },
];

const LAYOUT_BLOCKS: Block[] = [
  {
    id: "container",
    name: "Container",
    icon: Layout,
    description: "Width-constrained wrapper",
    type: "container-block",
  },
  {
    id: "columns",
    name: "Columns",
    icon: Columns2,
    description: "Multi-column layout",
    type: "columns-block",
  },
  {
    id: "grid",
    name: "Grid",
    icon: Square,
    description: "CSS Grid layout",
    type: "grid-block",
  },
  {
    id: "flex",
    name: "Flex",
    icon: Rows3,
    description: "Flexbox layout",
    type: "flex-block",
  },
  {
    id: "stack",
    name: "Stack",
    icon: Rows3,
    description: "Vertical stack",
    type: "stack-block",
  },
];

export function BlocksLibrary() {
  const params = useParams();
  const tenantId = params?.id as string;
  const isBuilder = useIsBuilder(tenantId);

  const handleBlockClick = (block: Block) => {
    // Emit event for parent to handle block addition
    window.dispatchEvent(
      new CustomEvent("add-block", {
        detail: { blockId: block.id, blockType: block.type },
      }),
    );
  };

  const renderBlockList = (blocks: Block[]) => (
    <SidebarMenu>
      {blocks.map((block) => {
        const Icon = block.icon;
        return (
          <SidebarMenuItem key={block.id}>
            <SidebarMenuButton onClick={() => handleBlockClick(block)}>
              <Icon />
              <div className="block-info">
                <span className="block-name">{block.name}</span>
                <span className="block-description">{block.description}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );

  return (
    <Accordion
      type="multiple"
      defaultValue={["content", "interactive", "media", "layout"]}
      className="w-full px-2"
    >
      <AccordionItem value="content">
        <AccordionTrigger>Content</AccordionTrigger>
        <AccordionContent>{renderBlockList(CONTENT_BLOCKS)}</AccordionContent>
      </AccordionItem>

      <AccordionItem value="interactive">
        <AccordionTrigger>Interactive</AccordionTrigger>
        <AccordionContent>
          {renderBlockList(INTERACTIVE_BLOCKS)}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="media">
        <AccordionTrigger>Media</AccordionTrigger>
        <AccordionContent>{renderBlockList(MEDIA_BLOCKS)}</AccordionContent>
      </AccordionItem>

      {/* Layout blocks - Builder tier only */}
      {tenantId && (
        <TierGate
          tenantId={tenantId}
          requiredTier="BUILDER"
          fallback={
            <AccordionItem value="layout" className="opacity-50">
              <AccordionTrigger className="cursor-default">
                <div className="flex items-center gap-2">
                  <span>Layout</span>
                  <Lock className="h-3 w-3" />
                </div>
              </AccordionTrigger>
            </AccordionItem>
          }
        >
          <AccordionItem value="layout">
            <AccordionTrigger>Layout</AccordionTrigger>
            <AccordionContent>
              {renderBlockList(LAYOUT_BLOCKS)}
            </AccordionContent>
          </AccordionItem>
        </TierGate>
      )}
    </Accordion>
  );
}
