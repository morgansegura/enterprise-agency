"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpacingBox } from "@/components/editor/style-panel";
import {
  PanelRightOpen,
  Box,
  Layers,
  Palette,
  Move,
  Grid3X3,
  Settings2,
  EyeOff,
  Plus,
} from "lucide-react";
import { useUIStore } from "@/lib/stores/ui-store";
import { useCurrentBreakpoint } from "@/lib/responsive/context";
import { getResponsiveValue, setResponsiveOverride } from "@/lib/responsive";
import type {
  Section,
  Container,
  Block,
  SectionBackground,
} from "@/lib/types/section";
import {
  SPACING_OPTIONS,
  CONTAINER_WIDTH_OPTIONS,
  SECTION_MIN_HEIGHT_OPTIONS,
  OVERFLOW_OPTIONS,
  BORDER_WIDTH_OPTIONS,
  BORDER_RADIUS_OPTIONS,
  SHADOW_OPTIONS,
} from "@/lib/constants";
import { BackgroundEditor } from "@/components/editors";
import { VisibilityToggles } from "@/components/ui/visibility-toggles";
import { PositionPicker } from "@/components/ui/position-picker";
import {
  PropertySection,
  PropertyRow,
  PropertyToggle,
  PropertySelect,
} from "./components";
import {
  HeadingBlockSettings,
  TextBlockSettings,
  ButtonBlockSettings,
  ImageBlockSettings,
  CardBlockSettings,
  QuoteBlockSettings,
  DividerBlockSettings,
  SpacerBlockSettings,
  ListBlockSettings,
  VideoBlockSettings,
  IconBlockSettings,
  StatsBlockSettings,
  MapBlockSettings,
  EmbedBlockSettings,
  AudioBlockSettings,
  HeroBlockSettings,
  CtaBlockSettings,
  TestimonialBlockSettings,
  PricingBlockSettings,
  TeamBlockSettings,
  AccordionBlockSettings,
  TabsBlockSettings,
  ContactFormBlockSettings,
  NewsletterBlockSettings,
  FeatureGridBlockSettings,
  FaqBlockSettings,
  GenericBlockSettings,
  BlockLinkSettings,
} from "./block-settings";
import { BlockStyleTab, ElementStyleTab } from "./block-style-tab";
import "./settings-panel.css";

// =============================================================================
// Types
// =============================================================================

interface SettingsPanelProps {
  sections: Section[];
  onSectionChange?: (sectionIndex: number, section: Section) => void;
  onContainerChange?: (
    sectionIndex: number,
    containerIndex: number,
    container: Container,
  ) => void;
  onBlockChange?: (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
    block: Block,
  ) => void;
  // Action callbacks for the selected element
  onSectionMoveUp?: (sectionIndex: number) => void;
  onSectionMoveDown?: (sectionIndex: number) => void;
  onSectionDuplicate?: (sectionIndex: number) => void;
  onSectionDelete?: (sectionIndex: number) => void;
  onAddContainer?: (sectionIndex: number) => void;
  onContainerDelete?: (sectionIndex: number, containerIndex: number) => void;
  onBlockMoveUp?: (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
  ) => void;
  onBlockMoveDown?: (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
  ) => void;
  onBlockDuplicate?: (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
  ) => void;
  onBlockDelete?: (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
  ) => void;
}



// =============================================================================
// Settings Panel Component
// =============================================================================

