"use client";

import * as React from "react";
import {
  type MobileMenu,
  type MobileMenuTrigger,
} from "@/lib/hooks/use-headers";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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

import "./mobile-menu-panel.css";

interface MobileMenuPanelProps {
  mobileMenu: MobileMenu;
  onChange: (mobileMenu: MobileMenu) => void;
}

const menuTypeOptions = [
  { value: "slide-left", label: "Slide from Left" },
  { value: "slide-right", label: "Slide from Right" },
  { value: "dropdown", label: "Dropdown" },
  { value: "fullscreen", label: "Fullscreen Overlay" },
  { value: "bottom-nav", label: "Bottom Navigation" },
];

const breakpointOptions = [
  { value: "sm", label: "Small (640px)" },
  { value: "md", label: "Medium (768px)" },
  { value: "lg", label: "Large (1024px)" },
];

const animationOptions = [
  { value: "none", label: "None" },
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide" },
  { value: "scale", label: "Scale" },
];

const openIconOptions = [
  { value: "hamburger", label: "Hamburger (3 lines)" },
  { value: "menu", label: "Menu icon" },
  { value: "dots-vertical", label: "Vertical dots" },
  { value: "dots-horizontal", label: "Horizontal dots" },
  { value: "grid", label: "Grid" },
  { value: "custom", label: "Custom" },
];

const closeIconOptions = [
  { value: "x", label: "X (close)" },
  { value: "arrow-left", label: "Arrow left" },
  { value: "arrow-right", label: "Arrow right" },
  { value: "chevron-down", label: "Chevron down" },
  { value: "custom", label: "Custom" },
];

const triggerSizeOptions = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
];

const triggerStyleOptions = [
  { value: "default", label: "Default" },
  { value: "rounded", label: "Rounded" },
  { value: "pill", label: "Pill" },
  { value: "ghost", label: "Ghost" },
];

const alignmentOptions = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
];

