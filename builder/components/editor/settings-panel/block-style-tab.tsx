"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { ImagePickerField } from "./image-picker-field";
import { ColorPicker } from "./color-picker";
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
import { useCurrentBreakpoint } from "@/lib/responsive/context";

// =============================================================================
// Visual Builders — replace raw text inputs with intuitive controls
// =============================================================================

/** Box Shadow Builder — X, Y, Blur, Spread, Color */
function ShadowBuilder({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  // Parse "Xpx Ypx Bpx Spx #color"
  const parts = (value || "").match(
    /(-?\d+)px\s+(-?\d+)px\s+(\d+)px\s+(-?\d+)px\s+(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/,
  );
  const x = parts?.[1] || "0";
  const y = parts?.[2] || "4";
  const blur = parts?.[3] || "6";
  const spread = parts?.[4] || "0";
  const color = parts?.[5] || "rgba(0,0,0,0.1)";

  const build = (nx: string, ny: string, nb: string, ns: string, nc: string) =>
    `${nx}px ${ny}px ${nb}px ${ns}px ${nc}`;

  return (
    <>
      <span className="text-[10px] uppercase tracking-wider text-(--el-400) font-semibold px-0">
        {label}
      </span>
      <PropertyRow label="X">
        <Input value={x} onChange={(e) => onChange(build(e.target.value, y, blur, spread, color))} className="w-16 h-7 text-xs text-center" />
      </PropertyRow>
      <PropertyRow label="Y">
        <Input value={y} onChange={(e) => onChange(build(x, e.target.value, blur, spread, color))} className="w-16 h-7 text-xs text-center" />
      </PropertyRow>
      <PropertyRow label="Blur">
        <Input value={blur} onChange={(e) => onChange(build(x, y, e.target.value, spread, color))} className="w-16 h-7 text-xs text-center" />
      </PropertyRow>
      <PropertyRow label="Spread">
        <Input value={spread} onChange={(e) => onChange(build(x, y, blur, e.target.value, color))} className="w-16 h-7 text-xs text-center" />
      </PropertyRow>
      <PropertyRow label="Color">
        <div className="flex items-center gap-1.5">
          <input type="color" value={color.startsWith("#") ? color : "#000000"} onChange={(e) => onChange(build(x, y, blur, spread, e.target.value))} className="w-7 h-7 rounded-[3px] border border-(--border-default) cursor-pointer" />
          <Input value={color} onChange={(e) => onChange(build(x, y, blur, spread, e.target.value))} className="flex-1 h-7 text-xs" />
        </div>
      </PropertyRow>
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-[11px] text-(--status-error) bg-transparent border-none cursor-pointer hover:underline"
        >
          Remove shadow
        </button>
      )}
    </>
  );
}