export function SettingsPanel({
  sections,
  onSectionChange,
  onContainerChange,
  onBlockChange,
  onSectionMoveUp: _onSectionMoveUp,
  onSectionMoveDown: _onSectionMoveDown,
  onSectionDuplicate: _onSectionDuplicate,
  onSectionDelete: _onSectionDelete,
  onAddContainer: _onAddContainer,
  onContainerDelete: _onContainerDelete,
  onBlockMoveUp: _onBlockMoveUp,
  onBlockMoveDown: _onBlockMoveDown,
  onBlockDuplicate: _onBlockDuplicate,
  onBlockDelete: _onBlockDelete,
}: SettingsPanelProps) {
  const { rightPanelOpen, rightPanelWidth, selectedElement, toggleRightPanel } =
    useUIStore();
  const [panelTab, setPanelTab] = React.useState<
    "style" | "settings" | "interactions"
  >("style");

  // Get the selected element data
  const getSelectedData = React.useCallback(() => {
    if (!selectedElement) return null;

    const section = sections[selectedElement.sectionIndex];
    if (!section) return null;

    if (selectedElement.type === "section") {
      return { type: "section" as const, data: section };
    }

    if (
      selectedElement.type === "container" &&
      selectedElement.containerIndex !== undefined
    ) {
      const container = section.containers?.[selectedElement.containerIndex];
      return container
        ? { type: "container" as const, data: container, section }
        : null;
    }

    if (
      selectedElement.type === "block" &&
      selectedElement.containerIndex !== undefined &&
      selectedElement.blockIndex !== undefined
    ) {
      const container = section.containers?.[selectedElement.containerIndex];
      const block = container?.blocks?.[selectedElement.blockIndex];
      return block
        ? { type: "block" as const, data: block, container, section }
        : null;
    }

    return null;
  }, [sections, selectedElement]);

  const selectedData = getSelectedData();

  return (
    <div
      className={cn("settings-panel-wrapper", !rightPanelOpen && "collapsed")}
    >
      {/* Toggle button when panel is closed */}
      {!rightPanelOpen && (
        <div className="settings-panel-toggle">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRightPanel}
            title="Open settings panel"
          >
            <PanelRightOpen className="h-4 w-4" />
          </Button>
        </div>
      )}

      <aside
        className={cn("settings-panel", rightPanelOpen && "open")}
        style={{ width: rightPanelWidth }}
      >
        {/* Style / Settings / Interactions tabs */}
        {selectedElement && selectedData && (
          <div className="settings-panel-tab-bar">
            <button
              type="button"
              className="settings-panel-tab-btn"
              data-active={panelTab === "style" || undefined}
              onClick={() => setPanelTab("style")}
            >
              Style
            </button>
            <button
              type="button"
              className="settings-panel-tab-btn"
              data-active={panelTab === "settings" || undefined}
              onClick={() => setPanelTab("settings")}
            >
              Settings
            </button>
            <button
              type="button"
              className="settings-panel-tab-btn"
              data-active={panelTab === "interactions" || undefined}
              onClick={() => setPanelTab("interactions")}
            >
              Interactions
            </button>
          </div>
        )}

        {/* Panel Content */}
        <div className="settings-panel-content">
          {!selectedElement ? (
            <div className="settings-panel-empty">
              <Layers className="h-10 w-10 text-(--el-500)/30" />
              <p className="text-[14px] text-(--el-500)">
                Select an element to edit
              </p>
            </div>
          ) : selectedData ? (
            <>
              <div className="settings-panel-sections">
                {/* STYLE TAB — visual CSS properties */}
                {panelTab === "style" && (
                  <>
                    {selectedElement.type === "section" && (
                      <ElementStyleTab
                        styles={(selectedData.data as Section).styles}
                        onStyleChange={(updatedStyles) => {
                          const section = selectedData.data as Section;
                          onSectionChange?.(selectedElement.sectionIndex, {
                            ...section,
                            styles: updatedStyles,
                          });
                        }}
                      />
                    )}
                    {selectedElement.type === "container" && (
                      <ElementStyleTab
                        styles={(selectedData.data as Container).styles}
                        onStyleChange={(updatedStyles) => {
                          const container = selectedData.data as Container;
                          onContainerChange?.(
                            selectedElement.sectionIndex,
                            selectedElement.containerIndex!,
                            { ...container, styles: updatedStyles },
                          );
                        }}
                      />
                    )}
                    {selectedElement.type === "block" && (
                      <BlockStyleTab
                        block={selectedData.data as Block}
                        onChange={(updated) =>
                          onBlockChange?.(
                            selectedElement.sectionIndex,
                            selectedElement.containerIndex!,
                            selectedElement.blockIndex!,
                            updated,
                          )
                        }
                      />
                    )}
                  </>
                )}

                {/* SETTINGS TAB — block content fields */}
                {panelTab === "settings" && (
                  <>
                    {selectedElement.type === "section" && (
                      <div className="p-4 text-center text-[14px] text-(--el-500)">
                        Section styling is on the Style tab
                      </div>
                    )}
                    {selectedElement.type === "container" && (
                      <div className="p-4 text-center text-[14px] text-(--el-500)">
                        Container styling is on the Style tab
                      </div>
                    )}
                    {selectedElement.type === "block" && (
                      <>
                        <BlockStyleSettings
                          block={selectedData.data as Block}
                          onChange={(updated) =>
                            onBlockChange?.(
                              selectedElement.sectionIndex,
                              selectedElement.containerIndex!,
                              selectedElement.blockIndex!,
                              updated,
                            )
                          }
                        />
                        {/* Link settings — available on every block */}
                        <BlockLinkSettings
                          block={selectedData.data as Block}
                          onChange={(updated) =>
                            onBlockChange?.(
                              selectedElement.sectionIndex,
                              selectedElement.containerIndex!,
                              selectedElement.blockIndex!,
                              updated,
                            )
                          }
                        />
                      </>
                    )}
                  </>
                )}

                {panelTab === "interactions" && (
                  <div className="settings-panel-interactions">
                    <div className="settings-panel-interactions-section">
                      <div className="settings-panel-interactions-header">
                        <span>Element trigger</span>
                        <button className="settings-panel-header-btn" title="Add trigger">
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <div className="settings-panel-interactions-empty">
                        <p>Select an element on the canvas, then add a trigger to animate it on hover, click, or scroll.</p>
                      </div>
                    </div>
                    <div className="settings-panel-interactions-section">
                      <div className="settings-panel-interactions-header">
                        <span>Page trigger</span>
                        <button className="settings-panel-header-btn" title="Add trigger">
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <div className="settings-panel-interactions-empty">
                        <p>Add a trigger for page-level events like load, scroll, or resize.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="settings-panel-empty">
              <p className="text-sm text-(--el-500)">Element not found</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}


function BlockStyleSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  // Component-centric: different settings per block type
  const blockType = block._type;

  // Render type-specific settings with Block Info at the end
  const renderBlockSettings = () => {
    switch (blockType) {
      case "heading-block":
        return <HeadingBlockSettings block={block} onChange={onChange} />;
      case "text-block":
        return <TextBlockSettings block={block} onChange={onChange} />;
      case "button-block":
        return <ButtonBlockSettings block={block} onChange={onChange} />;
      case "image-block":
        return <ImageBlockSettings block={block} onChange={onChange} />;
      case "card-block":
        return <CardBlockSettings block={block} onChange={onChange} />;
      case "quote-block":
        return <QuoteBlockSettings block={block} onChange={onChange} />;
      case "divider-block":
        return <DividerBlockSettings block={block} onChange={onChange} />;
      case "spacer-block":
        return <SpacerBlockSettings block={block} onChange={onChange} />;
      case "list-block":
        return <ListBlockSettings block={block} onChange={onChange} />;
      case "video-block":
        return <VideoBlockSettings block={block} onChange={onChange} />;
      case "icon-block":
        return <IconBlockSettings block={block} onChange={onChange} />;
      case "stats-block":
        return <StatsBlockSettings block={block} onChange={onChange} />;
      case "map-block":
        return <MapBlockSettings block={block} onChange={onChange} />;
      case "embed-block":
        return <EmbedBlockSettings block={block} onChange={onChange} />;
      case "rich-text-block":
        return <TextBlockSettings block={block} onChange={onChange} />;
      case "audio-block":
        return <AudioBlockSettings block={block} onChange={onChange} />;
      case "logo-block":
        return <ImageBlockSettings block={block} onChange={onChange} />;
      case "hero-block":
        return <HeroBlockSettings block={block} onChange={onChange} />;
      case "cta-block":
        return <CtaBlockSettings block={block} onChange={onChange} />;
      case "testimonial-block":
        return <TestimonialBlockSettings block={block} onChange={onChange} />;
      case "pricing-block":
        return <PricingBlockSettings block={block} onChange={onChange} />;
      case "team-block":
        return <TeamBlockSettings block={block} onChange={onChange} />;
      case "accordion-block":
        return <AccordionBlockSettings block={block} onChange={onChange} />;
      case "tabs-block":
        return <TabsBlockSettings block={block} onChange={onChange} />;
      case "contact-form-block":
        return <ContactFormBlockSettings block={block} onChange={onChange} />;
      case "newsletter-block":
        return <NewsletterBlockSettings block={block} onChange={onChange} />;
      case "feature-grid-block":
        return <FeatureGridBlockSettings block={block} onChange={onChange} />;
      case "faq-block":
        return <FaqBlockSettings block={block} onChange={onChange} />;
      case "social-links-block":
      case "logo-bar-block":
      case "columns-block":
      case "container-block":
      case "grid-block":
      case "flex-block":
      case "stack-block":
        return <GenericBlockSettings block={block} onChange={onChange} />;
      default:
        return <GenericBlockSettings block={block} onChange={onChange} />;
    }
  };

  return <>{renderBlockSettings()}</>;
}

