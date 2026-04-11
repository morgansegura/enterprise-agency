"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// =============================================================================
// Accordion context — only one section open at a time
// =============================================================================

interface AccordionContextValue {
  openId: string | null;
  toggle: (id: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

/**
 * Wrap PropertySections in this provider to get accordion behavior
 * (only one section open at a time). First section opens by default.
 */
export function PropertyAccordion({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [defaultSet, setDefaultSet] = React.useState(false);

  const toggle = React.useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  // Open the first section that registers (on mount)
  const registerDefault = React.useCallback(
    (id: string) => {
      if (!defaultSet) {
        setOpenId(id);
        setDefaultSet(true);
      }
    },
    [defaultSet],
  );

  const ctx = React.useMemo(
    () => ({ openId, toggle, registerDefault }),
    [openId, toggle, registerDefault],
  );

  return (
    <AccordionContext.Provider value={ctx as AccordionContextValue & { registerDefault: (id: string) => void }}>
      {children}
    </AccordionContext.Provider>
  );
}

// =============================================================================
// PropertySection
// =============================================================================

interface PropertySectionProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Collapsible property section.
 * When inside a PropertyAccordion, only one section can be open at a time.
 */
export function PropertySection({
  title,
  defaultOpen = true,
  children,
  className,
}: PropertySectionProps) {
  const accordion = React.useContext(AccordionContext);
  const id = React.useId();

  // Standalone mode
  const [localOpen, setLocalOpen] = React.useState(defaultOpen);

  // Register as default-open section on mount
  React.useEffect(() => {
    if (accordion && defaultOpen) {
      const ctx = accordion as AccordionContextValue & {
        registerDefault?: (id: string) => void;
      };
      ctx.registerDefault?.(id);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isOpen = accordion ? accordion.openId === id : localOpen;

  const handleClick = () => {
    if (accordion) {
      accordion.toggle(id);
    } else {
      setLocalOpen(!localOpen);
    }
  };

  return (
    <div
      className={cn(
        "property-section",
        isOpen && "property-section--open",
        className,
      )}
    >
      <button
        type="button"
        className="property-section-header"
        onClick={handleClick}
        aria-expanded={isOpen}
      >
        <ChevronDown
          className={cn(
            "property-section-chevron",
            !isOpen && "property-section-chevron--closed",
          )}
        />
        <span className="property-section-title">{title}</span>
      </button>

      <div
        className={cn(
          "property-section-content",
          isOpen
            ? "property-section-content--open"
            : "property-section-content--closed",
        )}
      >
        <div className="property-section-inner">{children}</div>
      </div>
    </div>
  );
}
