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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Rows3, Columns3, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PositionPicker } from "@/components/ui/position-picker";
import { VisibilityToggles } from "@/components/ui/visibility-toggles";
import { ResponsiveField, useResponsiveChange } from "../responsive-field";
import { useCurrentBreakpoint } from "@/lib/responsive/context";
import { getResponsiveValue } from "@/lib/responsive";
import { BackgroundEditor, BorderEditor, type BorderValues } from "@/components/editors";
import type {
  Section,
  Container,
  ContainerLayout,
  SectionBackground,
} from "@/lib/hooks/use-pages";
import {
  SPACING_OPTIONS,
  OVERFLOW_OPTIONS,
  CONTAINER_WIDTH_OPTIONS,
  CONTAINER_MIN_HEIGHT_OPTIONS,
} from "@/lib/constants";

import "./container-settings-popover.css";

type ContainerTab = "layout" | "style" | "advanced";

interface ContainerSettingsPopoverProps {
  /** Container to edit */
  container: Container;
  /** Called when container changes */
  onChange: (container: Container) => void;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** @deprecated Use container prop instead */
  section?: Section;
}

/**
 * Container Settings Popover
 *
 * Three-tab settings panel for container:
 * - Layout: Max Width, Min Height, Content Position, Layout Type, Direction & Gap
 * - Style: Background, Padding, Border, Shadow
 * - Advanced: Visibility, Overflow, CSS Classes
 */
