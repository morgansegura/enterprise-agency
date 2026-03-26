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
import { Trash2, MessageSquareQuote, X, PlusCircle } from "lucide-react";
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

interface TestimonialItem {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating?: number;
}

interface TestimonialBlockData {
  _key: string;
  _type: "testimonial-block";
  data: {
    testimonials: TestimonialItem[];
    layout?: "grid" | "carousel" | "single";
    columns?: 1 | 2 | 3;
    variant?: "default" | "card" | "minimal";
    showRating?: boolean;
    _responsive?: {
      tablet?: Partial<
        Omit<TestimonialBlockData["data"], "_responsive" | "testimonials">
      >;
      mobile?: Partial<
        Omit<TestimonialBlockData["data"], "_responsive" | "testimonials">
      >;
    };
  };
}

interface TestimonialBlockEditorProps {
  block: TestimonialBlockData;
  onChange: (block: TestimonialBlockData) => void;
  onDelete: () => void;
}

export function TestimonialBlockEditor({
  block,
  onChange,
  onDelete,
}: TestimonialBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [expandedItems, setExpandedItems] = useState<number[]>([0]);
  const breakpoint = useCurrentBreakpoint();
  const canSetOverrides = useCanSetResponsiveOverrides();

  const handleDataChange = useResponsiveChange(block.data, (newData) =>
    onChange({
      ...block,
      data: newData as TestimonialBlockData["data"],
    }),
  );

  const handleTestimonialsChange = (testimonials: TestimonialItem[]) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        testimonials,
      },
    });
  };

  const handleItemChange = (
    index: number,
    field: keyof TestimonialItem,
    value: unknown,
  ) => {
    const updated = [...block.data.testimonials];
    updated[index] = { ...updated[index], [field]: value };
    handleTestimonialsChange(updated);
  };

  const handleAddTestimonial = () => {
    const updated = [
      ...block.data.testimonials,
      { quote: "", name: "", role: "", company: "" },
    ];
    handleTestimonialsChange(updated);
  };

  const handleRemoveTestimonial = (index: number) => {
    const updated = block.data.testimonials.filter((_, i) => i !== index);
    handleTestimonialsChange(updated);
  };

  const toggleItem = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index],
    );
  };

  const layout =
    getResponsiveValue<string>(block.data, "layout", breakpoint) || "grid";
  const columns =
    getResponsiveValue<number>(block.data, "columns", breakpoint) || 2;
  const variant = block.data.variant || "default";
  const showRating = block.data.showRating ?? false;

  const variantStyles = {
    default: "",
    card: "bg-card border rounded-lg p-4 shadow-sm",
    minimal: "border-l-2 border-primary pl-4",
  };

  const columnClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
  };

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <div
          className={`grid ${layout === "single" ? "grid-cols-1" : columnClass[columns]} gap-4`}
        >
          {block.data.testimonials.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-4">
              No testimonials yet. Click to add testimonials...
            </div>
          ) : (
            block.data.testimonials.map((item, index) => (
              <div
                key={index}
                className={`${variantStyles[variant]}`}
              >
                <p className="text-sm italic">
                  &ldquo;{item.quote || "Quote..."}&rdquo;
                </p>
                <div className="mt-2 text-xs font-medium">
                  {item.name || "Name"}
                  {item.role && (
                    <span className="text-muted-foreground">
                      {" "}
                      &middot; {item.role}
                    </span>
                  )}
                </div>
                {showRating && item.rating && (
                  <div className="text-xs text-yellow-500 mt-1">
                    {"★".repeat(item.rating)}
                    {"☆".repeat(5 - item.rating)}
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
          <MessageSquareQuote className="h-4 w-4" />
          Testimonial Block
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
            <Label>Testimonials</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddTestimonial}
            >
              <PlusCircle className="h-3 w-3 mr-1" />
              Add Testimonial
            </Button>
          </FormItem>

          <div className="space-y-3">
            {block.data.testimonials.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 space-y-2 bg-muted/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <Button
                    type="button"
                    onClick={() => toggleItem(index)}
                    className="flex-1 text-left"
                  >
                    <div className="text-sm font-medium">
                      {item.name || `Testimonial ${index + 1}`}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {item.quote || "No quote yet"}
                    </div>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveTestimonial(index)}
                    disabled={block.data.testimonials.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {expandedItems.includes(index) && (
                  <div className="space-y-2 pt-2">
                    <FormItem>
                      <Label htmlFor={`testimonial-${index}-quote`}>
                        Quote
                      </Label>
                      <Textarea
                        id={`testimonial-${index}-quote`}
                        value={item.quote}
                        onChange={(e) =>
                          handleItemChange(index, "quote", e.target.value)
                        }
                        placeholder="What did they say?"
                        rows={3}
                      />
                    </FormItem>
                    <div className="grid grid-cols-2 gap-2">
                      <FormItem>
                        <Label htmlFor={`testimonial-${index}-name`}>
                          Name
                        </Label>
                        <Input
                          id={`testimonial-${index}-name`}
                          value={item.name}
                          onChange={(e) =>
                            handleItemChange(index, "name", e.target.value)
                          }
                          placeholder="John Doe"
                        />
                      </FormItem>
                      <FormItem>
                        <Label htmlFor={`testimonial-${index}-role`}>
                          Role (Optional)
                        </Label>
                        <Input
                          id={`testimonial-${index}-role`}
                          value={item.role || ""}
                          onChange={(e) =>
                            handleItemChange(index, "role", e.target.value)
                          }
                          placeholder="CEO"
                        />
                      </FormItem>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <FormItem>
                        <Label htmlFor={`testimonial-${index}-company`}>
                          Company (Optional)
                        </Label>
                        <Input
                          id={`testimonial-${index}-company`}
                          value={item.company || ""}
                          onChange={(e) =>
                            handleItemChange(index, "company", e.target.value)
                          }
                          placeholder="Acme Inc."
                        />
                      </FormItem>
                      <FormItem>
                        <Label htmlFor={`testimonial-${index}-avatar`}>
                          Avatar URL (Optional)
                        </Label>
                        <Input
                          id={`testimonial-${index}-avatar`}
                          value={item.avatar || ""}
                          onChange={(e) =>
                            handleItemChange(index, "avatar", e.target.value)
                          }
                          placeholder="https://..."
                        />
                      </FormItem>
                    </div>
                    {showRating && (
                      <FormItem>
                        <Label htmlFor={`testimonial-${index}-rating`}>
                          Rating
                        </Label>
                        <Select
                          value={String(item.rating || 5)}
                          onValueChange={(value) =>
                            handleItemChange(index, "rating", Number(value))
                          }
                        >
                          <SelectTrigger
                            id={`testimonial-${index}-rating`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Star</SelectItem>
                            <SelectItem value="2">2 Stars</SelectItem>
                            <SelectItem value="3">3 Stars</SelectItem>
                            <SelectItem value="4">4 Stars</SelectItem>
                            <SelectItem value="5">5 Stars</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  </div>
                )}
              </div>
            ))}
            {block.data.testimonials.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No testimonials yet. Click &quot;Add Testimonial&quot; to
                start.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ResponsiveField
            fieldName="layout"
            data={block.data}
            onChange={(newData) =>
              onChange({
                ...block,
                data: newData as TestimonialBlockData["data"],
              })
            }
            label="Layout"
          >
            <Select
              value={layout}
              onValueChange={(value) => handleDataChange("layout", value)}
            >
              <SelectTrigger id="testimonial-layout">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
                <SelectItem value="single">Single</SelectItem>
              </SelectContent>
            </Select>
          </ResponsiveField>

          <ResponsiveField
            fieldName="columns"
            data={block.data}
            onChange={(newData) =>
              onChange({
                ...block,
                data: newData as TestimonialBlockData["data"],
              })
            }
            label="Columns"
          >
            <Select
              value={String(columns)}
              onValueChange={(value) =>
                handleDataChange("columns", Number(value))
              }
            >
              <SelectTrigger id="testimonial-columns">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Column</SelectItem>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
              </SelectContent>
            </Select>
          </ResponsiveField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormItem>
            <Label htmlFor="testimonial-variant">Style</Label>
            <Select
              value={variant}
              onValueChange={(value) => handleDataChange("variant", value)}
            >
              <SelectTrigger id="testimonial-variant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          <FormItem className="flex items-center gap-2 pt-6">
            <Input
              type="checkbox"
              id="testimonial-show-rating"
              checked={showRating}
              onChange={(e) =>
                handleDataChange("showRating", e.target.checked)
              }
              className="h-4 w-4"
            />
            <Label
              htmlFor="testimonial-show-rating"
              className="cursor-pointer"
            >
              Show Ratings
            </Label>
          </FormItem>
        </div>

        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">
            Preview ({breakpoint}):
          </p>
          <div
            className={`grid ${layout === "single" ? "grid-cols-1" : columnClass[columns]} gap-4`}
          >
            {block.data.testimonials.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-4">
                No testimonials yet
              </div>
            ) : (
              block.data.testimonials.map((item, index) => (
                <div
                  key={index}
                  className={`${variantStyles[variant]}`}
                >
                  <p className="text-sm italic">
                    &ldquo;{item.quote || "Quote..."}&rdquo;
                  </p>
                  <div className="mt-2 text-xs font-medium">
                    {item.name || "Name"}
                    {item.role && (
                      <span className="text-muted-foreground">
                        {" "}
                        &middot; {item.role}
                      </span>
                    )}
                  </div>
                  {showRating && item.rating && (
                    <div className="text-xs text-yellow-500 mt-1">
                      {"★".repeat(item.rating)}
                      {"☆".repeat(5 - item.rating)}
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
