"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  PanelRightOpen,
  Layers,
  Plus,
} from "lucide-react";
import { useUIStore } from "@/lib/stores/ui-store";
import { useHeaders } from "@/lib/hooks/use-headers";
import { useFooters } from "@/lib/hooks/use-footers";
import type {
  Section,
  Container,
  Block,
} from "@/lib/types/section";
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
import { BlockStyleTab, ElementStyleEditor } from "./block-style-tab";
import { SectionSettings } from "@/components/settings/element-settings/section-settings";
import { ContainerSettings } from "@/components/settings/element-settings/container-settings";
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
  // Page-level settings (shown when no element selected)
  pageSettings?: {
    headerId: string | null;
    footerId: string | null;
    onHeaderChange: (id: string | null) => void;
    onFooterChange: (id: string | null) => void;
    tenantId: string;
  };
  // Header/footer data for settings panel when selected
  headerData?: Record<string, unknown> | null;
  onHeaderDataChange?: (data: Record<string, unknown>) => void;
  footerData?: Record<string, unknown> | null;
  onFooterDataChange?: (data: Record<string, unknown>) => void;
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
  pageSettings,
  headerData,
  onHeaderDataChange,
  footerData,
  onFooterDataChange,
}: SettingsPanelProps) {
  const { rightPanelOpen, rightPanelWidth, selectedElement, toggleRightPanel } =
    useUIStore();
  const [panelTab, setPanelTab] = React.useState<
    "style" | "settings" | "interactions"
  >("style");

  // Get the selected element data
  const getSelectedData = React.useCallback(() => {
    if (!selectedElement) return null;

    // Header/footer are not in sections array — use external data
    if (selectedElement.type === "header" && headerData) {
      return { type: "header" as const, data: headerData };
    }
    if (selectedElement.type === "footer" && footerData) {
      return { type: "footer" as const, data: footerData };
    }

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
  }, [sections, selectedElement, headerData, footerData]);

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
            <div className="settings-panel-page-settings">
              <h3 className="settings-panel-page-title">Page Settings</h3>
              {pageSettings && (
                <PageSettingsPanel {...pageSettings} />
              )}
              {!pageSettings && (
                <div className="settings-panel-empty">
                  <Layers className="h-10 w-10 text-(--el-500)/30" />
                  <p className="text-[14px] text-(--el-500)">
                    Select an element to edit
                  </p>
                </div>
              )}
            </div>
          ) : selectedData ? (
            <>
              <div className="settings-panel-sections">
                {/* STYLE TAB — visual CSS properties */}
                {panelTab === "style" && (
                  <>
                    {selectedElement.type === "section" && (
                      <>
                      <ElementStyleEditor
                        styles={(selectedData.data as Section).styles}
                        stylesBefore={(selectedData.data as Section & { stylesBefore?: Record<string, string> }).stylesBefore}
                        stylesAfter={(selectedData.data as Section & { stylesAfter?: Record<string, string> }).stylesAfter}
                        responsive={(selectedData.data as Section & { _responsive?: { tablet?: { styles?: Record<string, string> }; mobile?: { styles?: Record<string, string> } } })._responsive}
                        onStylesChange={(updatedStyles) => {
                          const section = selectedData.data as Section;
                          onSectionChange?.(selectedElement.sectionIndex, {
                            ...section,
                            styles: updatedStyles,
                          });
                        }}
                        onStylesBeforeChange={(updatedStyles) => {
                          const section = selectedData.data as Section;
                          onSectionChange?.(selectedElement.sectionIndex, {
                            ...section,
                            stylesBefore: updatedStyles,
                          } as Section);
                        }}
                        onStylesAfterChange={(updatedStyles) => {
                          const section = selectedData.data as Section;
                          onSectionChange?.(selectedElement.sectionIndex, {
                            ...section,
                            stylesAfter: updatedStyles,
                          } as Section);
                        }}
                        onResponsiveChange={(bp, key, updatedStyles) => {
                          const section = selectedData.data as Section & {
                            _responsive?: Record<string, Record<string, unknown>>;
                          };
                          const prev = section._responsive || {};
                          const bpData = prev[bp] || {};
                          onSectionChange?.(selectedElement.sectionIndex, {
                            ...section,
                            _responsive: {
                              ...prev,
                              [bp]: { ...bpData, [key]: updatedStyles },
                            },
                          } as Section);
                        }}
                      />
                      </>
                    )}
                    {selectedElement.type === "container" && (
                      <>
                      <ElementStyleEditor
                        styles={(selectedData.data as Container).styles}
                        stylesBefore={(selectedData.data as Container & { stylesBefore?: Record<string, string> }).stylesBefore}
                        stylesAfter={(selectedData.data as Container & { stylesAfter?: Record<string, string> }).stylesAfter}
                        responsive={(selectedData.data as Container & { _responsive?: { tablet?: { styles?: Record<string, string> }; mobile?: { styles?: Record<string, string> } } })._responsive}
                        onStylesChange={(updatedStyles) => {
                          const container = selectedData.data as Container;
                          onContainerChange?.(
                            selectedElement.sectionIndex,
                            selectedElement.containerIndex!,
                            { ...container, styles: updatedStyles },
                          );
                        }}
                        onStylesBeforeChange={(updatedStyles) => {
                          const container = selectedData.data as Container;
                          onContainerChange?.(
                            selectedElement.sectionIndex,
                            selectedElement.containerIndex!,
                            { ...container, stylesBefore: updatedStyles } as Container,
                          );
                        }}
                        onStylesAfterChange={(updatedStyles) => {
                          const container = selectedData.data as Container;
                          onContainerChange?.(
                            selectedElement.sectionIndex,
                            selectedElement.containerIndex!,
                            { ...container, stylesAfter: updatedStyles } as Container,
                          );
                        }}
                        onResponsiveChange={(bp, key, updatedStyles) => {
                          const container = selectedData.data as Container & {
                            _responsive?: Record<string, Record<string, unknown>>;
                          };
                          const prev = container._responsive || {};
                          const bpData = prev[bp] || {};
                          onContainerChange?.(
                            selectedElement.sectionIndex,
                            selectedElement.containerIndex!,
                            {
                              ...container,
                              _responsive: {
                                ...prev,
                                [bp]: { ...bpData, [key]: updatedStyles },
                              },
                            } as Container,
                          );
                        }}
                      />
                      </>
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
                    {(selectedElement.type === "header" ||
                      selectedElement.type === "footer") && (
                      <ElementStyleEditor
                        styles={
                          (selectedData.data as Record<string, unknown>)
                            ?.style as Record<string, string> | undefined
                        }
                        onStylesChange={(updatedStyles) => {
                          if (selectedElement.type === "header") {
                            onHeaderDataChange?.({
                              ...(selectedData.data as Record<string, unknown>),
                              style: updatedStyles,
                            });
                          } else {
                            onFooterDataChange?.({
                              ...(selectedData.data as Record<string, unknown>),
                              style: updatedStyles,
                            });
                          }
                        }}
                      />
                    )}
                  </>
                )}

                {/* SETTINGS TAB — block content fields */}
                {panelTab === "settings" && (
                  <>
                    {selectedElement.type === "section" && (
                      <SectionSettings
                        section={selectedData.data as Section}
                        onChange={(updated) =>
                          onSectionChange?.(
                            selectedElement.sectionIndex,
                            updated,
                          )
                        }
                        tab="settings"
                      />
                    )}
                    {selectedElement.type === "container" && (
                      <ContainerSettings
                        container={selectedData.data as Container}
                        onChange={(updated) =>
                          onContainerChange?.(
                            selectedElement.sectionIndex,
                            selectedElement.containerIndex!,
                            updated,
                          )
                        }
                        tab="settings"
                      />
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

// =============================================================================
// Page Settings Panel — shown when no element selected
// =============================================================================

function PageSettingsPanel({
  headerId,
  footerId,
  onHeaderChange,
  onFooterChange,
  tenantId,
}: {
  headerId: string | null;
  footerId: string | null;
  onHeaderChange: (id: string | null) => void;
  onFooterChange: (id: string | null) => void;
  tenantId: string;
}) {
  const headers = useHeaders(tenantId)?.data || [];
  const footers = useFooters(tenantId)?.data || [];

  return (
    <div className="settings-panel-page-controls">
      <div className="settings-panel-page-field">
        <label className="settings-panel-page-label">Header</label>
        <select
          className="settings-panel-page-select"
          value={headerId || "default"}
          onChange={(e) => onHeaderChange(e.target.value === "default" ? null : e.target.value === "none" ? "none" : e.target.value)}
        >
          <option value="default">Default Header</option>
          <option value="none">No Header</option>
          {(headers as Array<{ id: string; name: string }>).map((h) => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
        {headerId && headerId !== "none" && (
          <a href="/headers" className="settings-panel-page-link">
            Edit headers →
          </a>
        )}
      </div>
      <div className="settings-panel-page-field">
        <label className="settings-panel-page-label">Footer</label>
        <select
          className="settings-panel-page-select"
          value={footerId || "default"}
          onChange={(e) => onFooterChange(e.target.value === "default" ? null : e.target.value === "none" ? "none" : e.target.value)}
        >
          <option value="default">Default Footer</option>
          <option value="none">No Footer</option>
          {(footers as Array<{ id: string; name: string }>).map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
        {footerId && footerId !== "none" && (
          <a href="/footers" className="settings-panel-page-link">
            Edit footers →
          </a>
        )}
      </div>
    </div>
  );
}

