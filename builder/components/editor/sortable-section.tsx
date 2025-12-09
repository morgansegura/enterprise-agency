"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Settings, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Section } from "@/lib/hooks/use-pages";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SectionSettings } from "./section-settings";

interface SortableSectionProps {
  section: Section;
  onSectionChange: (section: Section) => void;
  onDelete: () => void;
  children: React.ReactNode;
}

/**
 * Sortable Section Component
 *
 * Wraps a section with drag-and-drop functionality and section-level controls.
 *
 * Features:
 * - Drag handle for reordering sections
 * - Settings button to edit section properties
 * - Delete button to remove section
 * - Visual feedback during dragging
 *
 * Usage:
 * ```tsx
 * <SortableSection
 *   section={section}
 *   onSectionChange={handleSectionChange}
 *   onDelete={handleDelete}
 * >
 *   {section content}
 * </SortableSection>
 * ```
 */
export function SortableSection({
  section,
  onSectionChange,
  onDelete,
  children,
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section._key });

  const [showSettings, setShowSettings] = React.useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={cn(
          "group relative border-2 border-dashed border-muted hover:border-primary/50 transition-colors",
          isDragging && "opacity-50 cursor-grabbing",
        )}
      >
        {/* Section Controls - Top Bar */}
        <div className="absolute -top-10 left-0 right-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            {/* Drag Handle */}
            <button
              {...attributes}
              {...listeners}
              className="p-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md bg-background border shadow-sm"
              aria-label="Drag to reorder section"
              title="Drag to reorder"
            >
              <GripVertical className="h-4 w-4" />
            </button>

            <span className="text-xs font-medium text-muted-foreground bg-background px-2 py-1 rounded border shadow-sm">
              Section {section.blocks.length}{" "}
              {section.blocks.length === 1 ? "block" : "blocks"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Settings Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="shadow-sm"
            >
              <Settings className="h-3 w-3 mr-1" />
              Settings
            </Button>

            {/* Delete Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-destructive hover:text-destructive shadow-sm"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>

        {/* Section Content */}
        <div className="p-6">{children}</div>
      </Card>

      {/* Settings Sheet */}
      <Sheet open={showSettings} onOpenChange={setShowSettings}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Section Settings</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <SectionSettings
              section={section}
              onChange={onSectionChange}
              onClose={() => setShowSettings(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
