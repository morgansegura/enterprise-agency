"use client";

import { SliderInput } from "@/components/editor/settings-panel/slider-input";
import { ColorPicker } from "@/components/editor/settings-panel/color-picker";

interface ShadowBuilderProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

/** Box/Text Shadow Builder — stacked sliders + color picker */
export function ShadowBuilder({ label, value, onChange }: ShadowBuilderProps) {
  const parts = (value || "").match(
    /(-?\d+)px\s+(-?\d+)px\s+(\d+)px\s+(-?\d+)px\s+(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/,
  );
  const x = parts?.[1] || "0";
  const y = parts?.[2] || "4";
  const blur = parts?.[3] || "6";
  const spread = parts?.[4] || "0";
  const color = parts?.[5] || "rgba(0,0,0,0.1)";

  const build = (
    nx: string,
    ny: string,
    nb: string,
    ns: string,
    nc: string,
  ) => `${nx}px ${ny}px ${nb}px ${ns}px ${nc}`;

  const fields = [
    {
      label: "X",
      val: x,
      min: -50,
      max: 50,
      set: (v: string) => build(v, y, blur, spread, color),
    },
    {
      label: "Y",
      val: y,
      min: -50,
      max: 50,
      set: (v: string) => build(x, v, blur, spread, color),
    },
    {
      label: "Blur",
      val: blur,
      min: 0,
      max: 100,
      set: (v: string) => build(x, y, v, spread, color),
    },
    {
      label: "Spread",
      val: spread,
      min: -20,
      max: 50,
      set: (v: string) => build(x, y, blur, v, color),
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-(--el-500)">{label}</span>

      {fields.map((f) => (
        <div key={f.label} className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-(--el-500)">
            {f.label}
          </span>
          <SliderInput
            value={`${f.val}px`}
            onChange={(v) => {
              const num = parseInt(v) || 0;
              onChange(f.set(String(num)));
            }}
            min={f.min}
            max={f.max}
            step={1}
          />
        </div>
      ))}

      <ColorPicker
        label="Shadow Color"
        value={color}
        onChange={(v) => onChange(build(x, y, blur, spread, v || "rgba(0,0,0,0.1)"))}
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-xs text-(--status-error) bg-transparent border-none cursor-pointer hover:underline text-left"
        >
          Remove shadow
        </button>
      )}
    </div>
  );
}
