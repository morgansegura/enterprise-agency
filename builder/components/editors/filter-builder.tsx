"use client";

import { SliderInput } from "@/components/editor/settings-panel/slider-input";
import { PropertyRow } from "@/components/editor/settings-panel/components";

interface FilterBuilderProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

/** Filter Builder — sliders for blur, brightness, contrast, saturate, grayscale, hue-rotate */
export function FilterBuilder({ label, value, onChange }: FilterBuilderProps) {
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

  const build = (
    nb: string,
    nbr: string,
    nc: string,
    ns: string,
    ng: string,
    nh: string,
  ) => {
    const parts: string[] = [];
    if (nb !== "0px") parts.push(`blur(${nb})`);
    if (nbr !== "1") parts.push(`brightness(${nbr})`);
    if (nc !== "1") parts.push(`contrast(${nc})`);
    if (ns !== "1") parts.push(`saturate(${ns})`);
    if (ng !== "0") parts.push(`grayscale(${ng})`);
    if (nh !== "0deg") parts.push(`hue-rotate(${nh})`);
    return parts.join(" ") || "";
  };

  const fields = [
    {
      label: "Blur",
      val: blur,
      min: 0,
      max: 20,
      step: 1,
      unit: "px",
      set: (v: string) => build(v, brightness, contrast, saturate, grayscale, hueRotate),
    },
    {
      label: "Brightness",
      val: brightness,
      min: 0,
      max: 2,
      step: 0.05,
      unit: "",
      set: (v: string) => build(blur, v, contrast, saturate, grayscale, hueRotate),
    },
    {
      label: "Contrast",
      val: contrast,
      min: 0,
      max: 2,
      step: 0.05,
      unit: "",
      set: (v: string) => build(blur, brightness, v, saturate, grayscale, hueRotate),
    },
    {
      label: "Saturate",
      val: saturate,
      min: 0,
      max: 3,
      step: 0.05,
      unit: "",
      set: (v: string) => build(blur, brightness, contrast, v, grayscale, hueRotate),
    },
    {
      label: "Grayscale",
      val: grayscale,
      min: 0,
      max: 1,
      step: 0.05,
      unit: "",
      set: (v: string) => build(blur, brightness, contrast, saturate, v, hueRotate),
    },
    {
      label: "Hue Rotate",
      val: hueRotate,
      min: 0,
      max: 360,
      step: 5,
      unit: "deg",
      set: (v: string) => build(blur, brightness, contrast, saturate, grayscale, v),
    },
  ];

  return (
    <>
      <span className="text-sm font-medium text-(--el-400)">{label}</span>
      {fields.map((f) => (
        <PropertyRow key={f.label} label={f.label}>
          <SliderInput
            value={f.val}
            onChange={(v) => onChange(f.set(v))}
            min={f.min}
            max={f.max}
            step={f.step}
            unit={f.unit}
            placeholder={f.val}
          />
        </PropertyRow>
      ))}
    </>
  );
}