export function ContainerSettingsPopover({
  container,
  onChange,
  children,
  open,
  onOpenChange,
}: ContainerSettingsPopoverProps) {
  const [tab, setTab] = React.useState<ContainerTab>("layout");
  const breakpoint = useCurrentBreakpoint();

  // Get background as object (normalize from string if legacy)
  const getBackground = (): SectionBackground => {
    if (!container?.background) return { type: "none" };
    if (typeof container.background === "string") {
      if (
        container.background === "none" ||
        container.background === "transparent"
      )
        return { type: "none" };
      return { type: "color", color: container.background };
    }
    return container.background;
  };

  const background = getBackground();

  // Container data for responsive handling
  const containerData = (container || {}) as unknown as Record<string, unknown>;

  // Responsive change handler for container
  const handleResponsiveChange = useResponsiveChange(containerData, (data) => {
    onChange({ ...container, ...(data as Partial<Container>) });
  });

  // Get responsive value for a container field
  const getContainerValue = <T,>(field: string, defaultValue: T): T => {
    return (
      getResponsiveValue<T>(containerData, field, breakpoint) ?? defaultValue
    );
  };

  // Layout data for responsive handling
  const layoutData = (container?.layout || {}) as unknown as Record<
    string,
    unknown
  >;

  // Responsive change handler for layout
  const handleLayoutResponsiveChange = useResponsiveChange(
    layoutData,
    (data) => {
      onChange({ ...container, layout: data as unknown as ContainerLayout });
    },
  );

  // Get responsive value for a layout field
  const getLayoutValue = <T,>(field: string, defaultValue: T): T => {
    return getResponsiveValue<T>(layoutData, field, breakpoint) ?? defaultValue;
  };

  const handleContainerChange = (updates: Partial<Container>) => {
    onChange({ ...container, ...updates });
  };

  const handleLayoutChange = (field: string, value: unknown) => {
    onChange({
      ...container,
      layout: {
        ...container.layout,
        [field]: value,
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
                tab === "layout" && "active",
              )}
              onClick={() => setTab("layout")}
            >
              Layout
            </button>
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
                tab === "advanced" && "active",
              )}
              onClick={() => setTab("advanced")}
            >
              Advanced
            </button>
          </div>
        </div>

        <div className="container-settings-content">
          {/* ===================== LAYOUT TAB ===================== */}
          {tab === "layout" && (
            <>
              {/* Max Width & Min Height */}
              <div className="container-settings-section">
                <h4 className="container-settings-section-title">SIZE</h4>
                <div className="container-settings-row">
                  <div className="container-settings-field">
                    <Label className="container-settings-label">
                      Max Width
                    </Label>
                    <Select
                      value={container.maxWidth || "none"}
                      onValueChange={(value) =>
                        handleContainerChange({
                          maxWidth: value as Container["maxWidth"],
                        })
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTAINER_WIDTH_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="container-settings-field">
                    <Label className="container-settings-label">
                      Min Height
                    </Label>
                    <Select
                      value={container.minHeight || "none"}
                      onValueChange={(value) =>
                        handleContainerChange({
                          minHeight: value as Container["minHeight"],
                        })
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTAINER_MIN_HEIGHT_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Content Position */}
              <div className="container-settings-section">
                <h4 className="container-settings-section-title">
                  CONTENT POSITION
                </h4>
                <div className="container-settings-position-row">
                  <PositionPicker
                    horizontal={
                      (container.align as "left" | "center" | "right") || "left"
                    }
                    vertical={
                      (container.verticalAlign as
                        | "top"
                        | "center"
                        | "bottom") || "top"
                    }
                    onChange={(h, v) => {
                      handleContainerChange({
                        align: h,
                        verticalAlign: v,
                      });
                    }}
                  />
                  <div className="container-settings-position-labels">
                    <span className="text-xs text-(--builder-muted-foreground)">
                      {container.verticalAlign || "top"}{" "}
                      {container.align || "left"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Layout Type */}
              <div className="container-settings-section">
                <h4 className="container-settings-section-title">
                  LAYOUT TYPE
                </h4>
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
                          ...container,
                          layout: data as unknown as ContainerLayout,
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
                        <SelectTrigger className="h-8">
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
                          ...container,
                          layout: data as unknown as ContainerLayout,
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
                        <SelectTrigger className="h-8">
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
                  {/* Wrap toggle for flex */}
                  {container.layout?.type === "flex" && (
                    <div className="container-settings-field mt-3">
                      <div className="flex items-center justify-between">
                        <Label className="container-settings-label">
                          Wrap Items
                        </Label>
                        <Switch
                          checked={container.layout?.wrap || false}
                          onCheckedChange={(checked) =>
                            handleLayoutChange("wrap", checked)
                          }
                        />
                      </div>
                    </div>
                  )}
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
                        <SelectTrigger className="h-8">
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
                    <ResponsiveField
                      fieldName="gap"
                      data={layoutData}
                      onChange={(data) =>
                        onChange({
                          ...container,
                          layout: data as unknown as ContainerLayout,
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
                        <SelectTrigger className="h-8">
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
              )}

              {/* Alignment (for flex and grid) */}
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
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="start">Start</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="end">End</SelectItem>
                          <SelectItem value="between">Space Between</SelectItem>
                          <SelectItem value="around">Space Around</SelectItem>
                          <SelectItem value="evenly">Space Evenly</SelectItem>
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
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="start">Start</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="end">End</SelectItem>
                          <SelectItem value="stretch">Stretch</SelectItem>
                          <SelectItem value="baseline">Baseline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ===================== STYLE TAB ===================== */}
          {tab === "style" && (
            <>
              {/* Background */}
              <div className="container-settings-section">
                <BackgroundEditor
                  value={background}
                  onChange={(bg) => handleContainerChange({ background: bg as SectionBackground })}
                  showTitle={true}
                />
              </div>

              {/* Padding */}
              <div className="container-settings-section">
                <h4 className="container-settings-section-title">PADDING</h4>
                <div className="container-settings-row">
                  <ResponsiveField
                    fieldName="paddingX"
                    data={containerData}
                    onChange={(data) =>
                      onChange({
                        ...container,
                        ...(data as Partial<Container>),
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
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SPACING_OPTIONS.slice(0, 7).map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </ResponsiveField>
                  <ResponsiveField
                    fieldName="paddingY"
                    data={containerData}
                    onChange={(data) =>
                      onChange({
                        ...container,
                        ...(data as Partial<Container>),
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
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SPACING_OPTIONS.slice(0, 7).map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </ResponsiveField>
                </div>
              </div>

              {/* Border */}
              <div className="container-settings-section">
                <BorderEditor
                  value={{
                    borderTop: container.borderTop,
                    borderBottom: container.borderBottom,
                    borderLeft: container.borderLeft,
                    borderRight: container.borderRight,
                    borderStyle: container.borderStyle,
                    borderColor: container.borderColor,
                    borderRadius: container.borderRadius,
                    shadow: container.shadow,
                  }}
                  onChange={(values: Partial<BorderValues>) => {
                    Object.entries(values).forEach(([key, value]) => {
                      handleContainerChange({ [key]: value } as Partial<Container>);
                    });
                  }}
                  mode="all"
                  showShadow={true}
                  showTitles={true}
                />
              </div>
            </>
          )}

          {/* ===================== ADVANCED TAB ===================== */}
          {tab === "advanced" && (
            <>
              {/* Visibility */}
              <div className="container-settings-section">
                <h4 className="container-settings-section-title">VISIBILITY</h4>
                <p className="container-settings-help mb-2">
                  Click to hide on specific breakpoints
                </p>
                <VisibilityToggles
                  hideOn={container.hideOn}
                  onChange={(hideOn) => handleContainerChange({ hideOn })}
                />
              </div>

              {/* Overflow */}
              <div className="container-settings-section">
                <h4 className="container-settings-section-title">OVERFLOW</h4>
                <Select
                  value={container.overflow || "visible"}
                  onValueChange={(value) =>
                    handleContainerChange({
                      overflow: value as Container["overflow"],
                    })
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OVERFLOW_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom CSS Classes */}
              <div className="container-settings-section">
                <h4 className="container-settings-section-title">
                  CSS CLASSES
                </h4>
                <Input
                  placeholder="e.g. my-custom-class"
                  className="h-8"
                  value={container.customClasses || ""}
                  onChange={(e) =>
                    handleContainerChange({ customClasses: e.target.value })
                  }
                />
                <p className="container-settings-help">
                  Add custom Tailwind or CSS classes
                </p>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
