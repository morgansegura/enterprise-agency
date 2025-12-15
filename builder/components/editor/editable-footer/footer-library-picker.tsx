"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFooters, type Footer } from "@/lib/hooks/use-footers";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

import "./footer-library-picker.css";

interface FooterLibraryPickerProps {
  tenantId: string;
  currentFooterId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (footerId: string | null) => void;
}

const layoutLabels: Record<string, string> = {
  SIMPLE: "Simple",
  COLUMNS: "Columns",
  STACKED: "Stacked",
  MINIMAL: "Minimal",
  CENTERED: "Centered",
};

/**
 * Footer Library Picker
 *
 * A modal dialog to select a footer from the library
 */
export function FooterLibraryPicker({
  tenantId,
  currentFooterId,
  open,
  onOpenChange,
  onSelect,
}: FooterLibraryPickerProps) {
  const { data: footers, isLoading } = useFooters(tenantId);

  const handleSelect = (footer: Footer) => {
    onSelect(footer.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="footer-library-dialog">
        <DialogHeader>
          <DialogTitle>Choose a Footer</DialogTitle>
        </DialogHeader>

        <div className="footer-library-content">
          {isLoading ? (
            <div className="footer-library-loading">Loading footers...</div>
          ) : footers && footers.length > 0 ? (
            <div className="footer-library-grid">
              {footers.map((footer) => (
                <button
                  key={footer.id}
                  type="button"
                  className={cn(
                    "footer-library-item",
                    footer.id === currentFooterId && "is-selected",
                  )}
                  onClick={() => handleSelect(footer)}
                >
                  <div className="footer-library-preview">
                    <FooterPreview footer={footer} />
                  </div>
                  <div className="footer-library-info">
                    <div className="footer-library-name">
                      {footer.name}
                      {footer.isDefault && (
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      )}
                    </div>
                    <div className="footer-library-layout">
                      {layoutLabels[footer.layout] || footer.layout}
                    </div>
                  </div>
                  {footer.id === currentFooterId && (
                    <div className="footer-library-check">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="footer-library-empty">
              <p>No footers found</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Create a Footer
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Footer Preview - simple visual preview of footer layout
 */
function FooterPreview({ footer }: { footer: Footer }) {
  const layout = footer.layout;

  return (
    <div className="footer-preview">
      {layout === "SIMPLE" && (
        <div className="footer-preview-simple">
          <div className="footer-preview-block w-12" />
          <div className="footer-preview-block w-8" />
        </div>
      )}
      {layout === "COLUMNS" && (
        <div className="footer-preview-columns">
          <div className="footer-preview-col" />
          <div className="footer-preview-col" />
          <div className="footer-preview-col" />
          <div className="footer-preview-col" />
        </div>
      )}
      {layout === "STACKED" && (
        <div className="footer-preview-stacked">
          <div className="footer-preview-block w-16" />
          <div className="footer-preview-block w-12" />
          <div className="footer-preview-block w-20" />
        </div>
      )}
      {layout === "CENTERED" && (
        <div className="footer-preview-centered">
          <div className="footer-preview-block w-12" />
          <div className="footer-preview-block w-16" />
          <div className="footer-preview-block w-8" />
        </div>
      )}
      {layout === "MINIMAL" && (
        <div className="footer-preview-minimal">
          <div className="footer-preview-block w-24" />
        </div>
      )}
    </div>
  );
}
