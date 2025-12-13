"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

import "./inline-text.css";

interface InlineTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  multiline?: boolean;
  disabled?: boolean;
}

/**
 * InlineText
 *
 * A contenteditable text component for WYSIWYG editing.
 * Renders exactly as it will appear to end users.
 *
 * Features:
 * - Direct inline editing
 * - Placeholder text when empty
 * - Supports single or multiline
 * - Paste as plain text
 */
export function InlineText({
  value,
  onChange,
  placeholder = "Type here...",
  className,
  as: Component = "p",
  multiline = false,
  disabled = false,
}: InlineTextProps) {
  const ref = React.useRef<HTMLElement>(null);

  // Initialize content on mount
  React.useEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value || "";
    }
  }, []);

  // Only sync external value changes when not focused
  React.useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      if (ref.current.textContent !== value) {
        ref.current.textContent = value || "";
      }
    }
  }, [value]);

  const handleInput = (e: React.FormEvent<HTMLElement>) => {
    const newValue = e.currentTarget.textContent || "";
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    // Prevent new lines in single-line mode
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      ref.current?.blur();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const cleanText = multiline ? text : text.replace(/\n/g, " ");

    // Insert text at cursor position using Selection API
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(cleanText);
      range.insertNode(textNode);

      // Move cursor to end of inserted text
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);

      // Trigger onChange
      if (ref.current) {
        onChange(ref.current.textContent || "");
      }
    }
  };

  const isEmpty = !value || value.trim() === "";

  return (
    <Component
      ref={ref as React.RefObject<HTMLHeadingElement & HTMLParagraphElement>}
      contentEditable={!disabled}
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      className={cn(
        "inline-text",
        isEmpty && "inline-text--empty",
        disabled && "cursor-default",
        className,
      )}
      data-placeholder={placeholder}
    />
  );
}
