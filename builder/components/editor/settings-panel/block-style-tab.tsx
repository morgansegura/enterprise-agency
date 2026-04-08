"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { ImagePickerField } from "./image-picker-field";
import { ColorPicker } from "./color-picker";
import { SliderInput } from "./slider-input";
import { UnitValueInput } from "./unit-value-input";
import { SpacingEditor } from "./spacing-editor";
import { BorderRadiusEditor } from "./border-radius-editor";
import "./slider-input.css";
import {
  Grid3X3,
  Move,
  Maximize2,
  MapPin,
  Type,
  Palette,
  Square,
  Sparkles,
  Zap,
  MousePointer2,
} from "lucide-react";
import {
  PropertySection,
  PropertyRow,
  PropertyToggle,
  PropertySelect,
} from "./components";
import type { Block } from "@/lib/types/section";
import type { ElementStyles } from "@enterprise/tokens";
import { googleFonts } from "@/lib/fonts/google-fonts";
import { useCurrentBreakpoint } from "@/lib/responsive/context";
import { ShadowBuilder } from "@/components/editors/shadow-builder";
import { TransformBuilder } from "@/components/editors/transform-builder";
import { FilterBuilder } from "@/components/editors/filter-builder";
import { GradientBuilder } from "@/components/editors/gradient-builder";

interface ElementStyleTabProps {
  /** The element's current styles object */
  styles?: ElementStyles;
  /** Called with updated styles */
  onStyleChange: (styles: ElementStyles) => void;
}

interface BlockStyleTabProps {
  block: Block;
  onChange: (block: Block) => void;
}

/**
 * BlockStyleTab — wrapper with Normal/::before/::after toggle + responsive breakpoint
 */
export function BlockStyleTab({ block, onChange }: BlockStyleTabProps) {
  const [mode, setMode] = React.useState<"normal" | "before" | "after">("normal");
  const breakpoint = useCurrentBreakpoint();
  const isResponsive = breakpoint !== "desktop";

  // Get the style key based on mode
  const styleKey = mode === "before" ? "stylesBefore" : mode === "after" ? "stylesAfter" : "styles";

  const getStyles = (): ElementStyles => {
    const blockAny = block as Record<string, unknown>;
    const responsive = blockAny._responsive as Record<string, Record<string, unknown>> | undefined;

    // Base styles (desktop)
    const base = (blockAny[styleKey] as ElementStyles) || {};

    if (!isResponsive) return base;

    // Merge with breakpoint overrides
    const bpOverrides = (responsive?.[breakpoint]?.[styleKey] as ElementStyles) || {};
    return { ...base, ...bpOverrides };
  };

  const handleChange = (updated: ElementStyles) => {
    if (!isResponsive) {
      // Desktop — write directly to block
      onChange({ ...block, [styleKey]: updated });
    } else {
      // Tablet/Mobile — write to _responsive.[breakpoint]
      const blockAny = block as Record<string, unknown>;
      const responsive = (blockAny._responsive as Record<string, Record<string, unknown>>) || {};
      const bpData = responsive[breakpoint] || {};
      onChange({
        ...block,
        _responsive: {
          ...responsive,
          [breakpoint]: {
            ...bpData,
            [styleKey]: updated,
          },
        },
      });
    }
  };

  return (
    <>
      {/* Breakpoint indicator */}
      {isResponsive && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-(--status-info-subtle) text-(--status-info) text-[11px] font-medium">
          <span>Editing: {breakpoint}</span>
          <span className="text-[10px] opacity-60">Changes only apply to this breakpoint</span>
        </div>
      )}
      {/* Mode toggle */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-(--border-default)">
        <button
          type="button"
          className={`px-2.5 py-1 text-[11px] font-medium rounded-[3px] border-none cursor-pointer transition-colors ${mode === "normal" ? "bg-(--accent-primary) text-white" : "bg-transparent text-(--el-500) hover:text-(--el-800)"}`}
          onClick={() => setMode("normal")}
        >
          Normal
        </button>
        <button
          type="button"
          className={`px-2.5 py-1 text-[11px] font-medium rounded-[3px] border-none cursor-pointer transition-colors ${mode === "before" ? "bg-(--accent-primary) text-white" : "bg-transparent text-(--el-500) hover:text-(--el-800)"}`}
          onClick={() => setMode("before")}
        >
          ::before
        </button>
        <button
          type="button"
          className={`px-2.5 py-1 text-[11px] font-medium rounded-[3px] border-none cursor-pointer transition-colors ${mode === "after" ? "bg-(--accent-primary) text-white" : "bg-transparent text-(--el-500) hover:text-(--el-800)"}`}
          onClick={() => setMode("after")}
        >
          ::after
        </button>
      </div>
      {mode !== "normal" && (
        <div className="px-3 py-2 border-b border-(--border-default)">
          <PropertyRow label="Content">
            <Input
              value={(getStyles() as Record<string, string>).content || ""}
              onChange={(e) => handleChange({ ...getStyles(), content: e.target.value })}
              placeholder='""'
              className="w-full h-7 text-xs"
            />
          </PropertyRow>
        </div>
      )}
      <ElementStyleTab
        styles={getStyles()}
        onStyleChange={handleChange}
      />
    </>
  );
}

