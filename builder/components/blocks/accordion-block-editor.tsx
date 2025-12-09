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
import { Trash2, ChevronDown, Plus, X } from "lucide-react";
import { FormItem } from "@/components/ui/form";

interface AccordionItem {
  title: string;
  content: string;
  defaultOpen?: boolean;
}

interface AccordionBlockData {
  _key: string;
  _type: "accordion-block";
  data: {
    items: AccordionItem[];
    allowMultiple?: boolean;
    variant?: "default" | "bordered" | "separated";
  };
}

interface AccordionBlockEditorProps {
  block: AccordionBlockData;
  onChange: (block: AccordionBlockData) => void;
  onDelete: () => void;
}

export function AccordionBlockEditor({
  block,
  onChange,
  onDelete,
}: AccordionBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [expandedItems, setExpandedItems] = useState<number[]>([0]);

  const handleDataChange = (field: string, value: unknown) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        [field]: value,
      },
    });
  };

  const handleItemChange = (
    index: number,
    field: keyof AccordionItem,
    value: unknown,
  ) => {
    const updatedItems = [...block.data.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    handleDataChange("items", updatedItems);
  };

  const handleAddItem = () => {
    const updatedItems = [
      ...block.data.items,
      { title: "", content: "", defaultOpen: false },
    ];
    handleDataChange("items", updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = block.data.items.filter((_, i) => i !== index);
    handleDataChange("items", updatedItems);
  };

  const toggleItem = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const allowMultiple = block.data.allowMultiple ?? false;
  const variant = block.data.variant || "default";

  const variantStyles = {
    default: "border rounded-lg divide-y",
    bordered: "border-2 rounded-lg divide-y",
    separated: "space-y-2",
  };

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <div className={variantStyles[variant]}>
          {block.data.items.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No accordion items yet. Click to add items...
            </div>
          ) : (
            block.data.items.map((item, index) => (
              <div
                key={index}
                className={variant === "separated" ? "border rounded-lg" : ""}
              >
                <div className="flex items-center justify-between p-3">
                  <span className="font-medium text-sm">
                    {item.title || `Item ${index + 1}`}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </div>
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
          <ChevronDown className="h-4 w-4" />
          Accordion Block
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
            <Label>Accordion Items</Label>
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

          <div className="space-y-3">
            {block.data.items.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 space-y-2 bg-muted/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    className="flex-1 text-left font-medium text-sm hover:text-primary transition-colors"
                  >
                    {item.title || `Item ${index + 1}`}
                    <ChevronDown
                      className={`inline-block h-3 w-3 ml-1 transition-transform ${expandedItems.includes(index) ? "rotate-180" : ""}`}
                    />
                  </button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveItem(index)}
                    disabled={block.data.items.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {expandedItems.includes(index) && (
                  <div className="space-y-2 pt-2">
                    <FormItem>
                      <Label htmlFor={`item-${index}-title`}>Title</Label>
                      <Input
                        id={`item-${index}-title`}
                        value={item.title}
                        onChange={(e) =>
                          handleItemChange(index, "title", e.target.value)
                        }
                        placeholder="Accordion title"
                      />
                    </FormItem>
                    <FormItem>
                      <Label htmlFor={`item-${index}-content`}>Content</Label>
                      <Textarea
                        id={`item-${index}-content`}
                        value={item.content}
                        onChange={(e) =>
                          handleItemChange(index, "content", e.target.value)
                        }
                        placeholder="Accordion content..."
                        rows={3}
                      />
                    </FormItem>
                    <FormItem className="flex items-center gap-2">
                      <Input
                        type="checkbox"
                        id={`item-${index}-default`}
                        checked={item.defaultOpen || false}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "defaultOpen",
                            e.target.checked,
                          )
                        }
                        className="h-4 w-4"
                      />
                      <Label
                        htmlFor={`item-${index}-default`}
                        className="cursor-pointer"
                      >
                        Open by default
                      </Label>
                    </FormItem>
                  </div>
                )}
              </div>
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
            <Label htmlFor="accordion-variant">Style</Label>
            <Select
              value={variant}
              onValueChange={(value) => handleDataChange("variant", value)}
            >
              <SelectTrigger id="accordion-variant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="bordered">Bordered</SelectItem>
                <SelectItem value="separated">Separated</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          <div className="flex items-end">
            <FormItem className="flex items-center gap-2">
              <Input
                type="checkbox"
                id="accordion-multiple"
                checked={allowMultiple}
                onChange={(e) =>
                  handleDataChange("allowMultiple", e.target.checked)
                }
                className="h-4 w-4"
              />
              <Label
                htmlFor="accordion-multiple"
                className="cursor-pointer text-sm"
              >
                Allow multiple open
              </Label>
            </FormItem>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
          <div className={variantStyles[variant]}>
            {block.data.items.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No items yet
              </div>
            ) : (
              block.data.items.map((item, index) => (
                <div
                  key={index}
                  className={variant === "separated" ? "border rounded-lg" : ""}
                >
                  <div className="flex items-center justify-between p-3">
                    <span className="font-medium text-sm">
                      {item.title || `Item ${index + 1}`}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
