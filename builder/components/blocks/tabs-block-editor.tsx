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
import { Trash2, LayoutGrid, Plus, X } from "lucide-react";
import { FormItem } from "@/components/ui/form";

interface TabItem {
  label: string;
  content: string;
  icon?: string;
}

interface TabsBlockData {
  _key: string;
  _type: "tabs-block";
  data: {
    tabs: TabItem[];
    defaultTab?: number;
    variant?: "default" | "pills" | "underline";
  };
}

interface TabsBlockEditorProps {
  block: TabsBlockData;
  onChange: (block: TabsBlockData) => void;
  onDelete: () => void;
}

export function TabsBlockEditor({
  block,
  onChange,
  onDelete,
}: TabsBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeEditTab, setActiveEditTab] = useState(0);

  const handleDataChange = (field: string, value: unknown) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        [field]: value,
      },
    });
  };

  const handleTabChange = (
    index: number,
    field: keyof TabItem,
    value: unknown,
  ) => {
    const updatedTabs = [...block.data.tabs];
    updatedTabs[index] = { ...updatedTabs[index], [field]: value };
    handleDataChange("tabs", updatedTabs);
  };

  const handleAddTab = () => {
    const updatedTabs = [...block.data.tabs, { label: "", content: "" }];
    handleDataChange("tabs", updatedTabs);
    setActiveEditTab(updatedTabs.length - 1);
  };

  const handleRemoveTab = (index: number) => {
    const updatedTabs = block.data.tabs.filter((_, i) => i !== index);
    handleDataChange("tabs", updatedTabs);
    if (activeEditTab >= updatedTabs.length) {
      setActiveEditTab(Math.max(0, updatedTabs.length - 1));
    }
  };

  const variant = block.data.variant || "default";
  const defaultTab = block.data.defaultTab ?? 0;

  const variantStyles = {
    default: "border-b",
    pills: "bg-muted rounded-lg p-1",
    underline: "",
  };

  const tabStyles = {
    default: "px-4 py-2 border-b-2 border-transparent",
    pills: "px-4 py-2 rounded-md",
    underline: "px-4 py-2 border-b-2 border-transparent",
  };

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <div className={`flex gap-1 ${variantStyles[variant]}`}>
          {block.data.tabs.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No tabs yet. Click to add tabs...
            </div>
          ) : (
            block.data.tabs.map((tab, index) => (
              <div
                key={index}
                className={`${tabStyles[variant]} text-sm font-medium ${index === defaultTab ? "text-primary" : "text-muted-foreground"}`}
              >
                {tab.label || `Tab ${index + 1}`}
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
          <LayoutGrid className="h-4 w-4" />
          Tabs Block
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
          <div className="flex items-center justify-between mb-2">
            <Label>Tabs</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddTab}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Tab
            </Button>
          </div>

          {block.data.tabs.length > 0 && (
            <div className="space-y-3">
              {/* Tab navigation */}
              <div className="flex gap-1 border-b">
                {block.data.tabs.map((tab, index) => (
                  <Button
                    key={index}
                    type="button"
                    onClick={() => setActiveEditTab(index)}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                      activeEditTab === index
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label || `Tab ${index + 1}`}
                  </Button>
                ))}
              </div>

              {/* Active tab editor */}
              <div className="border rounded-lg p-3 space-y-3 bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Editing:{" "}
                    {block.data.tabs[activeEditTab]?.label ||
                      `Tab ${activeEditTab + 1}`}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveTab(activeEditTab)}
                    disabled={block.data.tabs.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <FormItem>
                  <Label htmlFor="tab-label">Tab Label</Label>
                  <Input
                    id="tab-label"
                    value={block.data.tabs[activeEditTab]?.label || ""}
                    onChange={(e) =>
                      handleTabChange(activeEditTab, "label", e.target.value)
                    }
                    placeholder="Tab label"
                  />
                </FormItem>

                <FormItem>
                  <Label htmlFor="tab-content">Tab Content</Label>
                  <Textarea
                    id="tab-content"
                    value={block.data.tabs[activeEditTab]?.content || ""}
                    onChange={(e) =>
                      handleTabChange(activeEditTab, "content", e.target.value)
                    }
                    placeholder="Tab content..."
                    rows={4}
                  />
                </FormItem>

                <FormItem>
                  <Label htmlFor="tab-icon">Icon (Optional)</Label>
                  <Input
                    id="tab-icon"
                    value={block.data.tabs[activeEditTab]?.icon || ""}
                    onChange={(e) =>
                      handleTabChange(activeEditTab, "icon", e.target.value)
                    }
                    placeholder="e.g., Star"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Lucide icon name
                  </p>
                </FormItem>
              </div>
            </div>
          )}

          {block.data.tabs.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No tabs yet. Click &quot;Add Tab&quot; to start.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormItem>
            <Label htmlFor="tabs-variant">Style</Label>
            <Select
              value={variant}
              onValueChange={(value) => handleDataChange("variant", value)}
            >
              <SelectTrigger id="tabs-variant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="pills">Pills</SelectItem>
                <SelectItem value="underline">Underline</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          <FormItem>
            <Label htmlFor="tabs-default">Default Tab</Label>
            <Select
              value={defaultTab.toString()}
              onValueChange={(value) =>
                handleDataChange("defaultTab", parseInt(value))
              }
            >
              <SelectTrigger id="tabs-default">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {block.data.tabs.map((tab, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {tab.label || `Tab ${index + 1}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        </div>

        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
          <div className={`flex gap-1 ${variantStyles[variant]}`}>
            {block.data.tabs.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No tabs yet
              </div>
            ) : (
              block.data.tabs.map((tab, index) => (
                <div
                  key={index}
                  className={`${tabStyles[variant]} text-sm font-medium ${index === defaultTab ? "text-primary" : "text-muted-foreground"}`}
                >
                  {tab.label || `Tab ${index + 1}`}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
