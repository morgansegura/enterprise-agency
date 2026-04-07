"use client";

import { Input } from "@/components/ui/input";
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

  return (
    <>
      <span className="text-[10px] uppercase tracking-wider text-(--el-400) font-semibold">
        {label}
      </span>
      <PropertyRow label="Blur">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={parseFloat(blur)}
            onChange={(e) =>
              onChange(
                build(
                  `${e.target.value}px`,
                  brightness,
                  contrast,
                  saturate,
                  grayscale,
                  hueRotate,
                ),
              )
            }
            className="flex-1 h-1.5 accent-(--accent-primary)"
          />
          <Input
            value={blur}
            onChange={(e) =>
              onChange(
                build(
                  e.target.value,
                  brightness,
                  contrast,
                  saturate,
                  grayscale,
                  hueRotate,
                ),
              )
            }
            className="w-14 h-7 text-xs text-center"
          />
        </div>
      </PropertyRow>
      <PropertyRow label="Bright">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="range"
            min="0"
            max="2"
            step="0.05"
            value={parseFloat(brightness)}
            onChange={(e) =>
              onChange(
                build(
                  blur,
                  e.target.value,
                  contrast,
                  saturate,
                  grayscale,
                  hueRotate,
                ),
              )
            }
            className="flex-1 h-1.5 accent-(--accent-primary)"
          />
          <Input
            value={brightness}
            onChange={(e) =>
              onChange(
                build(
                  blur,
                  e.target.value,
                  contrast,
                  saturate,
                  grayscale,
                  hueRotate,
                ),
              )
            }
            className="w-14 h-7 text-xs text-center"
          />
        </div>
      </PropertyRow>
      <PropertyRow label="Contrast">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="range"
            min="0"
            max="2"
            step="0.05"
            value={parseFloat(contrast)}
            onChange={(e) =>
              onChange(
                build(
                  blur,
                  brightness,
                  e.target.value,
                  saturate,
                  grayscale,
                  hueRotate,
                ),
              )
            }
            className="flex-1 h-1.5 accent-(--accent-primary)"
          />
          <Input
            value={contrast}
            onChange={(e) =>
              onChange(
                build(
                  blur,
                  brightness,
                  e.target.value,
                  saturate,
                  grayscale,
                  hueRotate,
                ),
              )
            }
            className="w-14 h-7 text-xs text-center"
          />
        </div>
      </PropertyRow>
      <PropertyRow label="Saturate">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="range"
            min="0"
            max="3"
            step="0.05"
            value={parseFloat(saturate)}
            onChange={(e) =>
              onChange(
                build(
                  blur,
                  brightness,
                  contrast,
                  e.target.value,
                  grayscale,
                  hueRotate,
                ),
              )
            }
            className="flex-1 h-1.5 accent-(--accent-primary)"
          />
          <Input
            value={saturate}
            onChange={(e) =>
              onChange(
                build(
                  blur,
                  brightness,
                  contrast,
                  e.target.value,
                  grayscale,
                  hueRotate,
                ),
              )
            }
            className="w-14 h-7 text-xs text-center"
          />
        </div>
      </PropertyRow>
      <PropertyRow label="Grayscale">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={parseFloat(grayscale)}
            onChange={(e) =>
              onChange(
                build(
                  blur,
                  brightness,
                  contrast,
                  saturate,
                  e.target.value,
                  hueRotate,
                ),
              )
            }
            className="flex-1 h-1.5 accent-(--accent-primary)"
          />
          <Input
            value={grayscale}
            onChange={(e) =>
              onChange(
                build(
                  blur,
                  brightness,
                  contrast,
                  saturate,
                  e.target.value,
                  hueRotate,
                ),
              )
            }
            className="w-14 h-7 text-xs text-center"
          />
        </div>
      </PropertyRow>
      <PropertyRow label="Hue">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="range"
            min="0"
            max="360"
            step="5"
            value={parseFloat(hueRotate)}
            onChange={(e) =>
              onChange(
                build(
                  blur,
                  brightness,
                  contrast,
                  saturate,
                  grayscale,
                  `${e.target.value}deg`,
                ),
              )
            }
            className="flex-1 h-1.5 accent-(--accent-primary)"
          />
          <Input
            value={hueRotate}
            onChange={(e) =>
              onChange(
                build(
                  blur,
                  brightness,
                  contrast,
                  saturate,
                  grayscale,
                  e.target.value,
                ),
              )
            }
            className="w-14 h-7 text-xs text-center"
          />
        </div>
      </PropertyRow>
    </>
  );
}
