"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTenantTokens } from "@/lib/hooks/use-tenant-tokens";
import { useParams } from "next/navigation";
import {
  parseAnyColor,
  hsvToRgb,
  hslToRgb,
  rgbToHsv,
  rgbToHsl,
  rgbToHex,
  buildColorOutput,
  type RGB,
  type HSV,
} from "./color-utils";
import "./color-picker.css";

// =============================================================================
// Types
// =============================================================================

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

type InputMode = "hex" | "rgb" | "hsl";

// =============================================================================
// Preset swatches
// =============================================================================

const PRESET_COLORS = [
  "#000000", "#ffffff", "#f8f9fa", "#e9ecef", "#dee2e6",
  "#adb5bd", "#6c757d", "#495057", "#343a40", "#212529",
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
];

// =============================================================================
// Saturation/Value canvas
// =============================================================================

function SaturationCanvas({
  hue,
  saturation,
  brightness,
  onPickSV,
}: {
  hue: number;
  saturation: number;
  brightness: number;
  onPickSV: (s: number, v: number) => void;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const dragging = React.useRef(false);

  // Draw the SV gradient whenever hue changes
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Base hue fill
    const rgb = hsvToRgb(hue, 100, 100);
    ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    ctx.fillRect(0, 0, w, h);

    // White gradient left → right
    const whiteGrad = ctx.createLinearGradient(0, 0, w, 0);
    whiteGrad.addColorStop(0, "rgba(255,255,255,1)");
    whiteGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = whiteGrad;
    ctx.fillRect(0, 0, w, h);

    // Black gradient top → bottom
    const blackGrad = ctx.createLinearGradient(0, 0, 0, h);
    blackGrad.addColorStop(0, "rgba(0,0,0,0)");
    blackGrad.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = blackGrad;
    ctx.fillRect(0, 0, w, h);
  }, [hue]);

  const pickFromEvent = (e: React.MouseEvent | MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    const s = Math.round((x / rect.width) * 100);
    const v = Math.round(100 - (y / rect.height) * 100);
    onPickSV(s, v);
  };

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current) pickFromEvent(e);
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hue]);

  // Marker position
  const markerX = `${saturation}%`;
  const markerY = `${100 - brightness}%`;

  return (
    <div className="color-picker-sv-area">
      <canvas
        ref={canvasRef}
        width={200}
        height={150}
        className="color-picker-sv-canvas"
        onMouseDown={(e) => {
          dragging.current = true;
          pickFromEvent(e);
        }}
      />
      <div
        className="color-picker-sv-marker"
        style={{ left: markerX, top: markerY }}
      />
    </div>
  );
}

// =============================================================================
// Hue slider
// =============================================================================

function HueSlider({
  hue,
  onHueChange,
}: {
  hue: number;
  onHueChange: (h: number) => void;
}) {
  return (
    <div className="color-picker-hue-wrap">
      <input
        type="range"
        min="0"
        max="360"
        value={hue}
        onChange={(e) => onHueChange(parseInt(e.target.value))}
        className="color-picker-hue-slider"
      />
    </div>
  );
}

// =============================================================================
// Color Picker
// =============================================================================

/**
 * Full-spectrum ColorPicker with:
 * - HSV saturation/brightness canvas
 * - Hue slider
 * - Alpha/opacity slider
 * - Hex / RGB / HSL input modes
 * - Theme color swatches (from tenant tokens)
 * - Preset color swatches
 * - Transparent button
 */
