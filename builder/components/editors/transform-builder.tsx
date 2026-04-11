"use client";

import { SliderInput } from "@/components/editor/settings-panel/slider-input";
import { PropertyRow } from "@/components/editor/settings-panel/components";

interface TransformBuilderProps {
  value: string;
  onChange: (v: string) => void;
}

/** Transform Builder — sliders for translate, rotate, scale, skew */
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

  const fields = [
    {
      label: "Move X",
      val: tx,
      min: -200,
      max: 200,
      unit: "px",
      set: (v: string) => build(v, ty, rotate, sx, sy, skx, sky),
    },
    {
      label: "Move Y",
      val: ty,
      min: -200,
      max: 200,
      unit: "px",
      set: (v: string) => build(tx, v, rotate, sx, sy, skx, sky),
    },
    {
      label: "Rotate",
      val: rotate,
      min: -360,
      max: 360,
      unit: "deg",
      set: (v: string) => build(tx, ty, v, sx, sy, skx, sky),
    },
    {
      label: "Scale X",
      val: sx,
      min: 0,
      max: 3,
      step: 0.1,
      unit: "",
      set: (v: string) => build(tx, ty, rotate, v, sy, skx, sky),
    },
    {
      label: "Scale Y",
      val: sy,
      min: 0,
      max: 3,
      step: 0.1,
      unit: "",
      set: (v: string) => build(tx, ty, rotate, sx, v, skx, sky),
    },
    {
      label: "Skew X",
      val: skx,
      min: -45,
      max: 45,
      unit: "deg",
      set: (v: string) => build(tx, ty, rotate, sx, sy, v, sky),
    },
    {
      label: "Skew Y",
      val: sky,
      min: -45,
      max: 45,
      unit: "deg",
      set: (v: string) => build(tx, ty, rotate, sx, sy, skx, v),
    },
  ];

  return (
    <>
      {fields.map((f) => (
        <PropertyRow key={f.label} label={f.label}>
          <SliderInput
            value={f.val}
            onChange={(v) => onChange(f.set(v))}
            min={f.min}
            max={f.max}
            step={f.step ?? 1}
            unit={f.unit}
            placeholder={f.val}
          />
        </PropertyRow>
      ))}
    </>
  );
}
