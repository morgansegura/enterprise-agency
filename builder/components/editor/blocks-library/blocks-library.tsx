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
      { id: "link", name: "Link Block", icon: MousePointer, type: "link-block" },
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

// =============================================================================
// Section Templates — pre-built sections users can add to pages
// =============================================================================

interface SectionTemplate {
  name: string;
  description: string;
  preview: string;
  section: {
    width: string;
    paddingY: string;
    background?: Record<string, unknown>;
    styles?: Record<string, string>;
    containers: Array<{
      layout?: Record<string, unknown>;
      blocks: Array<{
        _type: string;
        data: Record<string, unknown>;
        styles?: Record<string, string>;
      }>;
    }>;
  };
}

const SECTION_TEMPLATES: SectionTemplate[] = [
  {
    name: "Hero",
    description: "Large heading with CTA button",
    preview: "H1 + Subtext + Button",
    section: {
      width: "full",
      paddingY: "2xl",
      styles: { paddingTop: "80px", paddingBottom: "80px", textAlign: "center" },
      containers: [{
        layout: { type: "flex", direction: "column", align: "center", gap: "md" },
        blocks: [
          { _type: "heading-block", data: { text: "Build Something Amazing", level: "h1", size: "4xl", weight: "bold", align: "center" }, styles: { fontSize: "56px", fontWeight: "800", lineHeight: "1.1" } },
          { _type: "text-block", data: { content: "Create stunning websites with our visual builder. No code required.", size: "lg", align: "center" }, styles: { fontSize: "20px", maxWidth: "600px", opacity: "0.7" } },
          { _type: "button-block", data: { text: "Get Started", variant: "default", size: "lg" } },
        ],
      }],
    },
  },
  {
    name: "Hero + Image",
    description: "Split hero with text and image",
    preview: "Text Left | Image Right",
    section: {
      width: "container",
      paddingY: "xl",
      styles: { paddingTop: "60px", paddingBottom: "60px" },
      containers: [{
        layout: { type: "flex", direction: "row", align: "center", gap: "lg" },
        blocks: [
          { _type: "heading-block", data: { text: "Your Headline Here", level: "h1", size: "3xl", weight: "bold" }, styles: { fontSize: "42px", fontWeight: "700" } },
          { _type: "text-block", data: { content: "Describe your value proposition. What makes you different?", size: "lg" }, styles: { fontSize: "18px", opacity: "0.7" } },
          { _type: "button-block", data: { text: "Learn More", variant: "default" } },
          { _type: "image-block", data: { src: "", alt: "Hero image" } },
        ],
      }],
    },
  },
  {
    name: "Features Grid",
    description: "3-column feature cards",
    preview: "Feature | Feature | Feature",
    section: {
      width: "container",
      paddingY: "xl",
      styles: { paddingTop: "60px", paddingBottom: "60px" },
      containers: [{
        layout: { type: "flex", direction: "column", align: "center", gap: "lg" },
        blocks: [
          { _type: "heading-block", data: { text: "Our Features", level: "h2", size: "2xl", weight: "bold", align: "center" }, styles: { fontSize: "36px", fontWeight: "700" } },
          { _type: "feature-grid-block", data: { columns: 3, features: [
            { title: "Feature One", description: "Describe the benefit of this feature.", icon: "star" },
            { title: "Feature Two", description: "Describe the benefit of this feature.", icon: "zap" },
            { title: "Feature Three", description: "Describe the benefit of this feature.", icon: "shield" },
          ] } },
        ],
      }],
    },
  },
  {
    name: "CTA Banner",
    description: "Call-to-action with background",
    preview: "Heading + Button on Color",
    section: {
      width: "full",
      paddingY: "xl",
      styles: { paddingTop: "60px", paddingBottom: "60px", backgroundColor: "#0052cc", color: "#ffffff", textAlign: "center" },
      containers: [{
        layout: { type: "flex", direction: "column", align: "center", gap: "md" },
        blocks: [
          { _type: "heading-block", data: { text: "Ready to Get Started?", level: "h2", size: "2xl", weight: "bold", align: "center" }, styles: { fontSize: "36px", color: "#ffffff" } },
          { _type: "text-block", data: { content: "Join thousands of happy customers today.", align: "center" }, styles: { fontSize: "18px", color: "rgba(255,255,255,0.8)" } },
          { _type: "button-block", data: { text: "Start Now", variant: "secondary", size: "lg" } },
        ],
      }],
    },
  },
  {
    name: "Testimonials",
    description: "Customer quotes section",
    preview: "Quote | Quote | Quote",
    section: {
      width: "container",
      paddingY: "xl",
      styles: { paddingTop: "60px", paddingBottom: "60px" },
      containers: [{
        blocks: [
          { _type: "heading-block", data: { text: "What Our Clients Say", level: "h2", size: "2xl", weight: "bold", align: "center" }, styles: { fontSize: "36px", textAlign: "center" } },
          { _type: "testimonial-block", data: { items: [
            { quote: "This product changed our business completely.", author: "Jane Smith", role: "CEO, Company" },
            { quote: "Incredible value. Would recommend to anyone.", author: "John Doe", role: "Founder, Startup" },
            { quote: "The best investment we've made this year.", author: "Sarah Johnson", role: "Director, Agency" },
          ] } },
        ],
      }],
    },
  },
  {
    name: "Pricing",
    description: "Pricing plans comparison",
    preview: "Plan | Plan | Plan",
    section: {
      width: "container",
      paddingY: "xl",
      styles: { paddingTop: "60px", paddingBottom: "60px" },
      containers: [{
        blocks: [
          { _type: "heading-block", data: { text: "Simple Pricing", level: "h2", size: "2xl", weight: "bold", align: "center" }, styles: { fontSize: "36px", textAlign: "center" } },
          { _type: "pricing-block", data: { tiers: [
            { name: "Starter", price: "$29", period: "/mo", features: ["5 Projects", "Basic Support", "1 Team Member"], cta: "Get Started" },
            { name: "Pro", price: "$79", period: "/mo", features: ["Unlimited Projects", "Priority Support", "10 Team Members", "Analytics"], cta: "Go Pro", highlighted: true },
            { name: "Enterprise", price: "$199", period: "/mo", features: ["Everything in Pro", "Dedicated Support", "Unlimited Team", "Custom Integration"], cta: "Contact Us" },
          ] } },
        ],
      }],
    },
  },
  {
    name: "FAQ",
    description: "Frequently asked questions",
    preview: "Q&A Accordion",
    section: {
      width: "container",
      paddingY: "xl",
      styles: { paddingTop: "60px", paddingBottom: "60px", maxWidth: "768px", marginLeft: "auto", marginRight: "auto" },
      containers: [{
        blocks: [
          { _type: "heading-block", data: { text: "Frequently Asked Questions", level: "h2", size: "2xl", weight: "bold", align: "center" }, styles: { fontSize: "36px", textAlign: "center", marginBottom: "32px" } },
          { _type: "faq-block", data: { items: [
            { question: "How does this work?", answer: "It's simple. Sign up, create your project, and start building." },
            { question: "Can I cancel anytime?", answer: "Yes, you can cancel your subscription at any time with no penalty." },
            { question: "Do you offer support?", answer: "We offer 24/7 support via chat and email for all plans." },
            { question: "Is there a free trial?", answer: "Yes! Every plan comes with a 14-day free trial." },
          ] } },
        ],
      }],
    },
  },
  {
    name: "Contact",
    description: "Contact form with info",
    preview: "Form + Contact Details",
    section: {
      width: "container",
      paddingY: "xl",
      styles: { paddingTop: "60px", paddingBottom: "60px" },
      containers: [{
        blocks: [
          { _type: "heading-block", data: { text: "Get In Touch", level: "h2", size: "2xl", weight: "bold", align: "center" }, styles: { fontSize: "36px", textAlign: "center" } },
          { _type: "contact-form-block", data: { heading: "", submitText: "Send Message", fields: [
            { id: "name", type: "text", label: "Name", placeholder: "Your name", required: true },
            { id: "email", type: "email", label: "Email", placeholder: "you@example.com", required: true },
            { id: "subject", type: "text", label: "Subject", placeholder: "What's this about?" },
            { id: "message", type: "textarea", label: "Message", placeholder: "Tell us more...", required: true },
          ] } },
        ],
      }],
    },
  },
  {
    name: "Newsletter",
    description: "Email signup section",
    preview: "Heading + Email Input",
    section: {
      width: "full",
      paddingY: "lg",
      styles: { paddingTop: "48px", paddingBottom: "48px", backgroundColor: "#f8fafc", textAlign: "center" },
      containers: [{
        layout: { type: "flex", direction: "column", align: "center", gap: "md" },
        blocks: [
          { _type: "heading-block", data: { text: "Stay Updated", level: "h3", size: "xl", weight: "bold", align: "center" }, styles: { fontSize: "28px" } },
          { _type: "text-block", data: { content: "Get the latest updates delivered to your inbox.", align: "center" }, styles: { opacity: "0.7" } },
          { _type: "newsletter-block", data: { buttonText: "Subscribe", placeholder: "Enter your email" } },
        ],
      }],
    },
  },
  {
    name: "Team",
    description: "Team members grid",
    preview: "Person | Person | Person",
    section: {
      width: "container",
      paddingY: "xl",
      styles: { paddingTop: "60px", paddingBottom: "60px" },
      containers: [{
        blocks: [
          { _type: "heading-block", data: { text: "Meet Our Team", level: "h2", size: "2xl", weight: "bold", align: "center" }, styles: { fontSize: "36px", textAlign: "center" } },
          { _type: "team-block", data: { members: [
            { name: "Alex Johnson", role: "CEO", image: "", bio: "Leading the vision." },
            { name: "Sam Williams", role: "CTO", image: "", bio: "Building the future." },
            { name: "Jordan Lee", role: "Design Lead", image: "", bio: "Crafting experiences." },
          ] } },
        ],
      }],
    },
  },
  // --- Professional themed sections ---
  {
    name: "Full-Width Image",
    description: "Edge-to-edge image banner",
    preview: "━━━ Image ━━━",
    section: {
      width: "full",
      paddingY: "none",
      styles: { padding: "0" },
      containers: [{
        blocks: [
          { _type: "image-block", data: { src: "", alt: "Banner image", objectFit: "cover" }, styles: { width: "100%", height: "400px", objectFit: "cover" } },
        ],
      }],
    },
  },
  {
    name: "Stats Row",
    description: "Key metrics in a row",
    preview: "100+ | 50K | 99%",
    section: {
      width: "container",
      paddingY: "lg",
      styles: { paddingTop: "48px", paddingBottom: "48px" },
      containers: [{
        layout: { type: "flex", direction: "row", justify: "around", align: "center", gap: "lg" },
        blocks: [
          { _type: "stats-block", data: { items: [
            { value: "100+", label: "Projects Completed" },
            { value: "50K", label: "Happy Customers" },
            { value: "99%", label: "Client Satisfaction" },
            { value: "24/7", label: "Support Available" },
          ] } },
        ],
      }],
    },
  },
  {
    name: "Two Column Text",
    description: "Heading left, text right",
    preview: "H2 Left | Text Right",
    section: {
      width: "container",
      paddingY: "xl",
      styles: { paddingTop: "60px", paddingBottom: "60px" },
      containers: [{
        layout: { type: "flex", direction: "row", align: "start", gap: "xl" },
        blocks: [
          { _type: "heading-block", data: { text: "Why Choose Us", level: "h2", size: "2xl", weight: "bold" }, styles: { fontSize: "36px", fontWeight: "700", width: "40%" } },
          { _type: "text-block", data: { content: "We bring years of expertise and a commitment to excellence. Our approach combines innovative solutions with proven strategies to deliver results that exceed expectations. Every project is handled with meticulous attention to detail." }, styles: { fontSize: "16px", lineHeight: "1.7", width: "60%", opacity: "0.7" } },
        ],
      }],
    },
  },
  {
    name: "Logo Bar",
    description: "Trusted by logos row",
    preview: "Logo | Logo | Logo | Logo",
    section: {
      width: "container",
      paddingY: "md",
      styles: { paddingTop: "32px", paddingBottom: "32px", textAlign: "center" },
      containers: [{
        blocks: [
          { _type: "text-block", data: { content: "Trusted by leading companies", align: "center" }, styles: { fontSize: "13px", textTransform: "uppercase", letterSpacing: "2px", opacity: "0.5", marginBottom: "24px" } },
          { _type: "logo-block", data: { logos: [] } },
        ],
      }],
    },
  },
  {
    name: "Dark CTA",
    description: "Dark background call-to-action",
    preview: "Dark BG + H2 + Button",
    section: {
      width: "full",
      paddingY: "2xl",
      styles: { paddingTop: "80px", paddingBottom: "80px", backgroundColor: "#111827", color: "#ffffff", textAlign: "center" },
      containers: [{
        layout: { type: "flex", direction: "column", align: "center", gap: "md" },
        blocks: [
          { _type: "heading-block", data: { text: "Ready to Transform Your Business?", level: "h2", size: "2xl", weight: "bold", align: "center" }, styles: { fontSize: "40px", fontWeight: "700", color: "#ffffff", maxWidth: "600px" } },
          { _type: "text-block", data: { content: "Join thousands of businesses that trust us to deliver results.", align: "center" }, styles: { fontSize: "18px", color: "rgba(255,255,255,0.6)", maxWidth: "500px" } },
          { _type: "button-block", data: { text: "Get Started Today", variant: "default", size: "lg" } },
        ],
      }],
    },
  },
  {
    name: "Divider",
    description: "Simple horizontal divider",
    preview: "━━━━━━━━━━━━",
    section: {
      width: "container",
      paddingY: "sm",
      styles: { paddingTop: "16px", paddingBottom: "16px" },
      containers: [{
        blocks: [
          { _type: "divider-block", data: {} },
        ],
      }],
    },
  },
  {
    name: "Spacer",
    description: "Vertical whitespace",
    preview: "↕ Space",
    section: {
      width: "full",
      paddingY: "none",
      containers: [{
        blocks: [
          { _type: "spacer-block", data: { height: "lg" }, styles: { height: "80px" } },
        ],
      }],
    },
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

  const [tab, setTab] = React.useState<"elements" | "sections">("elements");

  const handleSectionClick = (template: SectionTemplate) => {
    window.dispatchEvent(
      new CustomEvent("add-section-template", {
        detail: template,
      }),
    );
  };

  return (
    <div className="blocks-library">
      {/* Tabs */}
      <div className="blocks-library-tabs">
        <button
          type="button"
          className="blocks-library-tab"
          data-active={tab === "elements" || undefined}
          onClick={() => setTab("elements")}
        >
          Elements
        </button>
        <button
          type="button"
          className="blocks-library-tab"
          data-active={tab === "sections" || undefined}
          onClick={() => setTab("sections")}
        >
          Sections
        </button>
      </div>

      {/* Search */}
      <div className="blocks-library-search">
        <Search className="size-3.5 shrink-0" />
        <input
          type="text"
          className="blocks-library-search-input"
          placeholder={tab === "elements" ? "Search elements" : "Search sections"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Elements tab */}
      {tab === "elements" && filteredCategories.map(renderCategory)}

      {/* Sections tab */}
      {tab === "sections" && (
        <div className="blocks-library-sections">
          {SECTION_TEMPLATES.filter(
            (s) => !search || s.name.toLowerCase().includes(search.toLowerCase()),
          ).map((template) => (
            <button
              key={template.name}
              type="button"
              className="blocks-library-section-card"
              onClick={() => handleSectionClick(template)}
              title={template.description}
            >
              <div className="blocks-library-section-preview">
                {template.preview}
              </div>
              <span className="blocks-library-section-name">{template.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