// =============================================================================
// ElementStyleEditor — Generic wrapper for any element type
// =============================================================================

export interface ElementStyleEditorProps {
  /** Current main element styles */
  styles?: ElementStyles;
  /** ::before pseudo-element styles */
  stylesBefore?: ElementStyles & { content?: string };
  /** ::after pseudo-element styles */
  stylesAfter?: ElementStyles & { content?: string };
  /** Called when main styles change */
  onStylesChange: (styles: ElementStyles) => void;
  /** Called when ::before styles change */
  onStylesBeforeChange?: (
    styles: ElementStyles & { content?: string },
  ) => void;
  /** Called when ::after styles change */
  onStylesAfterChange?: (
    styles: ElementStyles & { content?: string },
  ) => void;
  /** Show the Normal / ::before / ::after toggle (default true) */
  showPseudoElements?: boolean;
}

/**
 * ElementStyleEditor — Reusable style editor for sections, containers, and blocks.
 * Includes pseudo-element mode toggle (::before/::after), responsive breakpoint
 * indicator, and the full ElementStyleTab with all 11 CSS property sections.
 */
export function ElementStyleEditor({
  styles,
  stylesBefore,
  stylesAfter,
  onStylesChange,
  onStylesBeforeChange,
  onStylesAfterChange,
  showPseudoElements = true,
}: ElementStyleEditorProps) {
  const [mode, setMode] = React.useState<"normal" | "before" | "after">(
    "normal",
  );
  const breakpoint = useCurrentBreakpoint();
  const isResponsive = breakpoint !== "desktop";

  const hasPseudo = showPseudoElements && onStylesBeforeChange && onStylesAfterChange;

  const currentStyles =
    mode === "before"
      ? stylesBefore || {}
      : mode === "after"
        ? stylesAfter || {}
        : styles || {};

  const handleChange = (updated: ElementStyles) => {
    if (mode === "before" && onStylesBeforeChange) {
      onStylesBeforeChange(updated as ElementStyles & { content?: string });
    } else if (mode === "after" && onStylesAfterChange) {
      onStylesAfterChange(updated as ElementStyles & { content?: string });
    } else {
      onStylesChange(updated);
    }
  };

  return (
    <>
      {/* Breakpoint indicator */}
      {isResponsive && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-(--status-info-subtle) text-(--status-info) text-[11px] font-medium">
          <span>Editing: {breakpoint}</span>
          <span className="text-[10px] opacity-60">
            Changes only apply to this breakpoint
          </span>
        </div>
      )}
      {/* Mode toggle */}
      {hasPseudo && (
        <div className="flex items-center gap-0.5 px-3 py-2 border-b border-(--border-default)">
          {(["normal", "before", "after"] as const).map((m) => (
            <button
              key={m}
              type="button"
              className={`px-2.5 py-1 text-[11px] font-medium rounded-[3px] border-none cursor-pointer transition-colors ${mode === m ? "bg-(--accent-primary) text-white" : "bg-transparent text-(--el-500) hover:text-(--el-800)"}`}
              onClick={() => setMode(m)}
            >
              {m === "normal" ? "Normal" : `::${m}`}
            </button>
          ))}
        </div>
      )}
      {mode !== "normal" && (
        <div className="px-3 py-2 border-b border-(--border-default)">
          <PropertyRow label="Content">
            <Input
              value={
                (currentStyles as Record<string, string>).content || ""
              }
              onChange={(e) =>
                handleChange({ ...currentStyles, content: e.target.value })
              }
              placeholder='""'
              className="w-full h-7 text-xs"
            />
          </PropertyRow>
        </div>
      )}
      <ElementStyleTab styles={currentStyles} onStyleChange={handleChange} />
    </>
  );
}

