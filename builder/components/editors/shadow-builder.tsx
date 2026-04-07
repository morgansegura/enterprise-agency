"use client";

import { Input } from "@/components/ui/input";
import { PropertyRow } from "@/components/editor/settings-panel/components";

interface ShadowBuilderProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

/** Box Shadow Builder — X, Y, Blur, Spread, Color */
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

  return (
    <>
      <span className="text-[10px] uppercase tracking-wider text-(--el-400) font-semibold px-0">
        {label}
      </span>
      <PropertyRow label="X">
        <Input
          value={x}
          onChange={(e) =>
            onChange(build(e.target.value, y, blur, spread, color))
          }
          className="w-16 h-7 text-xs text-center"
        />
      </PropertyRow>
      <PropertyRow label="Y">
        <Input
          value={y}
          onChange={(e) =>
            onChange(build(x, e.target.value, blur, spread, color))
          }
          className="w-16 h-7 text-xs text-center"
        />
      </PropertyRow>
      <PropertyRow label="Blur">
        <Input
          value={blur}
          onChange={(e) =>
            onChange(build(x, y, e.target.value, spread, color))
          }
          className="w-16 h-7 text-xs text-center"
        />
      </PropertyRow>
      <PropertyRow label="Spread">
        <Input
          value={spread}
          onChange={(e) =>
            onChange(build(x, y, blur, e.target.value, color))
          }
          className="w-16 h-7 text-xs text-center"
        />
      </PropertyRow>
      <PropertyRow label="Color">
        <div className="flex items-center gap-1.5">
          <input
            type="color"
            value={color.startsWith("#") ? color : "#000000"}
            onChange={(e) =>
              onChange(build(x, y, blur, spread, e.target.value))
            }
            className="w-7 h-7 rounded-[3px] border border-(--border-default) cursor-pointer"
          />
          <Input
            value={color}
            onChange={(e) =>
              onChange(build(x, y, blur, spread, e.target.value))
            }
            className="flex-1 h-7 text-xs"
          />
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
