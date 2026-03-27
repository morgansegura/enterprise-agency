"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Image, X, PlusCircle } from "lucide-react";
import { FormItem } from "@/components/ui/form";
import {
  ResponsiveField,
  useResponsiveChange,
} from "@/components/editor/responsive-field";
import {
  useCurrentBreakpoint,
  useCanSetResponsiveOverrides,
} from "@/lib/responsive/context";
import { getResponsiveValue } from "@/lib/responsive";

interface LogoItem {
  src: string;
  alt: string;
  href?: string;
}

interface LogoBarBlockData {
  _key: string;
  _type: "logo-bar-block";
  data: {
    logos: LogoItem[];
    heading?: string;
    variant?: "default" | "grayscale" | "bordered";
    size?: "sm" | "md" | "lg";
    _responsive?: {
      tablet?: Partial<
        Omit<LogoBarBlockData["data"], "_responsive" | "logos">
      >;
      mobile?: Partial<
        Omit<LogoBarBlockData["data"], "_responsive" | "logos">
      >;
    };
  };
}

interface LogoBarBlockEditorProps {
  block: LogoBarBlockData;
  onChange: (block: LogoBarBlockData) => void;
  onDelete: () => void;
}

export function LogoBarBlockEditor({
  block,
  onChange,
  onDelete,
}: LogoBarBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const breakpoint = useCurrentBreakpoint();
  const canSetOverrides = useCanSetResponsiveOverrides();

  // Handle data changes with responsive support
  const handleDataChange = useResponsiveChange(block.data, (newData) =>
    onChange({ ...block, data: newData as LogoBarBlockData["data"] }),
  );

  // Direct handler for logos (not responsive)
  const handleLogosChange = (logos: LogoItem[]) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        logos,
      },
    });
  };

  const handleLogoChange = (
    index: number,
    field: keyof LogoItem,
    value: unknown,
  ) => {
    const updatedLogos = [...block.data.logos];
    updatedLogos[index] = { ...updatedLogos[index], [field]: value };
    handleLogosChange(updatedLogos);
  };

  const handleAddLogo = () => {
    const updatedLogos = [
      ...block.data.logos,
      { src: "", alt: "", href: "" },
    ];
    handleLogosChange(updatedLogos);
  };

  const handleRemoveLogo = (index: number) => {
    const updatedLogos = block.data.logos.filter((_, i) => i !== index);
    handleLogosChange(updatedLogos);
  };

  // Get responsive-aware values
  const variant = block.data.variant || "default";
  const size =
    getResponsiveValue<string>(block.data, "size", breakpoint) || "md";

  const sizeStyles = {
    sm: "h-6",
    md: "h-10",
    lg: "h-14",
  };

  const variantStyles = {
    default: "",
    grayscale: "grayscale opacity-60",
    bordered: "border rounded-lg p-2",
  };

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        {block.data.heading && (
          <p className="text-sm text-[var(--el-500)] text-center mb-3">
            {block.data.heading}
          </p>
        )}
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {block.data.logos.length === 0 ? (
            <div className="text-center text-[var(--el-500)] py-4">
              No logos yet. Click to add logos...
            </div>
          ) : (
            block.data.logos.map((logo, index) => (
              <div
                key={index}
                className={`${variantStyles[variant]}`}
              >
                {logo.src ? (
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className={`${sizeStyles[size as keyof typeof sizeStyles]} w-auto object-contain`}
                  />
                ) : (
                  <div
                    className={`${sizeStyles[size as keyof typeof sizeStyles]} w-20 bg-[var(--el-100)] rounded flex items-center justify-center`}
                  >
                    <Image className="h-4 w-4 text-[var(--el-500)]" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <Button
          variant="destructive"
          size="icon-sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="border-2 border-primary rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Image className="h-4 w-4" />
          Logo Bar Block
          {canSetOverrides && breakpoint !== "desktop" && (
            <span className="text-xs font-normal text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
              Editing {breakpoint}
            </span>
          )}
        </h4>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setIsEditing(false)}>
            Done
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <FormItem>
          <Label htmlFor="logobar-heading">Heading (Optional)</Label>
          <Input
            id="logobar-heading"
            value={block.data.heading || ""}
            onChange={(e) => handleDataChange("heading", e.target.value)}
            placeholder="e.g., Trusted by leading companies"
          />
        </FormItem>

        <div>
          <FormItem className="flex items-center justify-between mb-2">
            <Label>Logos</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddLogo}
            >
              <PlusCircle className="h-3 w-3 mr-1" />
              Add Logo
            </Button>
          </FormItem>

          <div className="space-y-3">
            {block.data.logos.map((logo, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 space-y-2 bg-[var(--el-100)]/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {logo.src ? (
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="h-6 w-auto object-contain"
                      />
                    ) : (
                      <Image className="h-4 w-4 text-[var(--el-500)] shrink-0" />
                    )}
                    <span className="text-sm truncate">
                      {logo.alt || `Logo ${index + 1}`}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveLogo(index)}
                    disabled={block.data.logos.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <FormItem>
                    <Label htmlFor={`logo-${index}-src`}>Image URL</Label>
                    <Input
                      id={`logo-${index}-src`}
                      value={logo.src}
                      onChange={(e) =>
                        handleLogoChange(index, "src", e.target.value)
                      }
                      placeholder="https://example.com/logo.svg"
                    />
                  </FormItem>
                  <div className="grid grid-cols-2 gap-2">
                    <FormItem>
                      <Label htmlFor={`logo-${index}-alt`}>Alt Text</Label>
                      <Input
                        id={`logo-${index}-alt`}
                        value={logo.alt}
                        onChange={(e) =>
                          handleLogoChange(index, "alt", e.target.value)
                        }
                        placeholder="Company name"
                      />
                    </FormItem>
                    <FormItem>
                      <Label htmlFor={`logo-${index}-href`}>
                        Link (Optional)
                      </Label>
                      <Input
                        id={`logo-${index}-href`}
                        value={logo.href || ""}
                        onChange={(e) =>
                          handleLogoChange(index, "href", e.target.value)
                        }
                        placeholder="https://example.com"
                      />
                    </FormItem>
                  </div>
                </div>
              </div>
            ))}
            {block.data.logos.length === 0 && (
              <p className="text-sm text-[var(--el-500)] text-center py-4">
                No logos yet. Click &quot;Add Logo&quot; to start.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormItem>
            <Label htmlFor="logobar-variant">Style</Label>
            <Select
              value={variant}
              onValueChange={(value) => handleDataChange("variant", value)}
            >
              <SelectTrigger id="logobar-variant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="grayscale">Grayscale</SelectItem>
                <SelectItem value="bordered">Bordered</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          <ResponsiveField
            fieldName="size"
            data={block.data}
            onChange={(newData) =>
              onChange({
                ...block,
                data: newData as LogoBarBlockData["data"],
              })
            }
            label="Size"
          >
            <Select
              value={size}
              onValueChange={(value) => handleDataChange("size", value)}
            >
              <SelectTrigger id="logobar-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </ResponsiveField>
        </div>

        <div className="border rounded-lg p-4 bg-[var(--el-100)]/30">
          <p className="text-xs text-[var(--el-500)] mb-2">
            Preview ({breakpoint}):
          </p>
          {block.data.heading && (
            <p className="text-sm text-[var(--el-500)] text-center mb-3">
              {block.data.heading}
            </p>
          )}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {block.data.logos.length === 0 ? (
              <div className="text-center text-[var(--el-500)] py-4">
                No logos yet
              </div>
            ) : (
              block.data.logos.map((logo, index) => (
                <div
                  key={index}
                  className={`${variantStyles[variant]}`}
                >
                  {logo.src ? (
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className={`${sizeStyles[size as keyof typeof sizeStyles]} w-auto object-contain`}
                    />
                  ) : (
                    <div
                      className={`${sizeStyles[size as keyof typeof sizeStyles]} w-20 bg-[var(--el-100)] rounded flex items-center justify-center`}
                    >
                      <Image className="h-4 w-4 text-[var(--el-500)]" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