/**
 * ElementStyleTab — Full Webflow-level CSS property editor.
 * Works for blocks, containers, and sections.
 * Every CSS property available for direct control.
 */
export function ElementStyleTab({ styles: inputStyles, onStyleChange }: ElementStyleTabProps) {
  const styles: ElementStyles = inputStyles || {};

  const updateStyle = (property: string, value: string) => {
    const cleared = value === "inherit" || value === "" ? undefined : value;
    onStyleChange({ ...styles, [property]: cleared });
  };

  const s = (property: keyof ElementStyles) =>
    (styles[property] as string) || "";

  const displayVal = s("display") || "block";
  const positionVal = s("position") || "static";

  return (
    <>
      {/* ================================================================
       * LAYOUT
       * ================================================================ */}
      <PropertySection title="Layout" icon={<Grid3X3 className="h-3.5 w-3.5" />}>
        <PropertyRow label="Display" stacked>
          <PropertyToggle
            value={displayVal}
            options={[
              { value: "block", label: "Block" },
              { value: "flex", label: "Flex" },
              { value: "grid", label: "Grid" },
              { value: "inline-block", label: "Inline" },
              { value: "none", label: "None" },
            ]}
            onChange={(v) => updateStyle("display", v)}
            fullWidth
          />
        </PropertyRow>

        {/* Flex controls */}
        {displayVal === "flex" && (
          <>
            <PropertyRow label="Direction" stacked>
              <PropertyToggle
                value={s("flexDirection") || "row"}
                options={[
                  { value: "row", label: "→" },
                  { value: "column", label: "↓" },
                  { value: "row-reverse", label: "←" },
                  { value: "column-reverse", label: "↑" },
                ]}
                onChange={(v) => updateStyle("flexDirection", v)}
                fullWidth
              />
            </PropertyRow>
            <PropertyRow label="Wrap" stacked>
              <PropertyToggle
                value={s("flexWrap") || "nowrap"}
                options={[
                  { value: "nowrap", label: "No wrap" },
                  { value: "wrap", label: "Wrap" },
                  { value: "wrap-reverse", label: "Reverse" },
                ]}
                onChange={(v) => updateStyle("flexWrap", v)}
                fullWidth
              />
            </PropertyRow>
            <PropertyRow label="Justify" stacked>
              <PropertyToggle
                value={s("justifyContent") || "flex-start"}
                options={[
                  { value: "flex-start", label: "Start" },
                  { value: "center", label: "Center" },
                  { value: "flex-end", label: "End" },
                  { value: "space-between", label: "Between" },
                  { value: "space-around", label: "Around" },
                ]}
                onChange={(v) => updateStyle("justifyContent", v)}
                fullWidth
              />
            </PropertyRow>
            <PropertyRow label="Align" stacked>
              <PropertyToggle
                value={s("alignItems") || "stretch"}
                options={[
                  { value: "stretch", label: "Stretch" },
                  { value: "flex-start", label: "Start" },
                  { value: "center", label: "Center" },
                  { value: "flex-end", label: "End" },
                  { value: "baseline", label: "Base" },
                ]}
                onChange={(v) => updateStyle("alignItems", v)}
                fullWidth
              />
            </PropertyRow>
            <PropertyRow label="Gap">
              <SliderInput value={s("gap")} onChange={(v) => updateStyle("gap", v)} max={80} placeholder="0px" />
            </PropertyRow>
          </>
        )}

        {/* Grid controls */}
        {displayVal === "grid" && (
          <>
            <PropertyRow label="Columns" stacked>
              <Input value={s("gridTemplateColumns")} onChange={(e) => updateStyle("gridTemplateColumns", e.target.value)} placeholder="1fr 1fr" className="h-7 text-xs" />
            </PropertyRow>
            <PropertyRow label="Rows" stacked>
              <Input value={s("gridTemplateRows")} onChange={(e) => updateStyle("gridTemplateRows", e.target.value)} placeholder="auto" className="h-7 text-xs" />
            </PropertyRow>
            <div className="grid grid-cols-2 gap-2">
              <PropertyRow label="Row Gap">
                <UnitValueInput value={s("rowGap")} onChange={(v) => updateStyle("rowGap", v)} placeholder="0" />
              </PropertyRow>
              <PropertyRow label="Col Gap">
                <UnitValueInput value={s("columnGap")} onChange={(v) => updateStyle("columnGap", v)} placeholder="0" />
              </PropertyRow>
            </div>
          </>
        )}

        {/* Flex child */}
        <PropertyRow label="Align Self">
          <PropertySelect
            value={s("alignSelf")}
            options={[
              { value: "inherit", label: "Auto" },
              { value: "flex-start", label: "Start" },
              { value: "center", label: "Center" },
              { value: "flex-end", label: "End" },
              { value: "stretch", label: "Stretch" },
            ]}
            onChange={(v) => updateStyle("alignSelf", v)}
          />
        </PropertyRow>
        <PropertyRow label="Flex Grow">
          <UnitValueInput value={s("flexGrow")} onChange={(v) => updateStyle("flexGrow", v)} units={[]} placeholder="0" />
        </PropertyRow>
        <PropertyRow label="Flex Shrink">
          <UnitValueInput value={s("flexShrink")} onChange={(v) => updateStyle("flexShrink", v)} units={[]} placeholder="1" />
        </PropertyRow>
        <PropertyRow label="Flex Basis">
          <UnitValueInput value={s("flexBasis")} onChange={(v) => updateStyle("flexBasis", v)} keywords={["auto"]} placeholder="auto" />
        </PropertyRow>
      </PropertySection>

      {/* ================================================================
       * SPACING
       * ================================================================ */}
      <PropertySection title="Spacing" icon={<Move className="h-3.5 w-3.5" />}>
        <SpacingEditor
          marginTop={s("marginTop")}
          marginRight={s("marginRight")}
          marginBottom={s("marginBottom")}
          marginLeft={s("marginLeft")}
          paddingTop={s("paddingTop")}
          paddingRight={s("paddingRight")}
          paddingBottom={s("paddingBottom")}
          paddingLeft={s("paddingLeft")}
          onChange={updateStyle}
        />
      </PropertySection>

      {/* ================================================================
       * SIZE
       * ================================================================ */}
      <PropertySection title="Size" icon={<Maximize2 className="h-3.5 w-3.5" />} defaultOpen={false}>
        {([
          ["width", "Width"],
          ["height", "Height"],
          ["minWidth", "Min Width"],
          ["maxWidth", "Max Width"],
          ["minHeight", "Min Height"],
          ["maxHeight", "Max Height"],
        ] as const).map(([prop, label]) => (
          <PropertyRow key={prop} label={label}>
            <UnitValueInput value={s(prop)} onChange={(v) => updateStyle(prop, v)} keywords={["auto"]} placeholder="auto" />
          </PropertyRow>
        ))}
        <PropertyRow label="Aspect Ratio">
          <UnitValueInput value={s("aspectRatio")} onChange={(v) => updateStyle("aspectRatio", v)} units={[]} keywords={["auto"]} placeholder="auto" />
        </PropertyRow>
        <PropertyRow label="Object Fit">
          <PropertySelect
            value={s("objectFit")}
            options={[
              { value: "inherit", label: "Inherit" },
              { value: "cover", label: "Cover" },
              { value: "contain", label: "Contain" },
              { value: "fill", label: "Fill" },
              { value: "none", label: "None" },
              { value: "scale-down", label: "Scale Down" },
            ]}
            onChange={(v) => updateStyle("objectFit", v)}
          />
        </PropertyRow>
      </PropertySection>

      {/* ================================================================
       * POSITION
       * ================================================================ */}
      <PropertySection title="Position" icon={<MapPin className="h-3.5 w-3.5" />} defaultOpen={false}>
        <PropertyRow label="Position">
          <PropertySelect
            value={positionVal}
            options={[
              { value: "static", label: "Static" },
              { value: "relative", label: "Relative" },
              { value: "absolute", label: "Absolute" },
              { value: "fixed", label: "Fixed" },
              { value: "sticky", label: "Sticky" },
            ]}
            onChange={(v) => updateStyle("position", v)}
          />
        </PropertyRow>
        {positionVal !== "static" && (
          <>
            {(
              [
                ["top", "Top"],
                ["right", "Right"],
                ["bottom", "Bottom"],
                ["left", "Left"],
              ] as const
            ).map(([prop, label]) => (
              <PropertyRow key={prop} label={label}>
                <UnitValueInput value={s(prop)} onChange={(v) => updateStyle(prop, v)} keywords={["auto"]} placeholder="auto" />
              </PropertyRow>
            ))}
          </>
        )}
        <PropertyRow label="Z-Index">
          <UnitValueInput value={s("zIndex")} onChange={(v) => updateStyle("zIndex", v)} units={[]} keywords={["auto"]} placeholder="auto" />
        </PropertyRow>
        <PropertyRow label="Overflow">
          <PropertySelect
            value={s("overflow")}
            options={[
              { value: "inherit", label: "Visible" },
              { value: "hidden", label: "Hidden" },
              { value: "scroll", label: "Scroll" },
              { value: "auto", label: "Auto" },
            ]}
            onChange={(v) => updateStyle("overflow", v)}
          />
        </PropertyRow>
        <PropertyRow label="Float">
          <PropertyToggle
            value={s("float")}
            options={[
              { value: "inherit", label: "None" },
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
            ]}
            onChange={(v) => updateStyle("float", v)}
          />
        </PropertyRow>
      </PropertySection>

      {/* ================================================================
       * TYPOGRAPHY
       * ================================================================ */}
      <PropertySection title="Typography" icon={<Type className="h-3.5 w-3.5" />}>
        <PropertyRow label="Font Family">
          <PropertySelect
            value={s("fontFamily")}
            options={[
              { value: "inherit", label: "Inherit" },
              ...googleFonts.map((f) => ({
                value: `'${f.family}', ${f.category}`,
                label: f.family,
              })),
            ]}
            onChange={(v) => updateStyle("fontFamily", v)}
          />
        </PropertyRow>
        <PropertyRow label="Font Weight">
          <PropertySelect
            value={s("fontWeight")}
            options={[
              { value: "inherit", label: "Inherit" },
              { value: "100", label: "100 - Thin" },
              { value: "200", label: "200 - Extra Light" },
              { value: "300", label: "300 - Light" },
              { value: "400", label: "400 - Normal" },
              { value: "500", label: "500 - Medium" },
              { value: "600", label: "600 - Semibold" },
              { value: "700", label: "700 - Bold" },
              { value: "800", label: "800 - Extra Bold" },
              { value: "900", label: "900 - Black" },
            ]}
            onChange={(v) => updateStyle("fontWeight", v)}
          />
        </PropertyRow>
        <PropertyRow label="Font Size">
          <SliderInput value={s("fontSize")} onChange={(v) => updateStyle("fontSize", v)} min={8} max={120} placeholder="16" />
        </PropertyRow>
        <PropertyRow label="Line Height">
          <SliderInput value={s("lineHeight")} onChange={(v) => updateStyle("lineHeight", v)} min={0.5} max={3} step={0.1} unit="" placeholder="1.5" />
        </PropertyRow>
        <ColorPicker
          label="Text Color"
          value={s("color")}
          onChange={(v) => updateStyle("color", v)}
        />
        <PropertyRow label="Text Align" stacked>
          <PropertyToggle
            value={s("textAlign")}
            options={[
              { value: "inherit", label: "—" },
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
              { value: "justify", label: "Justify" },
            ]}
            onChange={(v) => updateStyle("textAlign", v)}
            fullWidth
          />
        </PropertyRow>
        <PropertyRow label="Font Style">
          <PropertyToggle
            value={s("fontStyle")}
            options={[
              { value: "inherit", label: "Normal" },
              { value: "italic", label: "Italic" },
            ]}
            onChange={(v) => updateStyle("fontStyle", v)}
          />
        </PropertyRow>
        <PropertyRow label="Decoration" stacked>
          <PropertyToggle
            value={s("textDecoration")}
            options={[
              { value: "inherit", label: "None" },
              { value: "underline", label: "U" },
              { value: "line-through", label: "S" },
              { value: "overline", label: "O" },
            ]}
            onChange={(v) => updateStyle("textDecoration", v)}
            fullWidth
          />
        </PropertyRow>
        <PropertyRow label="Text Transform">
          <PropertySelect
            value={s("textTransform")}
            options={[
              { value: "inherit", label: "None" },
              { value: "uppercase", label: "UPPERCASE" },
              { value: "lowercase", label: "lowercase" },
              { value: "capitalize", label: "Capitalize" },
            ]}
            onChange={(v) => updateStyle("textTransform", v)}
          />
        </PropertyRow>
        <PropertyRow label="Letter Spacing">
          <UnitValueInput value={s("letterSpacing")} onChange={(v) => updateStyle("letterSpacing", v)} units={["em", "px", "rem"]} keywords={["normal"]} placeholder="normal" />
        </PropertyRow>
        <PropertyRow label="Word Spacing">
          <UnitValueInput value={s("wordSpacing")} onChange={(v) => updateStyle("wordSpacing", v)} units={["em", "px", "rem"]} keywords={["normal"]} placeholder="normal" />
        </PropertyRow>
        <PropertyRow label="Text Indent">
          <UnitValueInput value={s("textIndent")} onChange={(v) => updateStyle("textIndent", v)} placeholder="0" />
        </PropertyRow>
        <ShadowBuilder
          label="Text Shadow"
          value={s("textShadow")}
          onChange={(v) => updateStyle("textShadow", v)}
        />
        <PropertyRow label="Text Columns">
          <Input value={s("columns")} onChange={(e) => updateStyle("columns", e.target.value)} placeholder="auto" className="w-20 h-7 text-xs text-center" />
        </PropertyRow>
        <PropertyRow label="White Space">
          <PropertySelect
            value={s("whiteSpace")}
            options={[
              { value: "inherit", label: "Normal" },
              { value: "nowrap", label: "No Wrap" },
              { value: "pre", label: "Pre" },
              { value: "pre-wrap", label: "Pre Wrap" },
              { value: "break-spaces", label: "Break" },
            ]}
            onChange={(v) => updateStyle("whiteSpace", v)}
          />
        </PropertyRow>
      </PropertySection>

      {/* ================================================================
       * BACKGROUNDS
       * ================================================================ */}
      <PropertySection title="Background" icon={<Palette className="h-3.5 w-3.5" />} defaultOpen={false}>
        <ColorPicker
          label="Background Color"
          value={s("backgroundColor")}
          onChange={(v) => updateStyle("backgroundColor", v)}
        />
        {/* Image — only show when not a gradient */}
        {!s("backgroundImage")?.includes("gradient") && (
          <ImagePickerField
            value={s("backgroundImage").replace(/^url\(['"]?|['"]?\)$/g, "")}
            onChange={(url) => updateStyle("backgroundImage", url ? `url('${url}')` : "")}
            label="Background Image"
          />
        )}
        {/* Gradient — only show when not a url() image */}
        {!s("backgroundImage")?.includes("url(") && (
          <GradientBuilder
            value={s("backgroundImage")}
            onChange={(v) => updateStyle("backgroundImage", v)}
          />
        )}
        <PropertyRow label="Size">
          <PropertySelect
            value={s("backgroundSize")}
            options={[
              { value: "inherit", label: "Auto" },
              { value: "cover", label: "Cover" },
              { value: "contain", label: "Contain" },
              { value: "100% 100%", label: "Fill" },
            ]}
            onChange={(v) => updateStyle("backgroundSize", v)}
          />
        </PropertyRow>
        <PropertyRow label="Position">
          <PropertySelect
            value={s("backgroundPosition")}
            options={[
              { value: "inherit", label: "Center" },
              { value: "top", label: "Top" },
              { value: "bottom", label: "Bottom" },
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
            ]}
            onChange={(v) => updateStyle("backgroundPosition", v)}
          />
        </PropertyRow>
        <PropertyRow label="Repeat">
          <PropertySelect
            value={s("backgroundRepeat")}
            options={[
              { value: "inherit", label: "Repeat" },
              { value: "no-repeat", label: "No Repeat" },
              { value: "repeat-x", label: "Repeat X" },
              { value: "repeat-y", label: "Repeat Y" },
            ]}
            onChange={(v) => updateStyle("backgroundRepeat", v)}
          />
        </PropertyRow>
        <PropertyRow label="Attachment">
          <PropertyToggle
            value={s("backgroundAttachment")}
            options={[
              { value: "inherit", label: "Scroll" },
              { value: "fixed", label: "Fixed" },
            ]}
            onChange={(v) => updateStyle("backgroundAttachment", v)}
          />
        </PropertyRow>
      </PropertySection>

      {/* ================================================================
       * BORDERS
       * ================================================================ */}
      <PropertySection title="Border" icon={<Square className="h-3.5 w-3.5" />} defaultOpen={false}>
        <PropertyRow label="Border Width">
          <UnitValueInput value={s("borderWidth")} onChange={(v) => updateStyle("borderWidth", v)} placeholder="0" />
        </PropertyRow>
        <PropertyRow label="Border Style">
          <PropertySelect
            value={s("borderStyle") || "inherit"}
            options={[
              { value: "inherit", label: "None" },
              { value: "solid", label: "Solid" },
              { value: "dashed", label: "Dashed" },
              { value: "dotted", label: "Dotted" },
              { value: "double", label: "Double" },
            ]}
            onChange={(v) => updateStyle("borderStyle", v)}
          />
        </PropertyRow>
        <ColorPicker
          label="Border Color"
          value={s("borderColor")}
          onChange={(v) => updateStyle("borderColor", v)}
        />
        {/* Visual 4-corner radius editor */}
        <BorderRadiusEditor
          borderRadius={s("borderRadius")}
          borderTopLeftRadius={s("borderTopLeftRadius")}
          borderTopRightRadius={s("borderTopRightRadius")}
          borderBottomRightRadius={s("borderBottomRightRadius")}
          borderBottomLeftRadius={s("borderBottomLeftRadius")}
          onChange={updateStyle}
        />
        {/* Per-side border widths */}
        {([
          ["borderTopWidth", "Top"],
          ["borderRightWidth", "Right"],
          ["borderBottomWidth", "Bottom"],
          ["borderLeftWidth", "Left"],
        ] as const).map(([prop, label]) => (
          <PropertyRow key={prop} label={label}>
            <UnitValueInput value={s(prop)} onChange={(v) => updateStyle(prop, v)} placeholder="0" />
          </PropertyRow>
        ))}
      </PropertySection>

      {/* ================================================================
       * EFFECTS
       * ================================================================ */}
      <PropertySection title="Effects" icon={<Sparkles className="h-3.5 w-3.5" />} defaultOpen={false}>
        <PropertyRow label="Opacity">
          <div className="flex items-center gap-2 flex-1">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={s("opacity") || "1"}
              onChange={(e) => updateStyle("opacity", e.target.value)}
              className="flex-1 h-1.5 accent-(--accent-primary)"
            />
            <Input value={s("opacity") || "1"} onChange={(e) => updateStyle("opacity", e.target.value)} className="w-14 h-7 text-xs text-center" />
          </div>
        </PropertyRow>
        <ShadowBuilder
          label="Box Shadow"
          value={s("boxShadow")}
          onChange={(v) => updateStyle("boxShadow", v)}
        />
        <PropertyRow label="Blend Mode">
          <PropertySelect
            value={s("mixBlendMode") || "inherit"}
            options={[
              { value: "inherit", label: "Normal" },
              { value: "multiply", label: "Multiply" },
              { value: "screen", label: "Screen" },
              { value: "overlay", label: "Overlay" },
              { value: "darken", label: "Darken" },
              { value: "lighten", label: "Lighten" },
              { value: "color-dodge", label: "Dodge" },
              { value: "color-burn", label: "Burn" },
              { value: "difference", label: "Difference" },
            ]}
            onChange={(v) => updateStyle("mixBlendMode", v)}
          />
        </PropertyRow>
      </PropertySection>

      {/* ================================================================
       * TRANSFORMS
       * ================================================================ */}
      <PropertySection title="Transforms" icon={<Zap className="h-3.5 w-3.5" />} defaultOpen={false}>
        <TransformBuilder
          value={s("transform")}
          onChange={(v) => updateStyle("transform", v)}
        />
        <PropertyRow label="Origin">
          <PropertySelect
            value={s("transformOrigin") || "inherit"}
            options={[
              { value: "inherit", label: "Center" },
              { value: "top left", label: "Top Left" },
              { value: "top center", label: "Top" },
              { value: "top right", label: "Top Right" },
              { value: "center left", label: "Left" },
              { value: "center right", label: "Right" },
              { value: "bottom left", label: "Bottom Left" },
              { value: "bottom center", label: "Bottom" },
              { value: "bottom right", label: "Bottom Right" },
            ]}
            onChange={(v) => updateStyle("transformOrigin", v)}
          />
        </PropertyRow>
      </PropertySection>

      {/* ================================================================
       * TRANSITIONS
       * ================================================================ */}
      <PropertySection title="Transitions" icon={<Zap className="h-3.5 w-3.5" />} defaultOpen={false}>
        <PropertyRow label="Property">
          <PropertySelect
            value={s("transitionProperty") || "inherit"}
            options={[
              { value: "inherit", label: "None" },
              { value: "all", label: "All" },
              { value: "opacity", label: "Opacity" },
              { value: "transform", label: "Transform" },
              { value: "background-color", label: "Background" },
              { value: "color", label: "Color" },
              { value: "box-shadow", label: "Shadow" },
            ]}
            onChange={(v) => updateStyle("transitionProperty", v)}
          />
        </PropertyRow>
        <PropertyRow label="Duration">
          <div className="flex items-center gap-2 flex-1">
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={parseInt(s("transitionDuration") || "0")}
              onChange={(e) => updateStyle("transitionDuration", `${e.target.value}ms`)}
              className="flex-1 h-1.5 accent-(--accent-primary)"
            />
            <Input value={s("transitionDuration") || "0ms"} onChange={(e) => updateStyle("transitionDuration", e.target.value)} className="w-16 h-7 text-xs text-center" />
          </div>
        </PropertyRow>
        <PropertyRow label="Delay">
          <UnitValueInput value={s("transitionDelay")} onChange={(v) => updateStyle("transitionDelay", v)} units={["ms", "s"]} placeholder="0" />
        </PropertyRow>
        <PropertyRow label="Easing">
          <PropertySelect
            value={s("transitionTimingFunction") || "inherit"}
            options={[
              { value: "inherit", label: "Ease" },
              { value: "linear", label: "Linear" },
              { value: "ease-in", label: "Ease In" },
              { value: "ease-out", label: "Ease Out" },
              { value: "ease-in-out", label: "Ease In-Out" },
              { value: "cubic-bezier(0.4,0,0.2,1)", label: "Smooth" },
            ]}
            onChange={(v) => updateStyle("transitionTimingFunction", v)}
          />
        </PropertyRow>
      </PropertySection>

      {/* ================================================================
       * FILTERS
       * ================================================================ */}
      <PropertySection title="Filters" icon={<Sparkles className="h-3.5 w-3.5" />} defaultOpen={false}>
        <FilterBuilder
          label="Element Filter"
          value={s("filter")}
          onChange={(v) => updateStyle("filter", v)}
        />
        <FilterBuilder
          label="Backdrop Filter"
          value={s("backdropFilter")}
          onChange={(v) => updateStyle("backdropFilter", v)}
        />
      </PropertySection>

      {/* ================================================================
       * CURSOR & INTERACTION
       * ================================================================ */}
      <PropertySection title="Cursor" icon={<MousePointer2 className="h-3.5 w-3.5" />} defaultOpen={false}>
        <PropertyRow label="Cursor">
          <PropertySelect
            value={s("cursor")}
            options={[
              { value: "inherit", label: "Auto" },
              { value: "default", label: "Default" },
              { value: "pointer", label: "Pointer" },
              { value: "text", label: "Text" },
              { value: "move", label: "Move" },
              { value: "grab", label: "Grab" },
              { value: "not-allowed", label: "Not Allowed" },
              { value: "crosshair", label: "Crosshair" },
              { value: "none", label: "None" },
            ]}
            onChange={(v) => updateStyle("cursor", v)}
          />
        </PropertyRow>
        <PropertyRow label="Pointer Events">
          <PropertyToggle
            value={s("pointerEvents")}
            options={[
              { value: "inherit", label: "Auto" },
              { value: "none", label: "None" },
            ]}
            onChange={(v) => updateStyle("pointerEvents", v)}
          />
        </PropertyRow>
        <PropertyRow label="User Select">
          <PropertyToggle
            value={s("userSelect")}
            options={[
              { value: "inherit", label: "Auto" },
              { value: "none", label: "None" },
              { value: "all", label: "All" },
            ]}
            onChange={(v) => updateStyle("userSelect", v)}
          />
        </PropertyRow>
      </PropertySection>
    </>
  );
}
