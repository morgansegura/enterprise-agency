"use client";

import { Input } from "@/components/ui/input";
import { PropertyRow } from "@/components/editor/settings-panel/components";

interface TransformBuilderProps {
  value: string;
  onChange: (v: string) => void;
}

/** Transform Builder — individual controls for translate, rotate, scale, skew */
export function TransformBuilder({ value, onChange }: TransformBuilderProps) {
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

  const build = (
    ntx: string,
    nty: string,
    nr: string,
    nsx: string,
    nsy: string,
    nskx: string,
    nsky: string,
  ) => {
    const parts: string[] = [];
    if (ntx !== "0px") parts.push(`translateX(${ntx})`);
    if (nty !== "0px") parts.push(`translateY(${nty})`);
    if (nr !== "0deg") parts.push(`rotate(${nr})`);
    if (nsx !== "1" || nsy !== "1")
      parts.push(`scaleX(${nsx}) scaleY(${nsy})`);
    if (nskx !== "0deg") parts.push(`skewX(${nskx})`);
    if (nsky !== "0deg") parts.push(`skewY(${nsky})`);
    return parts.join(" ") || "";
  };

  return (
    <>
      <PropertyRow label="Move X">
        <Input
          value={tx}
          onChange={(e) =>
            onChange(build(e.target.value, ty, rotate, sx, sy, skx, sky))
          }
          placeholder="0px"
          className="w-20 h-7 text-xs text-center"
        />
      </PropertyRow>
      <PropertyRow label="Move Y">
        <Input
          value={ty}
          onChange={(e) =>
            onChange(build(tx, e.target.value, rotate, sx, sy, skx, sky))
          }
          placeholder="0px"
          className="w-20 h-7 text-xs text-center"
        />
      </PropertyRow>
      <PropertyRow label="Rotate">
        <Input
          value={rotate}
          onChange={(e) =>
            onChange(build(tx, ty, e.target.value, sx, sy, skx, sky))
          }
          placeholder="0deg"
          className="w-20 h-7 text-xs text-center"
        />
      </PropertyRow>
      <PropertyRow label="Scale X">
        <Input
          value={sx}
          onChange={(e) =>
            onChange(build(tx, ty, rotate, e.target.value, sy, skx, sky))
          }
          placeholder="1"
          className="w-20 h-7 text-xs text-center"
        />
      </PropertyRow>
      <PropertyRow label="Scale Y">
        <Input
          value={sy}
          onChange={(e) =>
            onChange(build(tx, ty, rotate, sx, e.target.value, skx, sky))
          }
          placeholder="1"
          className="w-20 h-7 text-xs text-center"
        />
      </PropertyRow>
      <PropertyRow label="Skew X">
        <Input
          value={skx}
          onChange={(e) =>
            onChange(build(tx, ty, rotate, sx, sy, e.target.value, sky))
          }
          placeholder="0deg"
          className="w-20 h-7 text-xs text-center"
        />
      </PropertyRow>
      <PropertyRow label="Skew Y">
        <Input
          value={sky}
          onChange={(e) =>
            onChange(build(tx, ty, rotate, sx, sy, skx, e.target.value))
          }
          placeholder="0deg"
          className="w-20 h-7 text-xs text-center"
        />
      </PropertyRow>
    </>
  );
}
