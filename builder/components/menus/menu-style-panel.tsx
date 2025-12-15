"use client";

import * as React from "react";
import { type MenuStyle } from "@/lib/hooks/use-menus";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import "./menu-style-panel.css";

interface MenuStylePanelProps {
  style: MenuStyle;
  onChange: (style: MenuStyle) => void;
}

interface StyleOption<T extends string> {
  value: T;
  label: string;
}

const spacingOptions: StyleOption<NonNullable<MenuStyle["spacing"]>>[] = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "spacious", label: "Spacious" },
];

const alignmentOptions: StyleOption<NonNullable<MenuStyle["alignment"]>>[] = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
  { value: "spread", label: "Spread" },
];

const fontSizeOptions: StyleOption<NonNullable<MenuStyle["fontSize"]>>[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
];

const fontWeightOptions: StyleOption<NonNullable<MenuStyle["fontWeight"]>>[] = [
  { value: "normal", label: "Normal" },
  { value: "medium", label: "Medium" },
  { value: "semibold", label: "Semibold" },
  { value: "bold", label: "Bold" },
];

const textTransformOptions: StyleOption<
  NonNullable<MenuStyle["textTransform"]>
>[] = [
  { value: "none", label: "None" },
  { value: "uppercase", label: "Uppercase" },
  { value: "capitalize", label: "Capitalize" },
];

const hoverStyleOptions: StyleOption<NonNullable<MenuStyle["hoverStyle"]>>[] = [
  { value: "none", label: "None" },
  { value: "underline", label: "Underline" },
  { value: "background", label: "Background" },
  { value: "border", label: "Border" },
  { value: "scale", label: "Scale" },
  { value: "color", label: "Color Change" },
  { value: "glow", label: "Glow" },
];

const hoverAnimationOptions: StyleOption<
  NonNullable<MenuStyle["hoverAnimation"]>
>[] = [
  { value: "none", label: "None" },
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide" },
  { value: "bounce", label: "Bounce" },
];

const dropdownTriggerOptions: StyleOption<
  NonNullable<MenuStyle["dropdownTrigger"]>
>[] = [
  { value: "hover", label: "On Hover" },
  { value: "click", label: "On Click" },
];

const dropdownAnimationOptions: StyleOption<
  NonNullable<MenuStyle["dropdownAnimation"]>
>[] = [
  { value: "none", label: "None" },
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide Down" },
  { value: "scale", label: "Scale" },
];

const dropdownShadowOptions: StyleOption<
  NonNullable<MenuStyle["dropdownShadow"]>