export function ColorPicker({ value, onChange, label, className }: ColorPickerProps) {
  const params = useParams();
  const tenantId = params?.id as string;
  const { data: tokens } = useTenantTokens(tenantId);

  // Parse incoming value
  const parsed = React.useMemo(() => parseAnyColor(value), [value]);

  // Local HSV state for smooth dragging (avoids hex rounding issues)
  const [localHsv, setLocalHsv] = React.useState<HSV>(parsed.hsv);
  const [localAlpha, setLocalAlpha] = React.useState(parsed.alpha);
  const [inputMode, setInputMode] = React.useState<InputMode>("hex");

  // Sync external value → local state (only when value changes externally)
  const prevValue = React.useRef(value);
  React.useEffect(() => {
    if (value !== prevValue.current) {
      const p = parseAnyColor(value);
      setLocalHsv(p.hsv);
      setLocalAlpha(p.alpha);
      prevValue.current = value;
    }
  }, [value]);

  // Emit color change
  const emitChange = React.useCallback(
    (hsv: HSV, alpha: number) => {
      const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
      const out = buildColorOutput(rgb, alpha);
      prevValue.current = out;
      onChange(out);
    },
    [onChange],
  );

  // Handlers
  const handleSVChange = (s: number, v: number) => {
    const next = { ...localHsv, s, v };
    setLocalHsv(next);
    emitChange(next, localAlpha);
  };

  const handleHueChange = (h: number) => {
    const next = { ...localHsv, h };
    setLocalHsv(next);
    emitChange(next, localAlpha);
  };

  const handleAlphaChange = (alpha: number) => {
    setLocalAlpha(alpha);
    emitChange(localHsv, alpha);
  };

  const handlePresetClick = (hex: string) => {
    const p = parseAnyColor(hex);
    setLocalHsv(p.hsv);
    emitChange(p.hsv, localAlpha);
  };

  // Current RGB/HSL for input display
  const currentRgb = hsvToRgb(localHsv.h, localHsv.s, localHsv.v);
  const currentHex = rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b);
  const currentHsl = rgbToHsl(currentRgb.r, currentRgb.g, currentRgb.b);

  // Handle direct text input
  const handleTextInput = (raw: string) => {
    // Try to parse whatever they type
    if (!raw) return;
    const p = parseAnyColor(raw);
    // Only update if it's a valid color (not the black fallback for garbage input)
    if (raw.startsWith("#") || raw.startsWith("rgb") || raw.startsWith("hsl")) {
      setLocalHsv(p.hsv);
      setLocalAlpha(p.alpha);
      prevValue.current = raw;
      onChange(raw);
    }
  };

  // RGB input handlers
  const handleRgbInput = (channel: "r" | "g" | "b", val: string) => {
    const n = Math.max(0, Math.min(255, parseInt(val) || 0));
    const rgb: RGB = { ...currentRgb, [channel]: n };
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    setLocalHsv(hsv);
    emitChange(hsv, localAlpha);
  };

  // HSL input handlers
  const handleHslInput = (
    channel: "h" | "s" | "l",
    val: string,
  ) => {
    const max = channel === "h" ? 360 : 100;
    const n = Math.max(0, Math.min(max, parseInt(val) || 0));
    const hsl = { ...currentHsl, [channel]: n };
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    setLocalHsv(hsv);
    emitChange(hsv, localAlpha);
  };

  // Theme colors
  const themeColors = React.useMemo(() => {
    const colors: Array<{ name: string; hex: string }> = [];
    const t = (tokens?.colors ?? {}) as Record<string, unknown>;
    if (t.primaryHex)
      colors.push({ name: "Primary", hex: t.primaryHex as string });
    if (t.accentHex)
      colors.push({ name: "Accent", hex: t.accentHex as string });
    if (t.background)
      colors.push({ name: "BG", hex: t.background as string });
    if (t.foreground)
      colors.push({ name: "FG", hex: t.foreground as string });
    if (t.borderColor)
      colors.push({ name: "Border", hex: t.borderColor as string });
    return colors;
  }, [tokens]);

  return (
    <div className={className ? `color-picker-field ${className}` : "color-picker-field"}>
      {label && <span className="color-picker-label">{label}</span>}
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="color-picker-trigger">
            <div
              className="color-picker-swatch"
              style={{ backgroundColor: value || "transparent" }}
            />
            <span className="color-picker-value">{value || "none"}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="color-picker-popover"
          sideOffset={4}
        >
          {/* SV Canvas */}
          <SaturationCanvas
            hue={localHsv.h}
            saturation={localHsv.s}
            brightness={localHsv.v}
            onPickSV={handleSVChange}
          />

          {/* Hue slider */}
          <HueSlider hue={localHsv.h} onHueChange={handleHueChange} />

          {/* Alpha slider */}
          <div className="color-picker-alpha">
            <span className="color-picker-alpha-label">Opacity</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={localAlpha}
              onChange={(e) =>
                handleAlphaChange(parseFloat(e.target.value))
              }
              className="color-picker-alpha-slider"
            />
            <span className="color-picker-alpha-value">
              {Math.round(localAlpha * 100)}%
            </span>
          </div>

          {/* Input mode toggle + value input */}
          <div className="color-picker-input-row">
            <div className="color-picker-mode-toggle">
              {(["hex", "rgb", "hsl"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`color-picker-mode-btn ${inputMode === mode ? "is-active" : ""}`}
                  onClick={() => setInputMode(mode)}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>

            {inputMode === "hex" && (
              <Input
                value={currentHex}
                onChange={(e) => handleTextInput(e.target.value)}
                placeholder="#000000"
                className="color-picker-text-input"
              />
            )}
            {inputMode === "rgb" && (
              <div className="color-picker-channel-inputs">
                <Input
                  type="number"
                  min={0}
                  max={255}
                  value={currentRgb.r}
                  onChange={(e) => handleRgbInput("r", e.target.value)}
                  className="color-picker-channel-input"
                />
                <Input
                  type="number"
                  min={0}
                  max={255}
                  value={currentRgb.g}
                  onChange={(e) => handleRgbInput("g", e.target.value)}
                  className="color-picker-channel-input"
                />
                <Input
                  type="number"
                  min={0}
                  max={255}
                  value={currentRgb.b}
                  onChange={(e) => handleRgbInput("b", e.target.value)}
                  className="color-picker-channel-input"
                />
              </div>
            )}
            {inputMode === "hsl" && (
              <div className="color-picker-channel-inputs">
                <Input
                  type="number"
                  min={0}
                  max={360}
                  value={currentHsl.h}
                  onChange={(e) => handleHslInput("h", e.target.value)}
                  className="color-picker-channel-input"
                />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={currentHsl.s}
                  onChange={(e) => handleHslInput("s", e.target.value)}
                  className="color-picker-channel-input"
                />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={currentHsl.l}
                  onChange={(e) => handleHslInput("l", e.target.value)}
                  className="color-picker-channel-input"
                />
              </div>
            )}
          </div>

          {/* Theme colors */}
          {themeColors.length > 0 && (
            <div className="color-picker-section">
              <span className="color-picker-section-label">Theme</span>
              <div className="color-picker-swatches">
                {themeColors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    className="color-picker-swatch-btn"
                    style={{ backgroundColor: c.hex }}
                    onClick={() => handlePresetClick(c.hex)}
                    title={`${c.name}: ${c.hex}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Preset colors */}
          <div className="color-picker-section">
            <span className="color-picker-section-label">Presets</span>
            <div className="color-picker-swatches">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="color-picker-swatch-btn"
                  style={{ backgroundColor: c }}
                  onClick={() => handlePresetClick(c)}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Transparent */}
          <button
            type="button"
            className="color-picker-transparent"
            onClick={() => {
              setLocalAlpha(0);
              prevValue.current = "transparent";
              onChange("transparent");
            }}
          >
            Set transparent
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
