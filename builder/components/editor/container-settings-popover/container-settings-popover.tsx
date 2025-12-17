"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Rows3, Columns3, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColorPicker } from "@/components/ui/color-picker";
import { ResponsiveField, useResponsiveChange } from "../responsive-field";
import { useCurrentBreakpoint } from "@/lib/responsive/context";
import { getResponsiveValue } from "@/lib/responsive";
import type { Section, ContainerSettings } from "@/lib/hooks/use-pages";

import "./container-settings-popover.css";

type ContainerTab = "style" | "layout";

interface ContainerSettingsPopoverProps {
  section: Section;
  onChange: (section: Section) => void;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Container Settings Popover
 *
 * Three-tab settings panel for container:
 * - Size: Max width, padding
 * - Style: Background, border radius, shadow
 * - Layout: Stack/Flex/Grid settings
 */
export function ContainerSettingsPopover({
  section,
  onChange,
  children,
  open,
  onOpenChange,
}: ContainerSettingsPopoverProps) {
  const [tab, setTab] = React.useState<ContainerTab>("style");
  const breakpoint = useCurrentBreakpoint();

  const container = section.container || {};

  // Container data for responsive handling
  const containerData = container as unknown as Record<string, unknown>;

  // Responsive change handler for container
  const handleResponsiveChange = useResponsiveChange(containerData, (data) => {
    onChange({
      ...section,
      container: data as unknown as ContainerSettings,
    });
  });

  // Get responsive value for a container field
  const getContainerValue = <T,>(field: string, defaultValue: T): T => {
    return (
      getResponsiveValue<T>(containerData, field, breakpoint) ?? defaultValue
    );
  };

  // Layout data for responsive handling
  const layoutData = (container.layout || {}) as unknown as Record<
    string,
    unknown
  >;

  // Responsive change handler for layout
  const handleLayoutResponsiveChange = useResponsiveChange(
    layoutData,
    (data) => {
      onChange({
        ...section,
        container: {
          ...container,
          layout: data as unknown as ContainerSettings["layout"],
        },
      });
    },
  );

  // Get responsive value for a layout field
  const getLayoutValue = <T,>(field: string, defaultValue: T): T => {
    return getResponsiveValue<T>(layoutData, field, breakpoint) ?? defaultValue;
  };

  const handleContainerChange = (updates: Partial<ContainerSettings>) => {
    onChange({
      ...section,
      container: { ...container, ...updates },
    });
  };

  const handleLayoutChange = (field: string, value: unknown) => {
    onChange({
      ...section,
      container: {
        ...container,
        layout: {
          ...container.layout,
          [field]: value,
        },
      },
    });
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="container-settings-popover"
        side="left"
        align="start"
        sideOffset={8}
        collisionPadding={16}
      >
        {/* Tabs */}
        <div className="container-popover-header">
          <div className="container-popover-tabs">
            <button
              className={cn(
                "container-popover-tab",
                tab === "style" && "active",
              )}
              onClick={() => setTab("style")}
            >
              Style
            </button>
            <button
              className={cn(
                "container-popover-tab",
                tab === "layout" && "active",
              )}
              onClick={() => setTab("layout")}
            >
              Layout
            </button>
          </div>
        </div>

        <div className="container-settings-content">
          {/* Style Tab */}
          {tab === "style" && (
            <>
              {/* Background */}
              <div className="container-settings-section">
                <ColorPicker
                  label="Background"
                  value={typeof container.background === "string" ? container.background : "transparent"}
                  onChange={(value) =>
                    handleContainerChange({ background: value })
                  }
                />
              </div>

              {/* Inner Padding */}
              <div className="container-settings-section">
                <h4 className="container-settings-section-title">PADDING</h4>
                <div className="container-settings-row">
                  <ResponsiveField
                    fieldName="paddingX"
                    data={containerData}
                    onChange={(data) =>
                      onChange({
                        ...section,
                        container: data as unknown as ContainerSettings,
                      })
                    }
                    label="Horizontal"
                    className="container-settings-field"
                  >
                    <Select
                      value={getContainerValue("paddingX", "sm")}
                      onValueChange={(value) =>
                        handleResponsiveChange("paddingX", value)
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="xs">XS</SelectItem>
                        <SelectItem value="sm">SM</SelectItem>
                        <SelectItem value="md">MD</SelectItem>
                        <SelectItem value="lg">LG</SelectItem>
                        <SelectItem value="xl">XL</SelectItem>
                      </SelectContent>
                    </Select>
                  </ResponsiveField>
                  <ResponsiveField
                    fieldName="paddingY"
                    data={containerData}
                    onChange={(data) =>
                      onChange({
                        ...section,
                        container: data as unknown as ContainerSettings,
                      })
                    }
                    label="Vertical"
                    className="container-settings-field"
                  >
                    <Select
                      value={getContainerValue("paddingY", "none")}
                      onValueChange={(value) =>
                        handleResponsiveChange("paddingY", value)
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="xs">XS</SelectItem>
                        <SelectItem value="sm">SM</SelectItem>
                        <SelectItem value="md">MD</SelectItem>
                        <SelectItem value="lg">LG</SelectItem>
                        <SelectItem value="xl">XL</SelectItem>
                      </SelectContent>
                    </Select>
                  </ResponsiveField>
                </div>
              </div>

              {/* Border & Shadow */}
              <div className="container-settings-section">
                <h4 className="container-settings-section-title">EFFECTS</h4>
                <div className="container-settings-row">
                  <div className="container-settings-field">
                    <Label className="container-settings-label">
                      Border Radius
                    </Label>
                    <Select
                      value={container.borderRadius || "none"}
                      onValueChange={(value) =>
                        handleContainerChange({ borderRadius: value })
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="md">Medium</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                        <SelectItem value="xl">Extra Large</SelectItem>
                        <SelectItem value="full">Full</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="container-settings-field">
                    <Label className="container-settings-label">Shadow</Label>
                    <Select
                      value={container.shadow || "none"}
                      onValueChange={(value) =>
                        handleContainerChange({ shadow: value })
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="md">Medium</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                        <SelectItem value="xl">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Layout Tab */}
          {tab === "layout" && (
            <>
              {/* Layout Type */}
              <div className="container-settings-section">
                <h4 className="container-settings-section-title">TYPE</h4>
                <div className="container-settings-layout-types">
                  <button
                    className={cn(
                      "container-settings-layout-type",
                      (container.layout?.type || "stack") === "stack" &&
                        "active",
                    )}
                    onClick={() => handleLayoutChange("type", "stack")}
                    title="Stack (vertical)"
                  >
                    <Rows3 className="h-4 w-4" />
                    <span>Stack</span>
                  </button>
                  <button
                    className={cn(
                      "container-settings-layout-type",
                      container.layout?.type === "flex" && "active",
                    )}
                    onClick={() => handleLayoutChange("type", "flex")}
                    title="Flex"
                  >
                    <Columns3 className="h-4 w-4" />
                    <span>Flex</span>
                  </button>
                  <button
                    className={cn(
                      "container-settings-layout-type",
                      container.layout?.type === "grid" && "active",
                    )}
                    onClick={() => handleLayoutChange("type", "grid")}
                    title="Grid"
                  >
                    <Grid3X3 className="h-4 w-4" />
                    <span>Grid</span>
                  </button>
                </div>
              </div>

              {/* Stack/Flex options */}
              {(container.layout?.type === "stack" ||
                container.layout?.type === "flex" ||
                !container.layout?.type) && (
                <div className="container-settings-section">
                  <h4 className="container-settings-section-title">
                    DIRECTION & GAP
                  </h4>
                  <div className="container-settings-row">
                    <ResponsiveField
                      fieldName="direction"
                      data={layoutData}
                      onChange={(data) =>
                        onChange({
                          ...section,
                          container: {
                            ...container,
                            layout:
                              data as unknown as ContainerSettings["layout"],
                          },
                        })
                      }
                      label="Direction"
                      className="container-settings-field"
                    >
                      <Select
                        value={getLayoutValue("direction", "column")}
                        onValueChange={(value) =>
                          handleLayoutResponsiveChange("direction", value)
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="column">Vertical</SelectItem>
                          <SelectItem value="row">Horizontal</SelectItem>
                        </SelectContent>
                      </Select>
                    </ResponsiveField>
                    <ResponsiveField
                      fieldName="gap"
                      data={layoutData}
                      onChange={(data) =>
                        onChange({
                          ...section,
                          container: {
                            ...container,
                            layout:
                              data as unknown as ContainerSettings["layout"],
                          },
                        })
                      }
                      label="Gap"
                      className="container-settings-field"
                    >
                      <Select
                        value={getLayoutValue("gap", "md")}
                        onValueChange={(value) =>
                          handleLayoutResponsiveChange("gap", value)
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="xs">Extra Small</SelectItem>
                          <SelectItem value="sm">Small</SelectItem>
                          <SelectItem value="md">Medium</SelectItem>
                          <SelectItem value="lg">Large</SelectItem>
                          <SelectItem value="xl">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </ResponsiveField>
                  </div>
                </div>
              )}

              {/* Grid options */}
              {container.layout?.type === "grid" && (
                <div className="container-settings-section">
                  <h4 className="container-settings-section-title">GRID</h4>
                  <div className="container-settings-row">
                    <div className="container-settings-field">
                      <Label className="container-settings-label">
                        Columns
                      </Label>
                      <Select
                        value={String(container.layout?.columns || 2)}
                        onValueChange={(value) =>
                          handleLayoutChange(
                            "columns",
                            value === "auto" ? "auto-fit" : parseInt(value),
                          )
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Column</SelectItem>
                          <SelectItem value="2">2 Columns</SelectItem>
                          <SelectItem value="3">3 Columns</SelectItem>
                          <SelectItem value="4">4 Columns</SelectItem>
                          <SelectItem value="auto">Auto-fit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="container-settings-field">
                      <Label className="container-settings-label">Gap</Label>
                      <Select
                        value={container.layout?.gap || "md"}
                        onValueChange={(value) =>
                          handleLayoutChange("gap", value)
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="xs">Extra Small</SelectItem>
                          <SelectItem value="sm">Small</SelectItem>
                          <SelectItem value="md">Medium</SelectItem>
                          <SelectItem value="lg">Large</SelectItem>
                          <SelectItem value="xl">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Alignment */}
              {container.layout?.type && container.layout.type !== "stack" && (
                <div className="container-settings-section">
                  <h4 className="container-settings-section-title">
                    ALIGNMENT
                  </h4>
                  <div className="container-settings-row">
                    <div className="container-settings-field">
                      <Label className="container-settings-label">
                        Justify
                      </Label>
                      <Select
                        value={container.layout?.justify || "start"}
                        onValueChange={(value) =>
                          handleLayoutChange("justify", value)
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="start">Start</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="end">End</SelectItem>
                          <SelectItem value="between">Space Between</SelectItem>
                          <SelectItem value="around">Space Around</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="container-settings-field">
                      <Label className="container-settings-label">Align</Label>
                      <Select
                        value={container.layout?.align || "start"}
                        onValueChange={(value) =>
                          handleLayoutChange("align", value)
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="start">Start</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="end">End</SelectItem>
                          <SelectItem value="stretch">Stretch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
