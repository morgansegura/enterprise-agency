"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  PropertyRow,
  PropertyToggle,
} from "@/components/editor/settings-panel/components";

interface GradientStop {
  color: string;
  position: number; // 0-100
}

interface GradientBuilderProps {
  value: string;
  onChange: (v: string) => void;
}

/** Gradient Builder — multi-stop, linear/radial, angle control */
export function GradientBuilder({ value, onChange }: GradientBuilderProps) {
  const isGradient = value?.includes("gradient");

  const parseStops = (): GradientStop[] => {
    if (!isGradient)
      return [
        { color: "#000000", position: 0 },
        { color: "#ffffff", position: 100 },
      ];
    const stopRegex =
      /(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))\s*(\d+)?%?/g;
    const stops: GradientStop[] = [];
    let match;
    while ((match = stopRegex.exec(value)) !== null) {
      stops.push({
        color: match[1],
        position: match[2]
          ? parseInt(match[2])
          : stops.length === 0
            ? 0
            : 100,
      });
    }
    return stops.length >= 2
      ? stops
      : [
          { color: "#000000", position: 0 },
          { color: "#ffffff", position: 100 },
        ];
  };

  const parseType = () =>
    value?.includes("radial") ? "radial" : "linear";
  const parseAngle = () => {
    const m = value?.match(/(\d+)deg/);
    return m ? m[1] : "180";
  };

  const [enabled, setEnabled] = React.useState(isGradient);
  const [type, setType] = React.useState(parseType);
  const [angle, setAngle] = React.useState(parseAngle);
  const [stops, setStops] = React.useState<GradientStop[]>(parseStops);

  const buildGradient = (
    t: string,
    a: string,
    s: GradientStop[],
  ) => {
    const stopsStr = s
      .map((st) => `${st.color} ${st.position}%`)
      .join(", ");
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
    else
      updated[index] = { ...updated[index], position: val as number };
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
          onChange={(v) => {
            setType(v);
            emit(v, angle, stops);
          }}
        />
      </PropertyRow>
      {type === "linear" && (
        <PropertyRow label="Angle">
          <div className="flex items-center gap-2 flex-1">
            <input
              type="range"
              min="0"
              max="360"
              step="5"
              value={angle}
              onChange={(e) => {
                setAngle(e.target.value);
                emit(type, e.target.value, stops);
              }}
              className="flex-1 h-1.5 accent-(--accent-primary)"
            />
            <span className="text-[11px] text-(--el-500) w-10 text-right">
              {angle}°
            </span>
          </div>
        </PropertyRow>
      )}
      {/* Color stops */}
      {stops.map((stop, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <input
            type="color"
            value={
              stop.color.startsWith("#") ? stop.color : "#000000"
            }
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
            onChange={(e) =>
              updateStop(
                i,
                "position",
                parseInt(e.target.value) || 0,
              )
            }
            className="w-10 h-7 text-xs text-center shrink-0"
          />
          <span className="text-[10px] text-(--el-400) shrink-0">
            %
          </span>
          {stops.length > 2 && (
            <button
              type="button"
              onClick={() => removeStop(i)}
              className="text-[11px] text-(--el-400) hover:text-(--status-error) bg-transparent border-none cursor-pointer"
            >
              x
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
          onClick={() => {
            setEnabled(false);
            onChange("");
          }}
          className="text-[11px] text-(--status-error) bg-transparent border-none cursor-pointer hover:underline"
        >
          Remove
        </button>
      </div>
    </>
  );
}
