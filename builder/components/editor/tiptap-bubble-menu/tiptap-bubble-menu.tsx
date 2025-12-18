"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  BubbleMenuPlugin,
  BubbleMenuPluginProps,
} from "@tiptap/extension-bubble-menu";
import type { Editor } from "@tiptap/core";

interface TiptapBubbleMenuProps
  extends Omit<BubbleMenuPluginProps, "element" | "pluginKey" | "editor"> {
  editor: Editor | null;
  children: ReactNode;
  className?: string;
  pluginKey?: string;
}

/**
 * TiptapBubbleMenu
 *
 * React wrapper for TipTap's BubbleMenu extension.
 * Shows a floating menu when text is selected.
 */
export function TiptapBubbleMenu({
  editor,
  children,
  className,
  pluginKey = "bubbleMenu",
  shouldShow,
  updateDelay,
  options,
}: TiptapBubbleMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!editor || editor.isDestroyed || !menuRef.current) {
      return;
    }

    const element = menuRef.current;

    const plugin = BubbleMenuPlugin({
      pluginKey,
      editor,
      element,
      shouldShow:
        shouldShow ??
        (({ state, from, to }) => {
          // Show only when there's a non-empty selection
          const { empty } = state.selection;
          const hasText = from !== to;
          return !empty && hasText;
        }),
      updateDelay: updateDelay ?? 100,
      options: {
        placement: "top",
        offset: { mainAxis: 8 },
        ...options,
        onShow: () => {
          setIsVisible(true);
          options?.onShow?.();
        },
        onHide: () => {
          setIsVisible(false);
          options?.onHide?.();
        },
      },
    });

    editor.registerPlugin(plugin);

    return () => {
      editor.unregisterPlugin(pluginKey);
    };
  }, [editor, pluginKey, shouldShow, updateDelay, options]);

  if (!editor) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className={className}
      style={{
        position: "absolute",
        zIndex: 50,
        visibility: isVisible ? "visible" : "hidden",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 100ms ease-in-out",
      }}
    >
      {children}
    </div>
  );
}
