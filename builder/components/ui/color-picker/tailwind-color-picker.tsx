"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { tailwindColors, type ColorName, type ShadeKey } from "./color-picker";
import "./color-picker.css";

// =============================================================================
// TailwindColorPicker - Returns Tailwind class names instead of hex
// =============================================================================

export interface TailwindColorPickerProps {
  label?: string;
  /** Value in format "blue-500" or "transparent" */
  value: string;
  /** Returns Tailwind color name like "blue-500" */
  onChange: (value: string) => void;
  className?: string;
}

/**
 * TailwindColorPicker
 *
 * Like ColorPicker but returns Tailwind class names (e.g., "blue-500")
 * instead of hex values. Used for gradient from/via/to colors.
 * Matches the visual style of ColorPicker with scrollable palette.
 */
export function TailwindColorPicker({
  label,
  value,
  onChange,
  className,
}: TailwindColorPickerProps) {
  const [open, setOpen] = React.useState(false);

  // Get hex color from Tailwind name for preview
  const getHexFromTailwind = (twColor: string): string => {
    if (twColor === "transparent") return "transparent";
    if (twColor === "white") return "#ffffff";
    if (twColor === "black") return "#000000";

    const [colorName, shade] = twColor.split("-") as [ColorName, string];
    if (tailwindColors[colorName]) {
      return tailwindColors[colorName][shade as unknown as ShadeKey] || "#000";
    }
    return "#000";
  };

  const previewColor = getHexFromTailwind(value);

  return (
    <div className={cn("color-picker", className)}>
      {label && <label className="color-picker-label">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" className="color-picker-trigger">
            <span
              className="color-picker-swatch"
              style={{ backgroundColor: previewColor }}
            />
            <span className="color-picker-value">{value || "Select"}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="color-picker-dropdown"
          side="bottom"
          align="start"
          sideOffset={8}
          collisionPadding={{ top: 20, bottom: 20, left: 20, right: 20 }}
          avoidCollisions={true}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div
            className="color-picker-scroll-container"
            onWheel={(e) => {
              const target = e.currentTarget;
              const { scrollTop, scrollHeight, clientHeight } = target;
              const atTop = scrollTop === 0 && e.deltaY < 0;
              const atBottom =
                scrollTop + clientHeight >= scrollHeight && e.deltaY > 0;
              if (!atTop && !atBottom) {
                e.stopPropagation();
              }
            }}
          >
            {/* Sticky header with Basic colors */}
            <div className="color-picker-sticky-header">
              <div className="color-row">
                <span className="color-row-label">Basic</span>
                <div className="color-row-shades">
                  <button
                    type="button"
                    className={cn(
                      "color-swatch is-transparent",
                      value === "transparent" && "is-selected",
                    )}
                    onClick={() => {
                      onChange("transparent");
                      setOpen(false);
                    }}
                    title="Transparent"
                  />
                  <button
                    type="button"
                    className={cn(
                      "color-swatch",
                      value === "white" && "is-selected",
                    )}
                    style={{ backgroundColor: "#ffffff" }}
                    onClick={() => {
                      onChange("white");
                      setOpen(false);
                    }}
                    title="White"
                  />
                  <button
                    type="button"
                    className={cn(
                      "color-swatch",
                      value === "black" && "is-selected",
                    )}
                    style={{ backgroundColor: "#000000" }}
                    onClick={() => {
                      onChange("black");
                      setOpen(false);
                    }}
                    title="Black"
                  />
                </div>
              </div>
            </div>

            {/* Tailwind Palette - returns class names */}
            <div className="color-palette">
              {(Object.keys(tailwindColors) as ColorName[]).map((colorName) => (
                <div key={colorName} className="color-row">
                  <span className="color-row-label">{colorName}</span>
                  <div className="color-row-shades">
                    {(
                      Object.keys(
                        tailwindColors[colorName],
                      ) as unknown as ShadeKey[]
                    ).map((shade) => {
                      const hex = tailwindColors[colorName][shade];
                      const twClass = `${colorName}-${shade}`;
                      return (
                        <button
                          key={shade}
                          type="button"
                          className={cn(
                            "color-swatch",
                            value === twClass && "is-selected",
                          )}
                          style={{ backgroundColor: hex }}
                          onClick={() => {
                            onChange(twClass);
                            setOpen(false);
                          }}
                          title={twClass}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
