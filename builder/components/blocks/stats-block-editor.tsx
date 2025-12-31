"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, BarChart3, Plus, X, PlusCircle } from "lucide-react";
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

interface StatItem {
  label: string;
  value: string;
  description?: string;
  icon?: string;
}

interface StatsBlockData {
  _key: string;
  _type: "stats-block";
  data: {
    stats: StatItem[];
    layout?: "horizontal" | "vertical";
    variant?: "default" | "highlighted" | "bordered";
    _responsive?: {
      tablet?: Partial<Omit<StatsBlockData["data"], "_responsive" | "stats">>;
      mobile?: Partial<Omit<StatsBlockData["data"], "_responsive" | "stats">>;
    };
  };
}

interface StatsBlockEditorProps {
  block: StatsBlockData;
  onChange: (block: StatsBlockData) => void;
  onDelete: () => void;
}

export function StatsBlockEditor({
  block,
  onChange,
  onDelete,
}: StatsBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [expandedStats, setExpandedStats] = useState<number[]>([0]);
  const breakpoint = useCurrentBreakpoint();
  const canSetOverrides = useCanSetResponsiveOverrides();

  // Handle data changes with responsive support
  const handleDataChange = useResponsiveChange(block.data, (newData) =>
    onChange({ ...block, data: newData as StatsBlockData["data"] }),
  );

  // Direct handler for stats (not responsive)
  const handleStatsChange = (stats: StatItem[]) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        stats,
      },
    });
  };

  const handleStatChange = (
    index: number,
    field: keyof StatItem,
    value: unknown,
  ) => {
    const updatedStats = [...block.data.stats];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    handleStatsChange(updatedStats);
  };

  const handleAddStat = () => {
    const updatedStats = [
      ...block.data.stats,
      { label: "", value: "", description: "" },
    ];
    handleStatsChange(updatedStats);
  };

  const handleRemoveStat = (index: number) => {
    const updatedStats = block.data.stats.filter((_, i) => i !== index);
    handleStatsChange(updatedStats);
  };

  const toggleStat = (index: number) => {
    setExpandedStats((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  // Get responsive-aware layout
  const layout =
    getResponsiveValue<string>(block.data, "layout", breakpoint) ||
    "horizontal";
  const variant = block.data.variant || "default";

  const variantStyles = {
    default: "",
    highlighted: "bg-primary/5 border border-primary/20 rounded-lg p-4",
    bordered: "border-2 rounded-lg p-4",
  };

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <div
          className={`grid ${layout === "horizontal" ? "grid-cols-3" : "grid-cols-1"} gap-4`}
        >
          {block.data.stats.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-4">
              No stats yet. Click to add stats...
            </div>
          ) : (
            block.data.stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center ${variantStyles[variant]}`}
              >
                <div className="text-3xl font-bold text-primary">
                  {stat.value || "0"}
                </div>
                <div className="text-sm font-medium mt-1">
                  {stat.label || "Label"}
                </div>
                {stat.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.description}
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
          <BarChart3 className="h-4 w-4" />
          Stats Block
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
        <div>
          <FormItem className="flex items-center justify-between mb-2">
            <Label>Statistics</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddStat}
            >
              <PlusCircle className="h-3 w-3 mr-1" />
              Add Stat
            </Button>
          </FormItem>

          <div className="space-y-3">
            {block.data.stats.map((stat, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 space-y-2 bg-muted/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <Button
                    type="button"
                    onClick={() => toggleStat(index)}
                    className="flex-1 text-left"
                  >
                    <div className="font-bold text-lg text-primary">
                      {stat.value || "0"}
                    </div>
                    <div className="text-sm font-medium">
                      {stat.label || `Stat ${index + 1}`}
                    </div>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveStat(index)}
                    disabled={block.data.stats.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {expandedStats.includes(index) && (
                  <div className="space-y-2 pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <FormItem>
                        <Label htmlFor={`stat-${index}-value`}>Value</Label>
                        <Input
                          id={`stat-${index}-value`}
                          value={stat.value}
                          onChange={(e) =>
                            handleStatChange(index, "value", e.target.value)
                          }
                          placeholder="e.g., 1000+"
                        />
                      </FormItem>
                      <FormItem>
                        <Label htmlFor={`stat-${index}-label`}>Label</Label>
                        <Input
                          id={`stat-${index}-label`}
                          value={stat.label}
                          onChange={(e) =>
                            handleStatChange(index, "label", e.target.value)
                          }
                          placeholder="e.g., Customers"
                        />
                      </FormItem>
                    </div>
                    <FormItem>
                      <Label htmlFor={`stat-${index}-description`}>
                        Description (Optional)
                      </Label>
                      <Textarea
                        id={`stat-${index}-description`}
                        value={stat.description || ""}
                        onChange={(e) =>
                          handleStatChange(index, "description", e.target.value)
                        }
                        placeholder="Additional context..."
                        rows={2}
                      />
                    </FormItem>
                    <FormItem>
                      <Label htmlFor={`stat-${index}-icon`}>
                        Icon (Optional)
                      </Label>
                      <Input
                        id={`stat-${index}-icon`}
                        value={stat.icon || ""}
                        onChange={(e) =>
                          handleStatChange(index, "icon", e.target.value)
                        }
                        placeholder="e.g., TrendingUp"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Lucide icon name
                      </p>
                    </FormItem>
                  </div>
                )}
              </div>
            ))}
            {block.data.stats.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No stats yet. Click &quot;Add Stat&quot; to start.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Layout - Responsive aware */}
          <ResponsiveField
            fieldName="layout"
            data={block.data}
            onChange={(newData) =>
              onChange({ ...block, data: newData as StatsBlockData["data"] })
            }
            label="Layout"
          >
            <Select
              value={layout}
              onValueChange={(value) => handleDataChange("layout", value)}
            >
              <SelectTrigger id="stats-layout">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="horizontal">Horizontal</SelectItem>
                <SelectItem value="vertical">Vertical</SelectItem>
              </SelectContent>
            </Select>
          </ResponsiveField>

          <FormItem>
            <Label htmlFor="stats-variant">Style</Label>
            <Select
              value={variant}
              onValueChange={(value) => handleDataChange("variant", value)}
            >
              <SelectTrigger id="stats-variant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="highlighted">Highlighted</SelectItem>
                <SelectItem value="bordered">Bordered</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </div>

        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">
            Preview ({breakpoint}):
          </p>
          <div
            className={`grid ${layout === "horizontal" ? "grid-cols-3" : "grid-cols-1"} gap-4`}
          >
            {block.data.stats.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-4">
                No stats yet
              </div>
            ) : (
              block.data.stats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center ${variantStyles[variant]}`}
                >
                  <div className="text-3xl font-bold text-primary">
                    {stat.value || "0"}
                  </div>
                  <div className="text-sm font-medium mt-1">
                    {stat.label || "Label"}
                  </div>
                  {stat.description && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {stat.description}
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
