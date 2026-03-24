"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ArrayFieldSchema, FieldSchema } from "@/lib/schemas";

import "./array-field.css";

// Forward declare FieldRenderer to avoid circular dependency
// This will be passed as a prop
type FieldRendererComponent = React.ComponentType<{
  schema: FieldSchema;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  className?: string;
}>;

export interface ArrayFieldProps {
  schema: ArrayFieldSchema;
  value: unknown[];
  onChange: (value: unknown[]) => void;
  error?: string;
  className?: string;
  renderField?: FieldRendererComponent;
}

interface ArrayItemProps {
  id: string;
  index: number;
  item: Record<string, unknown>;
  schema: ArrayFieldSchema;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (updates: Record<string, unknown>) => void;
  onRemove: () => void;
  renderField?: FieldRendererComponent;
  canRemove: boolean;
}

function SortableArrayItem({
  id,
  index,
  item,
  schema,
  isExpanded,
  onToggle,
  onUpdate,
  onRemove,
  renderField: FieldRenderer,
  canRemove,
}: ArrayItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Get preview text for collapsed items
  const getPreviewText = (): string => {
    const fields = schema.itemSchema.fields;
    // Find first text-like field
    for (const field of fields) {
      if (field.type === "text" || field.type === "textarea") {
        const val = item[field.name];
        if (typeof val === "string" && val.trim()) {
          return val.length > 50 ? val.substring(0, 50) + "..." : val;
        }
      }
    }
    return `${schema.itemSchema.label} ${index + 1}`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "array-field__item",
        isDragging && "array-field__item--dragging",
      )}
    >
      <div className="array-field__item-header">
        <button
          type="button"
          className="array-field__item-drag"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="array-field__item-drag-icon" />
        </button>

        {schema.collapsible !== false && (
          <button
            type="button"
            className="array-field__item-toggle"
            onClick={onToggle}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <ChevronDown className="array-field__item-toggle-icon" />
            ) : (
              <ChevronRight className="array-field__item-toggle-icon" />
            )}
          </button>
        )}

        <span className="array-field__item-label">
          {isExpanded ? schema.itemSchema.label : getPreviewText()}
        </span>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          disabled={!canRemove}
          className="array-field__item-remove"
          aria-label="Remove item"
        >
          <Trash2 className="array-field__item-remove-icon" />
        </Button>
      </div>

      {(isExpanded || schema.collapsible === false) && (
        <div className="array-field__item-content">
          {schema.itemSchema.fields.map((field) => {
            if (!FieldRenderer) {
              return (
                <div key={field.name} className="array-field__placeholder">
                  {field.label}: {JSON.stringify(item[field.name])}
                </div>
              );
            }

            return (
              <FieldRenderer
                key={field.name}
                schema={field}
                value={item[field.name]}
                onChange={(val) => onUpdate({ [field.name]: val })}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * ArrayField - Field editor for managing arrays of items
 *
 * Supports:
 * - Add/remove items
 * - Reorder via drag-and-drop
 * - Collapsible items
 * - Nested field rendering
 */
export function ArrayField({
  schema,
  value,
  onChange,
  error,
  className,
  renderField,
}: ArrayFieldProps) {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
    new Set(schema.defaultExpanded !== false ? ["0"] : []),
  );

  // Ensure value is always an array
  const items = React.useMemo(() => {
    if (!value || !Array.isArray(value)) return [];
    return value.map((item, index) => ({
      id: `item-${index}`,
      data: item as Record<string, unknown>,
    }));
  }, [value]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      onChange(newItems.map((i) => i.data));
    }
  };

  const handleAdd = () => {
    // Create new item with default values from schema
    const newItem: Record<string, unknown> = {};
    for (const field of schema.itemSchema.fields) {
      if (field.defaultValue !== undefined) {
        newItem[field.name] = field.defaultValue;
      } else if (field.type === "boolean") {
        newItem[field.name] = false;
      } else if (field.type === "number") {
        newItem[field.name] = 0;
      } else {
        newItem[field.name] = "";
      }
    }

    const newItems = [...(value || []), newItem];
    onChange(newItems);

    // Expand new item
    const newIndex = newItems.length - 1;
    setExpandedItems((prev) => new Set([...prev, newIndex.toString()]));
  };

  const handleUpdate = (index: number, updates: Record<string, unknown>) => {
    const newItems = [...(value || [])];
    newItems[index] = { ...(newItems[index] as object), ...updates };
    onChange(newItems);
  };

  const handleRemove = (index: number) => {
    const newItems = (value || []).filter((_, i) => i !== index);
    onChange(newItems);
  };

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      const key = index.toString();
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const hasError = !!error;
  const canAdd = !schema.maxItems || items.length < schema.maxItems;
  const canRemove = !schema.minItems || items.length > schema.minItems;

  return (
    <div className={cn("array-field", className)} data-width={schema.width}>
      <Label className="array-field__label">
        {schema.label}
        {schema.validation?.required && (
          <span className="array-field__required">*</span>
        )}
        <span className="array-field__count">({items.length})</span>
      </Label>

      <div
        className={cn(
          "array-field__container",
          hasError && "array-field__container--error",
        )}
      >
        {items.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="array-field__items">
                {items.map((item, index) => (
                  <SortableArrayItem
                    key={item.id}
                    id={item.id}
                    index={index}
                    item={item.data}
                    schema={schema}
                    isExpanded={expandedItems.has(index.toString())}
                    onToggle={() => toggleExpanded(index)}
                    onUpdate={(updates) => handleUpdate(index, updates)}
                    onRemove={() => handleRemove(index)}
                    renderField={renderField}
                    canRemove={canRemove}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="array-field__empty">
            <p className="array-field__empty-text">No items yet</p>
          </div>
        )}

        {canAdd && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="array-field__add-btn"
          >
            <Plus className="array-field__add-icon" />
            {schema.addLabel || `Add ${schema.itemSchema.label}`}
          </Button>
        )}
      </div>

      {schema.description && !hasError && (
        <p className="array-field__description">{schema.description}</p>
      )}

      {hasError && <p className="array-field__error">{error}</p>}
    </div>
  );
}
