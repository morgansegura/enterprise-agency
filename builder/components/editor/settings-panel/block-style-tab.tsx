"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
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

interface BlockStyleTabProps {
  block: Block;
  onChange: (block: Block) => void;
}

/**
 * BlockStyleTab — Full Webflow-level CSS property editor.
 * Every CSS property available for direct control.
 */
export function BlockStyleTab({ block, onChange }: BlockStyleTabProps) {
  const styles: ElementStyles = (block.styles as ElementStyles) || {};

  const updateStyle = (property: string, value: string) => {
    const updated = {
      ...block,
      styles: { ...styles, [property]: value || undefined },
    };
    onChange(updated);
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
              <Input value={s("gap")} onChange={(e) => updateStyle("gap", e.target.value)} placeholder="0px" className="w-20 h-7 text-xs text-center" />
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
                <Input value={s("rowGap")} onChange={(e) => updateStyle("rowGap", e.target.value)} placeholder="0px" className="w-full h-7 text-xs text-center" />
              </PropertyRow>
              <PropertyRow label="Col Gap">
                <Input value={s("columnGap")} onChange={(e) => updateStyle("columnGap", e.target.value)} placeholder="0px" className="w-full h-7 text-xs text-center" />
              </PropertyRow>
            </div>
          </>
        )}

        {/* Flex child (always available) */}
        <PropertyRow label="Align Self">
          <PropertySelect
            value={s("alignSelf")}
            options={[
              { value: "", label: "Auto" },
              { value: "flex-start", label: "Start" },
              { value: "center", label: "Center" },
              { value: "flex-end", label: "End" },
              { value: "stretch", label: "Stretch" },
            ]}
            onChange={(v) => updateStyle("alignSelf", v)}
          />
        </PropertyRow>
        <div className="grid grid-cols-3 gap-1.5">
          <PropertyRow label="Grow">
            <Input value={s("flexGrow")} onChange={(e) => updateStyle("flexGrow", e.target.value)} placeholder="0" className="w-full h-7 text-xs text-center" />
          </PropertyRow>
          <PropertyRow label="Shrink">
            <Input value={s("flexShrink")} onChange={(e) => updateStyle("flexShrink", e.target.value)} placeholder="1" className="w-full h-7 text-xs text-center" />
          </PropertyRow>
          <PropertyRow label="Basis">
            <Input value={s("flexBasis")} onChange={(e) => updateStyle("flexBasis", e.target.value)} placeholder="auto" className="w-full h-7 text-xs text-center" />
          </PropertyRow>
        </div>
      </PropertySection>

      {/* ================================================================
       * SPACING
       * ================================================================ */}
      <PropertySection title="Spacing" icon={<Move className="h-3.5 w-3.5" />}>
        <div className="space-y-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-(--el-400) font-semibold">Margin</span>
            <div className="grid grid-cols-4 gap-1.5 mt-1">
              {(["marginTop", "marginRight", "marginBottom", "marginLeft"] as const).map((prop) => (
                <div key={prop} className="flex flex-col items-center gap-0.5">
                  <Input value={s(prop)} onChange={(e) => updateStyle(prop, e.target.value)} placeholder="0" className="h-7 text-xs text-center" />
                  <span className="text-[9px] text-(--el-400)">{prop.replace("margin", "")[0]}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-(--el-400) font-semibold">Padding</span>
            <div className="grid grid-cols-4 gap-1.5 mt-1">
              {(["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] as const).map((prop) => (
                <div key={prop} className="flex flex-col items-center gap-0.5">
                  <Input value={s(prop)} onChange={(e) => updateStyle(prop, e.target.value)} placeholder="0" className="h-7 text-xs text-center" />
                  <span className="text-[9px] text-(--el-400)">{prop.replace("padding", "")[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PropertySection>

      {/* ================================================================
       * SIZE
       * ================================================================ */}
      <PropertySection title="Size" icon={<Maximize2 className="h-3.5 w-3.5" />} defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          {([
            ["width", "Width", "auto"],
            ["height", "Height", "auto"],
            ["minWidth", "Min W", "—"],
            ["maxWidth", "Max W", "—"],
            ["minHeight", "Min H", "—"],
            ["maxHeight", "Max H", "—"],
          ] as const).map(([prop, label, placeholder]) => (
            <PropertyRow key={prop} label={label}>
              <Input value={s(prop)} onChange={(e) => updateStyle(prop, e.target.value)} placeholder={placeholder} className="w-full h-7 text-xs text-center" />
            </PropertyRow>
          ))}
        </div>
        <PropertyRow label="Aspect">
          <Input value={s("aspectRatio")} onChange={(e) => updateStyle("aspectRatio", e.target.value)} placeholder="auto" className="w-20 h-7 text-xs text-center" />
        </PropertyRow>
        <PropertyRow label="Object Fit">
          <PropertySelect
            value={s("objectFit")}
            options={[
              { value: "", label: "None" },
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
          <div className="grid grid-cols-2 gap-2">
            {(["top", "right", "bottom", "left"] as const).map((prop) => (
              <PropertyRow key={prop} label={prop.charAt(0).toUpperCase() + prop.slice(1)}>
                <Input value={s(prop)} onChange={(e) => updateStyle(prop, e.target.value)} placeholder="auto" className="w-full h-7 text-xs text-center" />
              </PropertyRow>
            ))}
          </div>
        )}
        <PropertyRow label="Z-Index">
          <Input value={s("zIndex")} onChange={(e) => updateStyle("zIndex", e.target.value)} placeholder="auto" className="w-20 h-7 text-xs text-center" />
        </PropertyRow>
        <PropertyRow label="Overflow">
          <PropertySelect
            value={s("overflow")}
            options={[
              { value: "", label: "Visible" },
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
              { value: "", label: "None" },
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
        <PropertyRow label="Font">
          <PropertySelect
            value={s("fontFamily")}
            options={[
              { value: "", label: "Inherit" },
              { value: "'Inter', sans-serif", label: "Inter" },
              { value: "'Poppins', sans-serif", label: "Poppins" },
              { value: "'DM Sans', sans-serif", label: "DM Sans" },
              { value: "'Plus Jakarta Sans', sans-serif", label: "Jakarta" },
              { value: "'Outfit', sans-serif", label: "Outfit" },
              { value: "'Space Grotesk', sans-serif", label: "Space Grotesk" },
              { value: "'Playfair Display', serif", label: "Playfair" },
              { value: "'Lora', serif", label: "Lora" },
              { value: "'Merriweather', serif", label: "Merriweather" },
              { value: "'Montserrat', sans-serif", label: "Montserrat" },
            ]}
            onChange={(v) => updateStyle("fontFamily", v)}
          />
        </PropertyRow>
        <PropertyRow label="Weight">
          <PropertySelect
            value={s("fontWeight")}
            options={[
              { value: "", label: "Inherit" },
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
        <div className="grid grid-cols-2 gap-2">
          <PropertyRow label="Size">
            <Input value={s("fontSize")} onChange={(e) => updateStyle("fontSize", e.target.value)} placeholder="16px" className="w-full h-7 text-xs text-center" />
          </PropertyRow>
          <PropertyRow label="Height">
            <Input value={s("lineHeight")} onChange={(e) => updateStyle("lineHeight", e.target.value)} placeholder="1.5" className="w-full h-7 text-xs text-center" />
          </PropertyRow>
        </div>
        <PropertyRow label="Color">
          <div className="flex items-center gap-1.5">
            <input type="color" value={s("color") || "#000000"} onChange={(e) => updateStyle("color", e.target.value)} className="w-7 h-7 rounded-[3px] border border-(--border-default) cursor-pointer" />
            <Input value={s("color")} onChange={(e) => updateStyle("color", e.target.value)} placeholder="inherit" className="flex-1 h-7 text-xs" />
          </div>
        </PropertyRow>
        <PropertyRow label="Align" stacked>
          <PropertyToggle
            value={s("textAlign")}
            options={[
              { value: "", label: "—" },
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
              { value: "justify", label: "Justify" },
            ]}
            onChange={(v) => updateStyle("textAlign", v)}
            fullWidth
          />
        </PropertyRow>
        <PropertyRow label="Style">
          <PropertyToggle
            value={s("fontStyle")}
            options={[
              { value: "", label: "Normal" },
              { value: "italic", label: "Italic" },
            ]}
            onChange={(v) => updateStyle("fontStyle", v)}
          />
        </PropertyRow>
        <PropertyRow label="Decor" stacked>
          <PropertyToggle
            value={s("textDecoration")}
            options={[
              { value: "", label: "None" },
              { value: "underline", label: "U" },
              { value: "line-through", label: "S" },
              { value: "overline", label: "O" },
            ]}
            onChange={(v) => updateStyle("textDecoration", v)}
            fullWidth
          />
        </PropertyRow>
        <PropertyRow label="Transform">
          <PropertySelect
            value={s("textTransform")}
            options={[
              { value: "", label: "None" },
              { value: "uppercase", label: "UPPERCASE" },
              { value: "lowercase", label: "lowercase" },
              { value: "capitalize", label: "Capitalize" },
            ]}
            onChange={(v) => updateStyle("textTransform", v)}
          />
        </PropertyRow>
        <div className="grid grid-cols-2 gap-2">
          <PropertyRow label="Spacing">
            <Input value={s("letterSpacing")} onChange={(e) => updateStyle("letterSpacing", e.target.value)} placeholder="normal" className="w-full h-7 text-xs text-center" />
          </PropertyRow>
          <PropertyRow label="Word">
            <Input value={s("wordSpacing")} onChange={(e) => updateStyle("wordSpacing", e.target.value)} placeholder="normal" className="w-full h-7 text-xs text-center" />
          </PropertyRow>
        </div>
        <PropertyRow label="Indent">
          <Input value={s("textIndent")} onChange={(e) => updateStyle("textIndent", e.target.value)} placeholder="0px" className="w-20 h-7 text-xs text-center" />
        </PropertyRow>
        <PropertyRow label="Shadow" stacked>
          <Input value={s("textShadow")} onChange={(e) => updateStyle("textShadow", e.target.value)} placeholder="none" className="h-7 text-xs" />
        </PropertyRow>
        <PropertyRow label="Columns">
          <Input value={s("columns")} onChange={(e) => updateStyle("columns", e.target.value)} placeholder="auto" className="w-20 h-7 text-xs text-center" />
        </PropertyRow>
        <PropertyRow label="White Space">
          <PropertySelect
            value={s("whiteSpace")}
            options={[
              { value: "", label: "Normal" },
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
      <PropertySection title="Backgrounds" icon={<Palette className="h-3.5 w-3.5" />} defaultOpen={false}>
        <PropertyRow label="Color">
          <div className="flex items-center gap-1.5">
            <input type="color" value={s("backgroundColor") || "#ffffff"} onChange={(e) => updateStyle("backgroundColor", e.target.value)} className="w-7 h-7 rounded-[3px] border border-(--border-default) cursor-pointer" />
            <Input value={s("backgroundColor")} onChange={(e) => updateStyle("backgroundColor", e.target.value)} placeholder="transparent" className="flex-1 h-7 text-xs" />
          </div>
        </PropertyRow>
        <PropertyRow label="Image" stacked>
          <Input value={s("backgroundImage")} onChange={(e) => updateStyle("backgroundImage", e.target.value)} placeholder="url(...) or linear-gradient(...)" className="h-7 text-xs" />
        </PropertyRow>
        <div className="grid grid-cols-2 gap-2">
          <PropertyRow label="Size">
            <PropertySelect
              value={s("backgroundSize")}
              options={[
                { value: "", label: "Auto" },
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
                { value: "", label: "Center" },
                { value: "top", label: "Top" },
                { value: "bottom", label: "Bottom" },
                { value: "left", label: "Left" },
                { value: "right", label: "Right" },
              ]}
              onChange={(v) => updateStyle("backgroundPosition", v)}
            />
          </PropertyRow>
        </div>
        <PropertyRow label="Repeat">
          <PropertySelect
            value={s("backgroundRepeat")}
            options={[
              { value: "", label: "Repeat" },
              { value: "no-repeat", label: "No Repeat" },
              { value: "repeat-x", label: "Repeat X" },
              { value: "repeat-y", label: "Repeat Y" },
            ]}
            onChange={(v) => updateStyle("backgroundRepeat", v)}
          />
        </PropertyRow>
        <PropertyRow label="Attach">
          <PropertyToggle
            value={s("backgroundAttachment")}
            options={[
              { value: "", label: "Scroll" },
              { value: "fixed", label: "Fixed" },
            ]}
            onChange={(v) => updateStyle("backgroundAttachment", v)}
          />
        </PropertyRow>
      </PropertySection>

      {/* ================================================================
       * BORDERS
       * ================================================================ */}
      <PropertySection title="Borders" icon={<Square className="h-3.5 w-3.5" />} defaultOpen={false}>
        <PropertyRow label="Width">
          <Input value={s("borderWidth")} onChange={(e) => updateStyle("borderWidth", e.target.value)} placeholder="0px" className="w-20 h-7 text-xs text-center" />
        </PropertyRow>
        <PropertyRow label="Style">
          <PropertySelect
            value={s("borderStyle")}
            options={[
              { value: "", label: "None" },
              { value: "solid", label: "Solid" },
              { value: "dashed", label: "Dashed" },
              { value: "dotted", label: "Dotted" },
              { value: "double", label: "Double" },
              { value: "groove", label: "Groove" },
            ]}
            onChange={(v) => updateStyle("borderStyle", v)}
          />
        </PropertyRow>
        <PropertyRow label="Color">
          <div className="flex items-center gap-1.5">
            <input type="color" value={s("borderColor") || "#000000"} onChange={(e) => updateStyle("borderColor", e.target.value)} className="w-7 h-7 rounded-[3px] border border-(--border-default) cursor-pointer" />
            <Input value={s("borderColor")} onChange={(e) => updateStyle("borderColor", e.target.value)} placeholder="inherit" className="flex-1 h-7 text-xs" />
          </div>
        </PropertyRow>
        <PropertyRow label="Radius">
          <Input value={s("borderRadius")} onChange={(e) => updateStyle("borderRadius", e.target.value)} placeholder="0px" className="w-20 h-7 text-xs text-center" />
        </PropertyRow>
        {/* Per-corner radius */}
        <div className="grid grid-cols-2 gap-1.5">
          {([
            ["borderTopLeftRadius", "TL"],
            ["borderTopRightRadius", "TR"],
            ["borderBottomLeftRadius", "BL"],
            ["borderBottomRightRadius", "BR"],
          ] as const).map(([prop, label]) => (
            <PropertyRow key={prop} label={label}>
              <Input value={s(prop)} onChange={(e) => updateStyle(prop, e.target.value)} placeholder="—" className="w-full h-7 text-xs text-center" />
            </PropertyRow>
          ))}
        </div>
        {/* Per-side borders */}
        <div className="grid grid-cols-2 gap-1.5 mt-2">
          {([
            ["borderTopWidth", "Top W"],
            ["borderRightWidth", "Right W"],
            ["borderBottomWidth", "Bot W"],
            ["borderLeftWidth", "Left W"],
          ] as const).map(([prop, label]) => (
            <PropertyRow key={prop} label={label}>
              <Input value={s(prop)} onChange={(e) => updateStyle(prop, e.target.value)} placeholder="—" className="w-full h-7 text-xs text-center" />
            </PropertyRow>
          ))}
        </div>
      </PropertySection>

      {/* ================================================================
       * EFFECTS
       * ================================================================ */}
      <PropertySection title="Effects" icon={<Sparkles className="h-3.5 w-3.5" />} defaultOpen={false}>
        <PropertyRow label="Opacity">
          <Input value={s("opacity")} onChange={(e) => updateStyle("opacity", e.target.value)} placeholder="1" className="w-20 h-7 text-xs text-center" />
        </PropertyRow>
        <PropertyRow label="Shadow" stacked>
          <Input value={s("boxShadow")} onChange={(e) => updateStyle("boxShadow", e.target.value)} placeholder="0 4px 6px rgba(0,0,0,0.1)" className="h-7 text-xs" />
        </PropertyRow>
        <PropertyRow label="Blend">
          <PropertySelect
            value={s("mixBlendMode")}
            options={[
              { value: "", label: "Normal" },
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
        <PropertyRow label="Transform" stacked>
          <Input value={s("transform")} onChange={(e) => updateStyle("transform", e.target.value)} placeholder="rotate(0deg) scale(1)" className="h-7 text-xs" />
        </PropertyRow>
        <PropertyRow label="Origin">
          <Input value={s("transformOrigin")} onChange={(e) => updateStyle("transformOrigin", e.target.value)} placeholder="center" className="w-28 h-7 text-xs text-center" />
        </PropertyRow>
      </PropertySection>

      {/* ================================================================
       * TRANSITIONS
       * ================================================================ */}
      <PropertySection title="Transitions" icon={<Zap className="h-3.5 w-3.5" />} defaultOpen={false}>
        <PropertyRow label="Property">
          <PropertySelect
            value={s("transitionProperty")}
            options={[
              { value: "", label: "None" },
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
        <div className="grid grid-cols-2 gap-2">
          <PropertyRow label="Duration">
            <Input value={s("transitionDuration")} onChange={(e) => updateStyle("transitionDuration", e.target.value)} placeholder="0ms" className="w-full h-7 text-xs text-center" />
          </PropertyRow>
          <PropertyRow label="Delay">
            <Input value={s("transitionDelay")} onChange={(e) => updateStyle("transitionDelay", e.target.value)} placeholder="0ms" className="w-full h-7 text-xs text-center" />
          </PropertyRow>
        </div>
        <PropertyRow label="Easing">
          <PropertySelect
            value={s("transitionTimingFunction")}
            options={[
              { value: "", label: "Ease" },
              { value: "linear", label: "Linear" },
              { value: "ease-in", label: "Ease In" },
              { value: "ease-out", label: "Ease Out" },
              { value: "ease-in-out", label: "Ease In-Out" },
            ]}
            onChange={(v) => updateStyle("transitionTimingFunction", v)}
          />
        </PropertyRow>
      </PropertySection>

      {/* ================================================================
       * FILTERS
       * ================================================================ */}
      <PropertySection title="Filters" icon={<Sparkles className="h-3.5 w-3.5" />} defaultOpen={false}>
        <PropertyRow label="Filter" stacked>
          <Input value={s("filter")} onChange={(e) => updateStyle("filter", e.target.value)} placeholder="blur(0px) brightness(1)" className="h-7 text-xs" />
        </PropertyRow>
        <PropertyRow label="Backdrop" stacked>
          <Input value={s("backdropFilter")} onChange={(e) => updateStyle("backdropFilter", e.target.value)} placeholder="blur(0px)" className="h-7 text-xs" />
        </PropertyRow>
      </PropertySection>

      {/* ================================================================
       * CURSOR & INTERACTION
       * ================================================================ */}
      <PropertySection title="Cursor" icon={<MousePointer2 className="h-3.5 w-3.5" />} defaultOpen={false}>
        <PropertyRow label="Cursor">
          <PropertySelect
            value={s("cursor")}
            options={[
              { value: "", label: "Auto" },
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
        <PropertyRow label="Pointer">
          <PropertyToggle
            value={s("pointerEvents")}
            options={[
              { value: "", label: "Auto" },
              { value: "none", label: "None" },
            ]}
            onChange={(v) => updateStyle("pointerEvents", v)}
          />
        </PropertyRow>
        <PropertyRow label="Select">
          <PropertyToggle
            value={s("userSelect")}
            options={[
              { value: "", label: "Auto" },
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
