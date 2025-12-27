"use client";

import { cn } from "@/lib/utils";
import "./position-picker.css";

type HorizontalPosition = "left" | "center" | "right";
type VerticalPosition = "top" | "center" | "bottom";

interface PositionPickerProps {
  horizontal: HorizontalPosition;
  vertical: VerticalPosition;
  onChange: (
    horizontal: HorizontalPosition,
    vertical: VerticalPosition,
  ) => void;
  className?: string;
}

const positions: Array<{ h: HorizontalPosition; v: VerticalPosition }> = [
  { h: "left", v: "top" },
  { h: "center", v: "top" },
  { h: "right", v: "top" },
  { h: "left", v: "center" },
  { h: "center", v: "center" },
  { h: "right", v: "center" },
  { h: "left", v: "bottom" },
  { h: "center", v: "bottom" },
  { h: "right", v: "bottom" },
];

/**
 * PositionPicker
 *
 * 9-point grid for selecting content alignment.
 * Combines horizontal (left/center/right) and vertical (top/center/bottom) in one visual picker.
 */
export function PositionPicker({
  horizontal,
  vertical,
  onChange,
  className,
}: PositionPickerProps) {
  return (
    <div className={cn("position-picker", className)}>
      <div className="position-picker-grid">
        {positions.map(({ h, v }) => {
          const isSelected = h === horizontal && v === vertical;
          return (
            <button
              key={`${h}-${v}`}
              type="button"
              className={cn(
                "position-picker-cell",
                isSelected && "is-selected",
              )}
              onClick={() => onChange(h, v)}
              title={`${v} ${h}`}
            >
              <span className="position-picker-dot" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