export function MobileMenuPanel({
  mobileMenu,
  onChange,
}: MobileMenuPanelProps) {
  const updateMobileMenu = <K extends keyof MobileMenu>(
    key: K,
    value: MobileMenu[K],
  ) => {
    onChange({ ...mobileMenu, [key]: value });
  };

  const updateTrigger = <K extends keyof MobileMenuTrigger>(
    key: K,
    value: MobileMenuTrigger[K],
  ) => {
    onChange({
      ...mobileMenu,
      trigger: { ...mobileMenu.trigger, [key]: value },
    });
  };

  return (
    <div className="mobile-menu-panel">
      <Accordion
        type="multiple"
        defaultValue={["layout", "trigger", "appearance", "behavior"]}
      >
        <AccordionItem value="layout">
          <AccordionTrigger>Layout</AccordionTrigger>
          <AccordionContent>
            <div className="mobile-menu-section">
              <div className="mobile-menu-field">
                <Label>Menu Type</Label>
                <Select
                  value={mobileMenu.type || "slide-left"}
                  onValueChange={(v) =>
                    updateMobileMenu("type", v as MobileMenu["type"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {menuTypeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mobile-menu-field">
                <Label>Breakpoint</Label>
                <Select
                  value={mobileMenu.breakpoint || "md"}
                  onValueChange={(v) =>
                    updateMobileMenu(
                      "breakpoint",
                      v as MobileMenu["breakpoint"],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {breakpointOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mobile-menu-field">
                <Label>Animation</Label>
                <Select
                  value={mobileMenu.animation || "slide"}
                  onValueChange={(v) =>
                    updateMobileMenu("animation", v as MobileMenu["animation"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {animationOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mobile-menu-field">
                <Label>Menu Alignment</Label>
                <Select
                  value={mobileMenu.menuAlignment || "left"}
                  onValueChange={(v) =>
                    updateMobileMenu(
                      "menuAlignment",
                      v as MobileMenu["menuAlignment"],
                    )
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

        <AccordionItem value="trigger">
          <AccordionTrigger>Trigger Icon</AccordionTrigger>
          <AccordionContent>
            <div className="mobile-menu-section">
              <div className="mobile-menu-field">
                <Label>Open Icon</Label>
                <Select
                  value={mobileMenu.trigger?.openIcon || "hamburger"}
                  onValueChange={(v) =>
                    updateTrigger(
                      "openIcon",
                      v as MobileMenuTrigger["openIcon"],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {openIconOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {mobileMenu.trigger?.openIcon === "custom" && (
                <div className="mobile-menu-field">
                  <Label>Custom Open Icon</Label>
                  <Input
                    placeholder="Icon name or SVG"
                    value={mobileMenu.trigger?.openIconCustom || ""}
                    onChange={(e) =>
                      updateTrigger("openIconCustom", e.target.value)
                    }
                  />
                </div>
              )}

              <div className="mobile-menu-field">
                <Label>Close Icon</Label>
                <Select
                  value={mobileMenu.trigger?.closeIcon || "x"}
                  onValueChange={(v) =>
                    updateTrigger(
                      "closeIcon",
                      v as MobileMenuTrigger["closeIcon"],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {closeIconOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {mobileMenu.trigger?.closeIcon === "custom" && (
                <div className="mobile-menu-field">
                  <Label>Custom Close Icon</Label>
                  <Input
                    placeholder="Icon name or SVG"
                    value={mobileMenu.trigger?.closeIconCustom || ""}
                    onChange={(e) =>
                      updateTrigger("closeIconCustom", e.target.value)
                    }
                  />
                </div>
              )}

              <div className="mobile-menu-field">
                <Label>Trigger Size</Label>
                <Select
                  value={mobileMenu.trigger?.size || "md"}
                  onValueChange={(v) =>
                    updateTrigger("size", v as MobileMenuTrigger["size"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerSizeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mobile-menu-field">
                <Label>Trigger Style</Label>
                <Select
                  value={mobileMenu.trigger?.style || "default"}
                  onValueChange={(v) =>
                    updateTrigger("style", v as MobileMenuTrigger["style"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerStyleOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mobile-menu-field">
                <Label>Trigger Color</Label>
                <div className="mobile-menu-color-input">
                  <Input
                    type="color"
                    value={mobileMenu.trigger?.color || "#000000"}
                    onChange={(e) => updateTrigger("color", e.target.value)}
                    className="mobile-menu-color-picker"
                  />
                  <Input
                    type="text"
                    value={mobileMenu.trigger?.color || ""}
                    onChange={(e) => updateTrigger("color", e.target.value)}
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="appearance">
          <AccordionTrigger>Appearance</AccordionTrigger>
          <AccordionContent>
            <div className="mobile-menu-section">
              <div className="mobile-menu-field">
                <Label>Background Color</Label>
                <div className="mobile-menu-color-input">
                  <Input
                    type="color"
                    value={mobileMenu.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      updateMobileMenu("backgroundColor", e.target.value)
                    }
                    className="mobile-menu-color-picker"
                  />
                  <Input
                    type="text"
                    value={mobileMenu.backgroundColor || ""}
                    onChange={(e) =>
                      updateMobileMenu("backgroundColor", e.target.value)
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div className="mobile-menu-field">
                <Label>Text Color</Label>
                <div className="mobile-menu-color-input">
                  <Input
                    type="color"
                    value={mobileMenu.textColor || "#000000"}
                    onChange={(e) =>
                      updateMobileMenu("textColor", e.target.value)
                    }
                    className="mobile-menu-color-picker"
                  />
                  <Input
                    type="text"
                    value={mobileMenu.textColor || ""}
                    onChange={(e) =>
                      updateMobileMenu("textColor", e.target.value)
                    }
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="mobile-menu-field-row">
                <Label>Show Overlay</Label>
                <Switch
                  checked={mobileMenu.showOverlay ?? true}
                  onCheckedChange={(v) => updateMobileMenu("showOverlay", v)}
                />
              </div>

              {mobileMenu.showOverlay && (
                <div className="mobile-menu-field">
                  <Label>Overlay Color</Label>
                  <Input
                    type="text"
                    value={mobileMenu.overlayColor || "rgba(0,0,0,0.5)"}
                    onChange={(e) =>
                      updateMobileMenu("overlayColor", e.target.value)
                    }
                    placeholder="rgba(0,0,0,0.5)"
                  />
                </div>
              )}

              <div className="mobile-menu-field-row">
                <Label>Show Logo</Label>
                <Switch
                  checked={mobileMenu.showLogo ?? true}
                  onCheckedChange={(v) => updateMobileMenu("showLogo", v)}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="behavior">
          <AccordionTrigger>Behavior</AccordionTrigger>
          <AccordionContent>
            <div className="mobile-menu-section">
              <div className="mobile-menu-field-row">
                <Label>Close on Outside Click</Label>
                <Switch
                  checked={mobileMenu.closeOnOutsideClick ?? true}
                  onCheckedChange={(v) =>
                    updateMobileMenu("closeOnOutsideClick", v)
                  }
                />
              </div>

              <div className="mobile-menu-field-row">
                <Label>Close on Link Click</Label>
                <Switch
                  checked={mobileMenu.closeOnLinkClick ?? true}
                  onCheckedChange={(v) =>
                    updateMobileMenu("closeOnLinkClick", v)
                  }
                />
              </div>

              <div className="mobile-menu-field-row">
                <Label>Include Search</Label>
                <Switch
                  checked={mobileMenu.includeSearch ?? false}
                  onCheckedChange={(v) => updateMobileMenu("includeSearch", v)}
                />
              </div>

              <div className="mobile-menu-field-row">
                <Label>Include Social Links</Label>
                <Switch
                  checked={mobileMenu.includeSocial ?? false}
                  onCheckedChange={(v) => updateMobileMenu("includeSocial", v)}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
