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
 * BlockStyleTab — Webflow-style CSS property editor
 *
 * Reads/writes the block.styles object with real CSS values.
 * Every change is reflected live on the canvas via CSS custom properties.
 */
export function BlockStyleTab({ block, onChange }: BlockStyleTabProps) {
  const styles: ElementStyles = (block.styles as ElementStyles) || {};

  const updateStyle = (property: string, value: string) => {
    const updated = {
      ...block,
      styles: {
        ...styles,
        [property]: value || undefined, // Remove empty values
      },
    };
    onChange(updated);
  };

  const getStyle = (property: keyof ElementStyles) =>
    (styles[property] as string) || "";

  return (
    <>
      {/* Layout */}
      <PropertySection
        title="Layout"
        icon={<Grid3X3 className="h-3.5 w-3.5" />}
      >
        <PropertyRow label="Display" stacked>
          <PropertyToggle
            value={getStyle("display") || "block"}
            options={[
              { value: "block", label: "Block" },
              { value: "flex", label: "Flex" },
              { value: "grid", label: "Grid" },
              { value: "none", label: "None" },
            ]}
            onChange={(v) => updateStyle("display", v)}
            fullWidth
          />
        </PropertyRow>

        {getStyle("display") === "flex" && (
          <>
            <PropertyRow label="Direction" stacked>
              <PropertyToggle
                value={getStyle("flexDirection") || "row"}
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
            <PropertyRow label="Justify" stacked>
              <PropertyToggle
                value={getStyle("justifyContent") || "flex-start"}
                options={[
                  { value: "flex-start", label: "Start" },
                  { value: "center", label: "Center" },
                  { value: "flex-end", label: "End" },
                  { value: "space-between", label: "Between" },
                ]}
                onChange={(v) => updateStyle("justifyContent", v)}
                fullWidth
              />
            </PropertyRow>
            <PropertyRow label="Align" stacked>
              <PropertyToggle
                value={getStyle("alignItems") || "stretch"}
                options={[
                  { value: "stretch", label: "Stretch" },
                  { value: "flex-start", label: "Start" },
                  { value: "center", label: "Center" },
                  { value: "flex-end", label: "End" },
                ]}
                onChange={(v) => updateStyle("alignItems", v)}
                fullWidth
              />
            </PropertyRow>
            <PropertyRow label="Gap">
              <Input
                value={getStyle("gap")}
                onChange={(e) => updateStyle("gap", e.target.value)}
                placeholder="0px"
                className="w-20 h-7 text-xs text-center"
              />
            </PropertyRow>
          </>
        )}
      </PropertySection>

      {/* Spacing */}
      <PropertySection
        title="Spacing"
        icon={<Move className="h-3.5 w-3.5" />}
      >
        <div className="space-y-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-(--el-400) font-semibold">
              Margin
            </span>
            <div className="grid grid-cols-4 gap-1.5 mt-1">
              <div className="flex flex-col items-center gap-0.5">
                <Input
                  value={getStyle("marginTop")}
                  onChange={(e) => updateStyle("marginTop", e.target.value)}
                  placeholder="0"
                  className="h-7 text-xs text-center"
                />
                <span className="text-[9px] text-(--el-400)">Top</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Input
                  value={getStyle("marginRight")}
                  onChange={(e) => updateStyle("marginRight", e.target.value)}
                  placeholder="0"
                  className="h-7 text-xs text-center"
                />
                <span className="text-[9px] text-(--el-400)">Right</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Input
                  value={getStyle("marginBottom")}
                  onChange={(e) => updateStyle("marginBottom", e.target.value)}
                  placeholder="0"
                  className="h-7 text-xs text-center"
                />
                <span className="text-[9px] text-(--el-400)">Bottom</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Input
                  value={getStyle("marginLeft")}
                  onChange={(e) => updateStyle("marginLeft", e.target.value)}
                  placeholder="0"
                  className="h-7 text-xs text-center"
                />
                <span className="text-[9px] text-(--el-400)">Left</span>
              </div>
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-(--el-400) font-semibold">
              Padding
            </span>
            <div className="grid grid-cols-4 gap-1.5 mt-1">
              <div className="flex flex-col items-center gap-0.5">
                <Input
                  value={getStyle("paddingTop")}
                  onChange={(e) => updateStyle("paddingTop", e.target.value)}
                  placeholder="0"
                  className="h-7 text-xs text-center"
                />
                <span className="text-[9px] text-(--el-400)">Top</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Input
                  value={getStyle("paddingRight")}
                  onChange={(e) => updateStyle("paddingRight", e.target.value)}
                  placeholder="0"
                  className="h-7 text-xs text-center"
                />
                <span className="text-[9px] text-(--el-400)">Right</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Input
                  value={getStyle("paddingBottom")}
                  onChange={(e) => updateStyle("paddingBottom", e.target.value)}
                  placeholder="0"
                  className="h-7 text-xs text-center"
                />
                <span className="text-[9px] text-(--el-400)">Bottom</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Input
                  value={getStyle("paddingLeft")}
                  onChange={(e) => updateStyle("paddingLeft", e.target.value)}
                  placeholder="0"
                  className="h-7 text-xs text-center"
                />
                <span className="text-[9px] text-(--el-400)">Left</span>
              </div>
            </div>
          </div>
        </div>
      </PropertySection>

      {/* Size */}
      <PropertySection
        title="Size"
        icon={<Maximize2 className="h-3.5 w-3.5" />}
        defaultOpen={false}
      >
        <div className="grid grid-cols-2 gap-2">
          <PropertyRow label="Width">
            <Input
              value={getStyle("width")}
              onChange={(e) => updateStyle("width", e.target.value)}
              placeholder="auto"
              className="w-20 h-7 text-xs text-center"
            />
          </PropertyRow>
          <PropertyRow label="Height">
            <Input
              value={getStyle("height")}
              onChange={(e) => updateStyle("height", e.target.value)}
              placeholder="auto"
              className="w-20 h-7 text-xs text-center"
            />
          </PropertyRow>
          <PropertyRow label="Min W">
            <Input
              value={getStyle("minWidth")}
              onChange={(e) => updateStyle("minWidth", e.target.value)}
              placeholder="—"
              className="w-20 h-7 text-xs text-center"
            />
          </PropertyRow>
          <PropertyRow label="Max W">
            <Input
              value={getStyle("maxWidth")}
              onChange={(e) => updateStyle("maxWidth", e.target.value)}
              placeholder="—"
              className="w-20 h-7 text-xs text-center"
            />
          </PropertyRow>
          <PropertyRow label="Min H">
            <Input
              value={getStyle("minHeight")}
              onChange={(e) => updateStyle("minHeight", e.target.value)}
              placeholder="—"
              className="w-20 h-7 text-xs text-center"
            />
          </PropertyRow>
          <PropertyRow label="Max H">
            <Input
              value={getStyle("maxHeight")}
              onChange={(e) => updateStyle("maxHeight", e.target.value)}
              placeholder="—"
              className="w-20 h-7 text-xs text-center"
            />
          </PropertyRow>
        </div>
      </PropertySection>

      {/* Position */}
      <PropertySection
        title="Position"
        icon={<MapPin className="h-3.5 w-3.5" />}
        defaultOpen={false}
      >
        <PropertyRow label="Position">
          <PropertySelect
            value={getStyle("position") || "static"}
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
        {getStyle("position") &&
          getStyle("position") !== "static" && (
            <div className="grid grid-cols-2 gap-2">
              <PropertyRow label="Top">
                <Input
                  value={getStyle("top")}
                  onChange={(e) => updateStyle("top", e.target.value)}
                  placeholder="auto"
                  className="w-20 h-7 text-xs text-center"
                />
              </PropertyRow>
              <PropertyRow label="Right">
                <Input
                  value={getStyle("right")}
                  onChange={(e) => updateStyle("right", e.target.value)}
                  placeholder="auto"
                  className="w-20 h-7 text-xs text-center"
                />
              </PropertyRow>
              <PropertyRow label="Bottom">
                <Input
                  value={getStyle("bottom")}
                  onChange={(e) => updateStyle("bottom", e.target.value)}
                  placeholder="auto"
                  className="w-20 h-7 text-xs text-center"
                />
              </PropertyRow>
              <PropertyRow label="Left">
                <Input
                  value={getStyle("left")}
                  onChange={(e) => updateStyle("left", e.target.value)}
                  placeholder="auto"
                  className="w-20 h-7 text-xs text-center"
                />
              </PropertyRow>
            </div>
          )}
        <PropertyRow label="Z-Index">
          <Input
            value={getStyle("zIndex")}
            onChange={(e) => updateStyle("zIndex", e.target.value)}
            placeholder="auto"
            className="w-20 h-7 text-xs text-center"
          />
        </PropertyRow>
        <PropertyRow label="Overflow">
          <PropertySelect
            value={getStyle("overflow") || "visible"}
            options={[
              { value: "visible", label: "Visible" },
              { value: "hidden", label: "Hidden" },
              { value: "scroll", label: "Scroll" },
              { value: "auto", label: "Auto" },
            ]}
            onChange={(v) => updateStyle("overflow", v)}
          />
        </PropertyRow>
      </PropertySection>

      {/* Typography */}
      <PropertySection
        title="Typography"
        icon={<Type className="h-3.5 w-3.5" />}
      >
        <PropertyRow label="Font">
          <PropertySelect
            value={getStyle("fontFamily") || ""}
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
            value={getStyle("fontWeight") || ""}
            options={[
              { value: "", label: "Inherit" },
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
            <Input
              value={getStyle("fontSize")}
              onChange={(e) => updateStyle("fontSize", e.target.value)}
              placeholder="16px"
              className="w-full h-7 text-xs text-center"
            />
          </PropertyRow>
          <PropertyRow label="Height">
            <Input
              value={getStyle("lineHeight")}
              onChange={(e) => updateStyle("lineHeight", e.target.value)}
              placeholder="1.5"
              className="w-full h-7 text-xs text-center"
            />
          </PropertyRow>
        </div>
        <PropertyRow label="Color">
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={getStyle("color") || "#000000"}
              onChange={(e) => updateStyle("color", e.target.value)}
              className="w-7 h-7 rounded-[3px] border border-(--border-default) cursor-pointer"
            />
            <Input
              value={getStyle("color")}
              onChange={(e) => updateStyle("color", e.target.value)}
              placeholder="inherit"
              className="flex-1 h-7 text-xs"
            />
          </div>
        </PropertyRow>
        <PropertyRow label="Align" stacked>
          <PropertyToggle
            value={getStyle("textAlign") || ""}
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
        <PropertyRow label="Spacing">
          <Input
            value={getStyle("letterSpacing")}
            onChange={(e) => updateStyle("letterSpacing", e.target.value)}
            placeholder="normal"
            className="w-20 h-7 text-xs text-center"
          />
        </PropertyRow>
        <PropertyRow label="Transform">
          <PropertySelect
            value={getStyle("textTransform") || ""}
            options={[
              { value: "", label: "None" },
              { value: "uppercase", label: "UPPERCASE" },
              { value: "lowercase", label: "lowercase" },
              { value: "capitalize", label: "Capitalize" },
            ]}
            onChange={(v) => updateStyle("textTransform", v)}
          />
        </PropertyRow>
        <PropertyRow label="Decor">
          <PropertyToggle
            value={getStyle("textDecoration") || ""}
            options={[
              { value: "", label: "—" },
              { value: "underline", label: "U" },
              { value: "line-through", label: "S" },
              { value: "overline", label: "O" },
            ]}
            onChange={(v) => updateStyle("textDecoration", v)}
          />
        </PropertyRow>
      </PropertySection>

      {/* Backgrounds */}
      <PropertySection
        title="Backgrounds"
        icon={<Palette className="h-3.5 w-3.5" />}
        defaultOpen={false}
      >
        <PropertyRow label="Color">
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={getStyle("backgroundColor") || "#ffffff"}
              onChange={(e) => updateStyle("backgroundColor", e.target.value)}
              className="w-7 h-7 rounded-[3px] border border-(--border-default) cursor-pointer"
            />
            <Input
              value={getStyle("backgroundColor")}
              onChange={(e) => updateStyle("backgroundColor", e.target.value)}
              placeholder="transparent"
              className="flex-1 h-7 text-xs"
            />
          </div>
        </PropertyRow>
      </PropertySection>

      {/* Borders */}
      <PropertySection
        title="Borders"
        icon={<Square className="h-3.5 w-3.5" />}
        defaultOpen={false}
      >
        <div className="grid grid-cols-2 gap-2">
          <PropertyRow label="Width">
            <Input
              value={getStyle("borderWidth")}
              onChange={(e) => updateStyle("borderWidth", e.target.value)}
              placeholder="0px"
              className="w-full h-7 text-xs text-center"
            />
          </PropertyRow>
          <PropertyRow label="Style">
            <PropertySelect
              value={getStyle("borderStyle") || ""}
              options={[
                { value: "", label: "None" },
                { value: "solid", label: "Solid" },
                { value: "dashed", label: "Dashed" },
                { value: "dotted", label: "Dotted" },
              ]}
              onChange={(v) => updateStyle("borderStyle", v)}
            />
          </PropertyRow>
        </div>
        <PropertyRow label="Color">
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={getStyle("borderColor") || "#000000"}
              onChange={(e) => updateStyle("borderColor", e.target.value)}
              className="w-7 h-7 rounded-[3px] border border-(--border-default) cursor-pointer"
            />
            <Input
              value={getStyle("borderColor")}
              onChange={(e) => updateStyle("borderColor", e.target.value)}
              placeholder="inherit"
              className="flex-1 h-7 text-xs"
            />
          </div>
        </PropertyRow>
        <PropertyRow label="Radius">
          <Input
            value={getStyle("borderRadius")}
            onChange={(e) => updateStyle("borderRadius", e.target.value)}
            placeholder="0px"
            className="w-20 h-7 text-xs text-center"
          />
        </PropertyRow>
      </PropertySection>

      {/* Effects */}
      <PropertySection
        title="Effects"
        icon={<Palette className="h-3.5 w-3.5" />}
        defaultOpen={false}
      >
        <PropertyRow label="Opacity">
          <Input
            value={getStyle("opacity")}
            onChange={(e) => updateStyle("opacity", e.target.value)}
            placeholder="1"
            className="w-20 h-7 text-xs text-center"
          />
        </PropertyRow>
        <PropertyRow label="Shadow" stacked>
          <Input
            value={getStyle("boxShadow")}
            onChange={(e) => updateStyle("boxShadow", e.target.value)}
            placeholder="none"
            className="h-7 text-xs"
          />
        </PropertyRow>
      </PropertySection>
    </>
  );
}