/** Transform Builder — individual controls for translate, rotate, scale, skew */
function TransformBuilder({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  // Parse individual transforms
  const getVal = (fn: string, def: string) => {
    const match = (value || "").match(new RegExp(`${fn}\\(([^)]+)\\)`));
    return match?.[1] || def;
  };

  const tx = getVal("translateX", "0px");
  const ty = getVal("translateY", "0px");
  const rotate = getVal("rotate", "0deg");
  const sx = getVal("scaleX", "1");
  const sy = getVal("scaleY", "1");
  const skx = getVal("skewX", "0deg");
  const sky = getVal("skewY", "0deg");

  const build = (ntx: string, nty: string, nr: string, nsx: string, nsy: string, nskx: string, nsky: string) => {
    const parts: string[] = [];
    if (ntx !== "0px") parts.push(`translateX(${ntx})`);
    if (nty !== "0px") parts.push(`translateY(${nty})`);
    if (nr !== "0deg") parts.push(`rotate(${nr})`);
    if (nsx !== "1" || nsy !== "1") parts.push(`scaleX(${nsx}) scaleY(${nsy})`);
    if (nskx !== "0deg") parts.push(`skewX(${nskx})`);
    if (nsky !== "0deg") parts.push(`skewY(${nsky})`);
    return parts.join(" ") || "";
  };

  return (
    <>
      <PropertyRow label="Move X">
        <Input value={tx} onChange={(e) => onChange(build(e.target.value, ty, rotate, sx, sy, skx, sky))} placeholder="0px" className="w-20 h-7 text-xs text-center" />
      </PropertyRow>
      <PropertyRow label="Move Y">
        <Input value={ty} onChange={(e) => onChange(build(tx, e.target.value, rotate, sx, sy, skx, sky))} placeholder="0px" className="w-20 h-7 text-xs text-center" />
      </PropertyRow>
      <PropertyRow label="Rotate">
        <Input value={rotate} onChange={(e) => onChange(build(tx, ty, e.target.value, sx, sy, skx, sky))} placeholder="0deg" className="w-20 h-7 text-xs text-center" />
      </PropertyRow>
      <PropertyRow label="Scale X">
        <Input value={sx} onChange={(e) => onChange(build(tx, ty, rotate, e.target.value, sy, skx, sky))} placeholder="1" className="w-20 h-7 text-xs text-center" />
      </PropertyRow>
      <PropertyRow label="Scale Y">
        <Input value={sy} onChange={(e) => onChange(build(tx, ty, rotate, sx, e.target.value, skx, sky))} placeholder="1" className="w-20 h-7 text-xs text-center" />
      </PropertyRow>
      <PropertyRow label="Skew X">
        <Input value={skx} onChange={(e) => onChange(build(tx, ty, rotate, sx, sy, e.target.value, sky))} placeholder="0deg" className="w-20 h-7 text-xs text-center" />
      </PropertyRow>
      <PropertyRow label="Skew Y">
        <Input value={sky} onChange={(e) => onChange(build(tx, ty, rotate, sx, sy, skx, e.target.value))} placeholder="0deg" className="w-20 h-7 text-xs text-center" />
      </PropertyRow>
    </>
  );
}

/** Filter Builder — sliders for blur, brightness, contrast, saturate, etc. */
function FilterBuilder({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const getVal = (fn: string, def: string) => {
    const match = (value || "").match(new RegExp(`${fn}\\(([^)]+)\\)`));
    return match?.[1] || def;
  };

  const blur = getVal("blur", "0px");
  const brightness = getVal("brightness", "1");
  const contrast = getVal("contrast", "1");
  const saturate = getVal("saturate", "1");
  const grayscale = getVal("grayscale", "0");
  const hueRotate = getVal("hue-rotate", "0deg");

  const build = (nb: string, nbr: string, nc: string, ns: string, ng: string, nh: string) => {
    const parts: string[] = [];
    if (nb !== "0px") parts.push(`blur(${nb})`);
    if (nbr !== "1") parts.push(`brightness(${nbr})`);
    if (nc !== "1") parts.push(`contrast(${nc})`);
    if (ns !== "1") parts.push(`saturate(${ns})`);
    if (ng !== "0") parts.push(`grayscale(${ng})`);
    if (nh !== "0deg") parts.push(`hue-rotate(${nh})`);
    return parts.join(" ") || "";
  };

  return (
    <>
      <span className="text-[10px] uppercase tracking-wider text-(--el-400) font-semibold">
        {label}
      </span>
      <PropertyRow label="Blur">
        <div className="flex items-center gap-2 flex-1">
          <input type="range" min="0" max="20" step="1" value={parseFloat(blur)} onChange={(e) => onChange(build(`${e.target.value}px`, brightness, contrast, saturate, grayscale, hueRotate))} className="flex-1 h-1.5 accent-(--accent-primary)" />
          <Input value={blur} onChange={(e) => onChange(build(e.target.value, brightness, contrast, saturate, grayscale, hueRotate))} className="w-14 h-7 text-xs text-center" />
        </div>
      </PropertyRow>
      <PropertyRow label="Bright">
        <div className="flex items-center gap-2 flex-1">
          <input type="range" min="0" max="2" step="0.05" value={parseFloat(brightness)} onChange={(e) => onChange(build(blur, e.target.value, contrast, saturate, grayscale, hueRotate))} className="flex-1 h-1.5 accent-(--accent-primary)" />
          <Input value={brightness} onChange={(e) => onChange(build(blur, e.target.value, contrast, saturate, grayscale, hueRotate))} className="w-14 h-7 text-xs text-center" />
        </div>
      </PropertyRow>
      <PropertyRow label="Contrast">
        <div className="flex items-center gap-2 flex-1">
          <input type="range" min="0" max="2" step="0.05" value={parseFloat(contrast)} onChange={(e) => onChange(build(blur, brightness, e.target.value, saturate, grayscale, hueRotate))} className="flex-1 h-1.5 accent-(--accent-primary)" />
          <Input value={contrast} onChange={(e) => onChange(build(blur, brightness, e.target.value, saturate, grayscale, hueRotate))} className="w-14 h-7 text-xs text-center" />
        </div>
      </PropertyRow>
      <PropertyRow label="Saturate">
        <div className="flex items-center gap-2 flex-1">
          <input type="range" min="0" max="3" step="0.05" value={parseFloat(saturate)} onChange={(e) => onChange(build(blur, brightness, contrast, e.target.value, grayscale, hueRotate))} className="flex-1 h-1.5 accent-(--accent-primary)" />
          <Input value={saturate} onChange={(e) => onChange(build(blur, brightness, contrast, e.target.value, grayscale, hueRotate))} className="w-14 h-7 text-xs text-center" />
        </div>
      </PropertyRow>
      <PropertyRow label="Grayscale">
        <div className="flex items-center gap-2 flex-1">
          <input type="range" min="0" max="1" step="0.05" value={parseFloat(grayscale)} onChange={(e) => onChange(build(blur, brightness, contrast, saturate, e.target.value, hueRotate))} className="flex-1 h-1.5 accent-(--accent-primary)" />
          <Input value={grayscale} onChange={(e) => onChange(build(blur, brightness, contrast, saturate, e.target.value, hueRotate))} className="w-14 h-7 text-xs text-center" />
        </div>
      </PropertyRow>
      <PropertyRow label="Hue">
        <div className="flex items-center gap-2 flex-1">
          <input type="range" min="0" max="360" step="5" value={parseFloat(hueRotate)} onChange={(e) => onChange(build(blur, brightness, contrast, saturate, grayscale, `${e.target.value}deg`))} className="flex-1 h-1.5 accent-(--accent-primary)" />
          <Input value={hueRotate} onChange={(e) => onChange(build(blur, brightness, contrast, saturate, grayscale, e.target.value))} className="w-14 h-7 text-xs text-center" />
        </div>
      </PropertyRow>
    </>
  );
}


/** Gradient Builder — comprehensive gradient editor with multiple stops */
function GradientBuilder({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const isGradient = value?.includes("gradient");

  interface GradientStop {
    color: string;
    position: number; // 0-100
  }

  const parseStops = (): GradientStop[] => {
    if (!isGradient) return [{ color: "#000000", position: 0 }, { color: "#ffffff", position: 100 }];
    const stopRegex = /(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))\s*(\d+)?%?/g;
    const stops: GradientStop[] = [];
    let match;
    while ((match = stopRegex.exec(value)) !== null) {
      stops.push({ color: match[1], position: match[2] ? parseInt(match[2]) : stops.length === 0 ? 0 : 100 });
    }
    return stops.length >= 2 ? stops : [{ color: "#000000", position: 0 }, { color: "#ffffff", position: 100 }];
  };

  const parseType = () => value?.includes("radial") ? "radial" : "linear";
  const parseAngle = () => {
    const m = value?.match(/(\d+)deg/);
    return m ? m[1] : "180";
  };

  const [enabled, setEnabled] = React.useState(isGradient);
  const [type, setType] = React.useState(parseType);
  const [angle, setAngle] = React.useState(parseAngle);
  const [stops, setStops] = React.useState<GradientStop[]>(parseStops);

  const buildGradient = (t: string, a: string, s: GradientStop[]) => {
    const stopsStr = s.map((st) => `${st.color} ${st.position}%`).join(", ");
    if (t === "radial") return `radial-gradient(circle, ${stopsStr})`;
    return `linear-gradient(${a}deg, ${stopsStr})`;
  };

  const emit = (t: string, a: string, s: GradientStop[]) => {
    onChange(buildGradient(t, a, s));
  };

  const updateStop = (index: number, field: "color" | "position", val: string | number) => {
    const updated = [...stops];
    if (field === "color") updated[index] = { ...updated[index], color: val as string };
    else updated[index] = { ...updated[index], position: val as number };
    setStops(updated);
    emit(type, angle, updated);
  };

  const addStop = () => {
    const mid = Math.round((stops[stops.length - 2]?.position ?? 0 + (stops[stops.length - 1]?.position ?? 100)) / 2);
    const updated = [...stops];
    updated.splice(stops.length - 1, 0, { color: "#888888", position: mid });
    setStops(updated);
    emit(type, angle, updated);
  };

  const removeStop = (index: number) => {
    if (stops.length <= 2) return;
    const updated = stops.filter((_, i) => i !== index);
    setStops(updated);
    emit(type, angle, updated);
  };

  if (!enabled) {
    return (
      <button
        type="button"
        onClick={() => {
          setEnabled(true);
          emit(type, angle, stops);
        }}
        className="text-[11px] text-(--accent-primary) bg-transparent border-none cursor-pointer hover:underline"
      >
        + Add gradient
      </button>
    );
  }

  return (
    <>
      <span className="text-[10px] uppercase tracking-wider text-(--el-400) font-semibold">
        Gradient
      </span>
      {/* Live preview */}
      <div
        className="w-full h-10 rounded-[3px] border border-(--border-default)"
        style={{ background: buildGradient(type, angle, stops) }}
      />
      <PropertyRow label="Type">
        <PropertyToggle
          value={type}
          options={[
            { value: "linear", label: "Linear" },
            { value: "radial", label: "Radial" },
          ]}
          onChange={(v) => { setType(v); emit(v, angle, stops); }}
        />
      </PropertyRow>
      {type === "linear" && (
        <PropertyRow label="Angle">
          <div className="flex items-center gap-2 flex-1">
            <input
              type="range" min="0" max="360" step="5" value={angle}
              onChange={(e) => { setAngle(e.target.value); emit(type, e.target.value, stops); }}
              className="flex-1 h-1.5 accent-(--accent-primary)"
            />
            <span className="text-[11px] text-(--el-500) w-10 text-right">{angle}°</span>
          </div>
        </PropertyRow>
      )}
      {/* Color stops */}
      {stops.map((stop, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <input
            type="color" value={stop.color.startsWith("#") ? stop.color : "#000000"}
            onChange={(e) => updateStop(i, "color", e.target.value)}
            className="w-7 h-7 rounded-[3px] border border-(--border-default) cursor-pointer shrink-0"
          />
          <Input
            value={stop.color}
            onChange={(e) => updateStop(i, "color", e.target.value)}
            className="w-20 h-7 text-xs shrink-0"
          />
          <Input
            value={`${stop.position}`}
            onChange={(e) => updateStop(i, "position", parseInt(e.target.value) || 0)}
            className="w-10 h-7 text-xs text-center shrink-0"
          />
          <span className="text-[10px] text-(--el-400) shrink-0">%</span>
          {stops.length > 2 && (
            <button
              type="button"
              onClick={() => removeStop(i)}
              className="text-[11px] text-(--el-400) hover:text-(--status-error) bg-transparent border-none cursor-pointer"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={addStop}
          className="text-[11px] text-(--accent-primary) bg-transparent border-none cursor-pointer hover:underline"
        >
          + Add stop
        </button>
        <button
          type="button"
          onClick={() => { setEnabled(false); onChange(""); }}
          className="text-[11px] text-(--status-error) bg-transparent border-none cursor-pointer hover:underline"
        >
          Remove
        </button>
      </div>
    </>
  );
}

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
        <PropertyRow label="Grow">
          <Input value={s("flexGrow")} onChange={(e) => updateStyle("flexGrow", e.target.value)} placeholder="0" className="w-16 h-7 text-xs text-center" />
        </PropertyRow>
        <PropertyRow label="Shrink">
          <Input value={s("flexShrink")} onChange={(e) => updateStyle("flexShrink", e.target.value)} placeholder="1" className="w-16 h-7 text-xs text-center" />
        </PropertyRow>
        <PropertyRow label="Basis">
          <Input value={s("flexBasis")} onChange={(e) => updateStyle("flexBasis", e.target.value)} placeholder="auto" className="w-16 h-7 text-xs text-center" />
        </PropertyRow>
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
        {([
          ["width", "Width", "auto"],
          ["height", "Height", "auto"],
          ["minWidth", "Min W", "—"],
          ["maxWidth", "Max W", "—"],
          ["minHeight", "Min H", "—"],
          ["maxHeight", "Max H", "—"],
        ] as const).map(([prop, label, placeholder]) => (
          <PropertyRow key={prop} label={label}>
            <Input value={s(prop)} onChange={(e) => updateStyle(prop, e.target.value)} placeholder={placeholder} className="w-20 h-7 text-xs text-center" />
          </PropertyRow>
        ))}
        <PropertyRow label="Aspect">
          <Input value={s("aspectRatio")} onChange={(e) => updateStyle("aspectRatio", e.target.value)} placeholder="auto" className="w-20 h-7 text-xs text-center" />
        </PropertyRow>
        <PropertyRow label="Object Fit">
          <PropertySelect
            value={s("objectFit")}
            options={[
              { value: "inherit", label: "None" },
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
            {(["top", "right", "bottom", "left"] as const).map((prop) => (
              <PropertyRow key={prop} label={prop.charAt(0).toUpperCase() + prop.slice(1)}>
                <Input value={s(prop)} onChange={(e) => updateStyle(prop, e.target.value)} placeholder="auto" className="w-20 h-7 text-xs text-center" />
              </PropertyRow>
            ))}
          </>
        )}
        <PropertyRow label="Z-Index">
          <Input value={s("zIndex")} onChange={(e) => updateStyle("zIndex", e.target.value)} placeholder="auto" className="w-20 h-7 text-xs text-center" />
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
        <PropertyRow label="Font">
          <PropertySelect
            value={s("fontFamily")}
            options={[
              { value: "inherit", label: "Inherit" },
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
        <PropertyRow label="Size">
          <Input value={s("fontSize")} onChange={(e) => updateStyle("fontSize", e.target.value)} placeholder="16px" className="w-20 h-7 text-xs text-center" />
        </PropertyRow>
        <PropertyRow label="Height">
          <Input value={s("lineHeight")} onChange={(e) => updateStyle("lineHeight", e.target.value)} placeholder="1.5" className="w-20 h-7 text-xs text-center" />
        </PropertyRow>
        <ColorPicker
          label="Color"
          value={s("color")}
          onChange={(v) => updateStyle("color", v)}
        />
        <PropertyRow label="Align" stacked>
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
        <PropertyRow label="Style">
          <PropertyToggle
            value={s("fontStyle")}
            options={[
              { value: "inherit", label: "Normal" },
              { value: "italic", label: "Italic" },
            ]}
            onChange={(v) => updateStyle("fontStyle", v)}
          />
        </PropertyRow>
        <PropertyRow label="Decor" stacked>
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
        <PropertyRow label="Transform">
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
        <PropertyRow label="Spacing">
          <Input value={s("letterSpacing")} onChange={(e) => updateStyle("letterSpacing", e.target.value)} placeholder="normal" className="w-20 h-7 text-xs text-center" />
        </PropertyRow>
        <PropertyRow label="Word">
          <Input value={s("wordSpacing")} onChange={(e) => updateStyle("wordSpacing", e.target.value)} placeholder="normal" className="w-20 h-7 text-xs text-center" />
        </PropertyRow>
        <PropertyRow label="Indent">
          <Input value={s("textIndent")} onChange={(e) => updateStyle("textIndent", e.target.value)} placeholder="0px" className="w-20 h-7 text-xs text-center" />
        </PropertyRow>
        <ShadowBuilder
          label="Text Shadow"
          value={s("textShadow")}
          onChange={(v) => updateStyle("textShadow", v)}
        />
        <PropertyRow label="Columns">
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
      <PropertySection title="Backgrounds" icon={<Palette className="h-3.5 w-3.5" />} defaultOpen={false}>
        <ColorPicker
          label="Color"
          value={s("backgroundColor")}
          onChange={(v) => updateStyle("backgroundColor", v)}
        />
        {/* Image — only show when not a gradient */}
        {!s("backgroundImage")?.includes("gradient") && (
          <ImagePickerField
            value={s("backgroundImage").replace(/^url\(['"]?|['"]?\)$/g, "")}
            onChange={(url) => updateStyle("backgroundImage", url ? `url('${url}')` : "")}
            label="Image"
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
        <PropertyRow label="Attach">
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
      <PropertySection title="Borders" icon={<Square className="h-3.5 w-3.5" />} defaultOpen={false}>
        <PropertyRow label="Width">
          <Input value={s("borderWidth")} onChange={(e) => updateStyle("borderWidth", e.target.value)} placeholder="0px" className="w-20 h-7 text-xs text-center" />
        </PropertyRow>
        <PropertyRow label="Style">
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
          label="Color"
          value={s("borderColor")}
          onChange={(v) => updateStyle("borderColor", v)}
        />
        <PropertyRow label="Radius">
          <Input value={s("borderRadius")} onChange={(e) => updateStyle("borderRadius", e.target.value)} placeholder="0px" className="w-20 h-7 text-xs text-center" />
        </PropertyRow>
        {/* Per-corner radius */}
        {([
          ["borderTopLeftRadius", "Radius TL"],
          ["borderTopRightRadius", "Radius TR"],
          ["borderBottomLeftRadius", "Radius BL"],
          ["borderBottomRightRadius", "Radius BR"],
        ] as const).map(([prop, label]) => (
          <PropertyRow key={prop} label={label}>
            <Input value={s(prop)} onChange={(e) => updateStyle(prop, e.target.value)} placeholder="—" className="w-20 h-7 text-xs text-center" />
          </PropertyRow>
        ))}
        {/* Per-side borders */}
        {([
          ["borderTopWidth", "Top W"],
          ["borderRightWidth", "Right W"],
          ["borderBottomWidth", "Bottom W"],
          ["borderLeftWidth", "Left W"],
        ] as const).map(([prop, label]) => (
          <PropertyRow key={prop} label={label}>
            <Input value={s(prop)} onChange={(e) => updateStyle(prop, e.target.value)} placeholder="—" className="w-20 h-7 text-xs text-center" />
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
          label="Shadow"
          value={s("boxShadow")}
          onChange={(v) => updateStyle("boxShadow", v)}
        />
        <PropertyRow label="Blend">
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
          <Input value={s("transitionDelay")} onChange={(e) => updateStyle("transitionDelay", e.target.value)} placeholder="0ms" className="w-20 h-7 text-xs text-center" />
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
          label="Filter"
          value={s("filter")}
          onChange={(v) => updateStyle("filter", v)}
        />
        <FilterBuilder
          label="Backdrop"
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
        <PropertyRow label="Pointer">
          <PropertyToggle
            value={s("pointerEvents")}
            options={[
              { value: "inherit", label: "Auto" },
              { value: "none", label: "None" },
            ]}
            onChange={(v) => updateStyle("pointerEvents", v)}
          />
        </PropertyRow>
        <PropertyRow label="Select">
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
