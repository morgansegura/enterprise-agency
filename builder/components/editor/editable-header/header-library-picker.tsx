"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useHeaders, type Header } from "@/lib/hooks/use-headers";
import { Check, Plus, PlusCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";

import "./header-library-picker.css";

interface HeaderLibraryPickerProps {
  tenantId: string;
  currentHeaderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (headerId: string | null) => void;
}

/**
 * Header Library Picker
 *
 * Modal to select a header from the library:
 * - Shows all available headers
 * - Highlights current selection
 * - Option to create new header
 * - Option to use no header
 */
export function HeaderLibraryPicker({
  tenantId,
  currentHeaderId,
  open,
  onOpenChange,
  onSelect,
}: HeaderLibraryPickerProps) {
  const { data: headers = [], isLoading } = useHeaders(tenantId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="header-library-picker">
        <DialogHeader>
          <DialogTitle>Choose Header</DialogTitle>
        </DialogHeader>

        <div className="header-library-content">
          {isLoading ? (
            <div className="header-library-loading">Loading headers...</div>
          ) : (
            <>
              {/* No header option */}
              <button
                className={cn(
                  "header-library-item",
                  currentHeaderId === "none" && "is-selected",
                )}
                onClick={() => onSelect("none")}
              >
                <div className="header-library-item-preview header-library-item-none">
                  <span>No Header</span>
                </div>
                <div className="header-library-item-info">
                  <span className="header-library-item-name">None</span>
                  <span className="header-library-item-desc">
                    Page without header
                  </span>
                </div>
                {currentHeaderId === "none" && (
                  <Check className="header-library-item-check" />
                )}
              </button>

              {/* Default header option */}
              <button
                className={cn(
                  "header-library-item",
                  (currentHeaderId === "default" || currentHeaderId === null) &&
                    "is-selected",
                )}
                onClick={() => onSelect("default")}
              >
                <div className="header-library-item-preview">
                  <div className="header-library-preview-bar" />
                </div>
                <div className="header-library-item-info">
                  <span className="header-library-item-name">
                    Default Header
                    <Star className="h-3 w-3 text-amber-500" />
                  </span>
                  <span className="header-library-item-desc">
                    Uses site default
                  </span>
                </div>
                {(currentHeaderId === "default" ||
                  currentHeaderId === null) && (
                  <Check className="header-library-item-check" />
                )}
              </button>

              {/* Available headers */}
              {headers.map((header) => (
                <button
                  key={header.id}
                  className={cn(
                    "header-library-item",
                    currentHeaderId === header.id && "is-selected",
                  )}
                  onClick={() => onSelect(header.id)}
                >
                  <HeaderPreview header={header} />
                  <div className="header-library-item-info">
                    <span className="header-library-item-name">
                      {header.name}
                      {header.isDefault && (
                        <Star className="h-3 w-3 text-amber-500" />
                      )}
                    </span>
                    <span className="header-library-item-desc">
                      {header.behavior.toLowerCase().replace("_", " ")}
                    </span>
                  </div>
                  {currentHeaderId === header.id && (
                    <Check className="header-library-item-check" />
                  )}
                </button>
              ))}

              {/* Create new option */}
              <button
                className="header-library-item header-library-item-create"
                onClick={() => {
                  // TODO: Open create header modal or navigate
                  onOpenChange(false);
                }}
              >
                <div className="header-library-item-preview header-library-item-new">
                  <PlusCircle className="h-5 w-5" />
                </div>
                <div className="header-library-item-info">
                  <span className="header-library-item-name">Create New</span>
                  <span className="header-library-item-desc">
                    Start from scratch
                  </span>
                </div>
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Mini preview of a header
 */
function HeaderPreview({ header }: { header: Header }) {
  return (
    <div
      className="header-library-item-preview"
      style={{
        backgroundColor: header.style?.backgroundColor || "#ffffff",
      }}
    >
      <div className="header-library-preview-bar">
        {/* Left zone */}
        <div className="header-library-preview-zone">
          {header.zones?.left?.logo?.src && (
            <div className="header-library-preview-logo" />
          )}
        </div>
        {/* Center zone */}
        <div className="header-library-preview-zone header-library-preview-center">
          {header.zones?.center?.menuId && (
            <div className="header-library-preview-menu" />
          )}
        </div>
        {/* Right zone */}
        <div className="header-library-preview-zone">
          {header.zones?.right?.blocks?.length && (
            <div className="header-library-preview-button" />
          )}
        </div>
      </div>
    </div>
  );
}
