"use client";

import * as React from "react";
import { SliderInput } from "@/components/editor/settings-panel/slider-input";
import {
  PropertyRow,
  PropertyToggle,
} from "@/components/editor/settings-panel/components";
import { ColorPicker } from "@/components/editor/settings-panel/color-picker";
import { Plus, X } from "lucide-react";

interface GradientStop {
  color: string;
  position: number;
}

interface GradientBuilderProps {
  value: string;
  onChange: (v: string) => void;
}

/** Gradient Builder — multi-stop, linear/radial, angle slider */
export function GradientBuilder({ value, onChange }: GradientBuilderProps) {
  const isGradient = value?.includes("gradient");

  const parseStops = (): GradientStop[] => {
    if (!isGradient)
      return [
        { color: "#000000", position: 0 },
        { color: "#ffffff", position: 100 },
      ];
    const stopRegex = /(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))\s*(\d+)?%?/g;
    const stops: GradientStop[] = [];
    let match;
    while ((match = stopRegex.exec(value)) !== null) {
      stops.push({
        color: match[1],
        position: match[2] ? parseInt(match[2]) : stops.length === 0 ? 0 : 100,
      });
    }
    return stops.length >= 2
      ? stops
      : [
          { color: "#000000", position: 0 },
          { color: "#ffffff", position: 100 },
        ];
  };

  const parseType = () => (value?.includes("radial") ? "radial" : "linear");
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

  const updateStop = (
    index: number,
    field: "color" | "position",
    val: string | number,
  ) => {
    const updated = [...stops];
    if (field === "color")
      updated[index] = { ...updated[index], color: val as string };
    else updated[index] = { ...updated[index], position: val as number };
    setStops(updated);
    emit(type, angle, updated);
  };

  const addStop = () => {
    const mid = Math.round(
      ((stops[stops.length - 2]?.position ?? 0) +
        (stops[stops.length - 1]?.position ?? 100)) /
        2,
    );
    const updated = [...stops];
    updated.splice(stops.length - 1, 0, {
      color: "#888888",
      position: mid,
    });
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
        className="w-26 mx-auto py-1 bg-(--el-600) rounded-lg text-sm text-(--el-0) border cursor-pointer hover:bg-(--el-500) transition-colors duration ease-out"
      >
        + Add gradient
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-(--el-400)">Gradient</span>

      {/* Preview */}
      <div
        className="w-full h-6 rounded-md border border-(--el-200)"
        style={{ background: buildGradient(type, angle, stops) }}
      />

      {/* Type */}
      <PropertyRow label="Type" stacked>
        <PropertyToggle
          value={type}
          options={[
            { value: "linear", label: "Linear" },
            { value: "radial", label: "Radial" },
          ]}
          onChange={(v) => {
            setType(v);
            emit(v, angle, stops);
          }}
          fullWidth
        />
      </PropertyRow>

      {/* Angle */}
      {type === "linear" && (
        <PropertyRow label="Angle">
          <SliderInput
            value={`${angle}deg`}
            onChange={(v) => {
              const num = String(parseInt(v) || 0);
              setAngle(num);
              emit(type, num, stops);
            }}
            min={0}
            max={360}
            step={5}
            unit="deg"
            placeholder="180"
          />
        </PropertyRow>
      )}

      {/* Color stops */}
      <span className="text-sm font-medium text-(--el-400)">Stops</span>
      {stops.map((stop, i) => (
        <div key={i} className="flex items-center gap-2">
          <ColorPicker
            compact
            value={stop.color}
            onChange={(v) => updateStop(i, "color", v || "#000000")}
          />
          <SliderInput
            value={`${stop.position}%`}
            onChange={(v) =>
              updateStop(i, "position", parseInt(v) || 0)
            }
            min={0}
            max={100}
            step={1}
            unit="%"
            placeholder="0"
          />
          {stops.length > 2 && (
            <button
              type="button"
              onClick={() => removeStop(i)}
              className="flex items-center justify-center size-5 rounded-[3px] text-(--el-400) hover:text-(--status-error) bg-transparent border-none cursor-pointer shrink-0"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      ))}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={addStop}
          className="flex items-center gap-1 text-xs text-(--accent-primary) bg-transparent border-none cursor-pointer hover:underline"
        >
          <Plus className="size-3" />
          Add stop
        </button>
        <button
          type="button"
          onClick={() => {
            setEnabled(false);
            onChange("");
          }}
          className="text-xs text-(--status-error) bg-transparent border-none cursor-pointer hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