>[] = [
  { value: "none", label: "None" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
];

const dropdownRadiusOptions: StyleOption<
  NonNullable<MenuStyle["dropdownRadius"]>
>[] = [
  { value: "none", label: "None" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "full", label: "Full" },
];

const activeStyleOptions: StyleOption<NonNullable<MenuStyle["activeStyle"]>>[] =
  [
    { value: "none", label: "None" },
    { value: "underline", label: "Underline" },
    { value: "background", label: "Background" },
    { value: "bold", label: "Bold" },
    { value: "color", label: "Color" },
  ];

export function MenuStylePanel({ style, onChange }: MenuStylePanelProps) {
  const updateStyle = <K extends keyof MenuStyle>(
    key: K,
    value: MenuStyle[K],
  ) => {
    onChange({ ...style, [key]: value });
  };

  return (
    <div className="menu-style-panel">
      <Accordion
        type="multiple"
        defaultValue={["layout", "typography", "hover", "dropdown", "active"]}
      >
        <AccordionItem value="layout">
          <AccordionTrigger>Layout</AccordionTrigger>
          <AccordionContent>
            <div className="menu-style-section">
              <div className="menu-style-field">
                <Label>Spacing</Label>
                <Select
                  value={style.spacing || "comfortable"}
                  onValueChange={(v) =>
                    updateStyle("spacing", v as MenuStyle["spacing"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {spacingOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="menu-style-field">
                <Label>Alignment</Label>
                <Select
                  value={style.alignment || "left"}
                  onValueChange={(v) =>
                    updateStyle("alignment", v as MenuStyle["alignment"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {alignmentOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="typography">
          <AccordionTrigger>Typography</AccordionTrigger>
          <AccordionContent>
            <div className="menu-style-section">
              <div className="menu-style-field">
                <Label>Font Size</Label>
                <Select
                  value={style.fontSize || "md"}
                  onValueChange={(v) =>
                    updateStyle("fontSize", v as MenuStyle["fontSize"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="menu-style-field">
                <Label>Font Weight</Label>
                <Select
                  value={style.fontWeight || "normal"}
                  onValueChange={(v) =>
                    updateStyle("fontWeight", v as MenuStyle["fontWeight"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontWeightOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="menu-style-field">
                <Label>Text Transform</Label>
                <Select
                  value={style.textTransform || "none"}
                  onValueChange={(v) =>
                    updateStyle(
                      "textTransform",
                      v as MenuStyle["textTransform"],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {textTransformOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="hover">
          <AccordionTrigger>Hover Effects</AccordionTrigger>
          <AccordionContent>
            <div className="menu-style-section">
              <div className="menu-style-field">
                <Label>Hover Style</Label>
                <Select
                  value={style.hoverStyle || "none"}
                  onValueChange={(v) =>
                    updateStyle("hoverStyle", v as MenuStyle["hoverStyle"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hoverStyleOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="menu-style-field">
                <Label>Animation</Label>
                <Select
                  value={style.hoverAnimation || "none"}
                  onValueChange={(v) =>
                    updateStyle(
                      "hoverAnimation",
                      v as MenuStyle["hoverAnimation"],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hoverAnimationOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="menu-style-field">
                <Label>Hover Color</Label>
                <div className="menu-style-color-input">
                  <Input
                    type="color"
                    value={style.hoverColor || "#3b82f6"}
                    onChange={(e) => updateStyle("hoverColor", e.target.value)}
                    className="menu-style-color-picker"
                  />
                  <Input
                    type="text"
                    value={style.hoverColor || ""}
                    onChange={(e) => updateStyle("hoverColor", e.target.value)}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="dropdown">
          <AccordionTrigger>Dropdown Settings</AccordionTrigger>
          <AccordionContent>
            <div className="menu-style-section">
              <div className="menu-style-field">
                <Label>Trigger</Label>
                <Select
                  value={style.dropdownTrigger || "hover"}
                  onValueChange={(v) =>
                    updateStyle(
                      "dropdownTrigger",
                      v as MenuStyle["dropdownTrigger"],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownTriggerOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="menu-style-field">
                <Label>Animation</Label>
                <Select
                  value={style.dropdownAnimation || "fade"}
                  onValueChange={(v) =>
                    updateStyle(
                      "dropdownAnimation",
                      v as MenuStyle["dropdownAnimation"],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownAnimationOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="menu-style-field">
                <Label>Shadow</Label>
                <Select
                  value={style.dropdownShadow || "md"}
                  onValueChange={(v) =>
                    updateStyle(
                      "dropdownShadow",
                      v as MenuStyle["dropdownShadow"],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownShadowOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="menu-style-field">
                <Label>Border Radius</Label>
                <Select
                  value={style.dropdownRadius || "md"}
                  onValueChange={(v) =>
                    updateStyle(
                      "dropdownRadius",
                      v as MenuStyle["dropdownRadius"],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownRadiusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="menu-style-field">
                <Label>Background Color</Label>
                <div className="menu-style-color-input">
                  <Input
                    type="color"
                    value={style.dropdownBackground || "#ffffff"}
                    onChange={(e) =>
                      updateStyle("dropdownBackground", e.target.value)
                    }
                    className="menu-style-color-picker"
                  />
                  <Input
                    type="text"
                    value={style.dropdownBackground || ""}
                    onChange={(e) =>
                      updateStyle("dropdownBackground", e.target.value)
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="active">
          <AccordionTrigger>Active State</AccordionTrigger>
          <AccordionContent>
            <div className="menu-style-section">
              <div className="menu-style-field">
                <Label>Active Style</Label>
                <Select
                  value={style.activeStyle || "none"}
                  onValueChange={(v) =>
                    updateStyle("activeStyle", v as MenuStyle["activeStyle"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activeStyleOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="menu-style-field">
                <Label>Active Color</Label>
                <div className="menu-style-color-input">
                  <Input
                    type="color"
                    value={style.activeColor || "#3b82f6"}
                    onChange={(e) => updateStyle("activeColor", e.target.value)}
                    className="menu-style-color-picker"
                  />
                  <Input
                    type="text"
                    value={style.activeColor || ""}
                    onChange={(e) => updateStyle("activeColor", e.target.value)}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
