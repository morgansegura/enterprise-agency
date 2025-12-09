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
import { Trash2, List, Plus, X, Check, Circle } from "lucide-react";
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

interface ListItem {
  text: string;
  icon?: string;
}

interface ListBlockData {
  _key: string;
  _type: "list-block";
  data: {
    items: ListItem[];
    ordered?: boolean;
    style?: "default" | "checkmarks" | "bullets" | "numbers";
    spacing?: "compact" | "comfortable";
    _responsive?: {
      tablet?: Partial<Omit<ListBlockData["data"], "_responsive" | "items">>;
      mobile?: Partial<Omit<ListBlockData["data"], "_responsive" | "items">>;
    };
  };
}

interface ListBlockEditorProps {
  block: ListBlockData;
  onChange: (block: ListBlockData) => void;
  onDelete: () => void;
}

export function ListBlockEditor({
  block,
  onChange,
  onDelete,
}: ListBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const breakpoint = useCurrentBreakpoint();
  const canSetOverrides = useCanSetResponsiveOverrides();

  // Handle data changes with responsive support
  const handleDataChange = useResponsiveChange(block.data, (newData) =>
    onChange({ ...block, data: newData as ListBlockData["data"] }),
  );

  // Direct handler for items (not responsive)
  const handleItemsChange = (items: ListItem[]) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        items,
      },
    });
  };

  const handleItemChange = (index: number, text: string) => {
    const updatedItems = [...block.data.items];
    updatedItems[index] = { ...updatedItems[index], text };
    handleItemsChange(updatedItems);
  };

  const handleAddItem = () => {
    const updatedItems = [...block.data.items, { text: "" }];
    handleItemsChange(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = block.data.items.filter((_, i) => i !== index);
    handleItemsChange(updatedItems);
  };

  const ordered = block.data.ordered ?? false;
  const style = block.data.style || "default";
  // Get responsive-aware spacing
  const spacing =
    getResponsiveValue<string>(block.data, "spacing", breakpoint) ||
    "comfortable";

  const spacingMap = {
    compact: "space-y-1",
    comfortable: "space-y-2",
  };

  const getListIcon = (index: number) => {
    if (style === "checkmarks") {
      return <Check className="h-4 w-4 text-primary flex-shrink-0" />;
    }
    if (style === "bullets") {
      return <Circle className="h-2 w-2 fill-current flex-shrink-0 mt-2" />;
    }
    if (style === "numbers" || ordered) {
      return (
        <span className="font-semibold text-primary flex-shrink-0">
          {index + 1}.
        </span>
      );
    }
    return <Circle className="h-2 w-2 fill-current flex-shrink-0 mt-2" />;
  };

  const ListTag = ordered || style === "numbers" ? "ol" : "ul";

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <ListTag className={spacingMap[spacing]}>
          {block.data.items.length === 0 ? (
            <li className="text-muted-foreground">
              No items yet. Click to add items...
            </li>
          ) : (
            block.data.items.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                {getListIcon(index)}
                <span>{item.text || "Empty item"}</span>
              </li>
            ))
          )}
        </ListTag>
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
          <List className="h-4 w-4" />
          List Block
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
            <Label>List Items</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddItem}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Item
            </Button>
          </FormItem>
          <div className="space-y-2">
            {block.data.items.map((item, index) => (
              <FormItem key={index} className="flex gap-2">
                <Input
                  value={item.text}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  placeholder={`Item ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(index)}
                  disabled={block.data.items.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </FormItem>
            ))}
            {block.data.items.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No items yet. Click "Add Item" to start.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormItem>
            <Label htmlFor="list-style">Style</Label>
            <Select
              value={style}
              onValueChange={(value) => handleDataChange("style", value)}
            >
              <SelectTrigger id="list-style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="checkmarks">Checkmarks</SelectItem>
                <SelectItem value="bullets">Bullets</SelectItem>
                <SelectItem value="numbers">Numbers</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          {/* Spacing - Responsive aware */}
          <ResponsiveField
            fieldName="spacing"
            data={block.data}
            onChange={(newData) =>
              onChange({ ...block, data: newData as ListBlockData["data"] })
            }
            label="Spacing"
          >
            <Select
              value={spacing}
              onValueChange={(value) => handleDataChange("spacing", value)}
            >
              <SelectTrigger id="list-spacing">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="comfortable">Comfortable</SelectItem>
              </SelectContent>
            </Select>
          </ResponsiveField>
        </div>

        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">
            Preview ({breakpoint}):
          </p>
          <ListTag className={spacingMap[spacing]}>
            {block.data.items.length === 0 ? (
              <li className="text-muted-foreground">
                No items yet. Add items above.
              </li>
            ) : (
              block.data.items.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  {getListIcon(index)}
                  <span>{item.text || "Empty item"}</span>
                </li>
              ))
            )}
          </ListTag>
        </div>
      </div>
    </div>
  );
}
