"use client";

import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { useMenu } from "@/lib/hooks/use-menus";
import { useResolvedTenant } from "@/lib/hooks/use-resolved-tenant";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MenuBlockData {
  menuId?: string;
  variant?: "default" | "pills" | "underline" | "minimal" | "bordered";
  style?: "horizontal" | "vertical";
  dropdownTrigger?: "hover" | "click";
  dropdownAnimation?: "fade" | "slide" | "scale" | "none";
  showIcons?: boolean;
}

/**
 * Menu block — renders a referenced Menu (from Menu table) using the
 * same data-attribute styling as the client MenuRenderer. Works inside
 * any container (header, footer, sidebar, page body).
 */
export default function MenuBlockRenderer({
  block,
  editorProps,
}: BlockRendererProps) {
  const data = block.data as unknown as MenuBlockData;
  const { tenantId } = useResolvedTenant();
  const { data: menu } = useMenu(tenantId || "", data.menuId || "");

  if (!data.menuId) {
    return (
      <div
        {...editorProps}
        className={cn(
          editorProps?.className,
          "px-3 py-2 rounded-md border border-dashed border-(--border-default) text-(--el-500) text-sm",
        )}
        data-slot="menu-block"
      >
        Select a menu in settings
      </div>
    );
  }

  if (!menu || !menu.items || menu.items.length === 0) {
    return (
      <div
        {...editorProps}
        className={cn(editorProps?.className, "text-(--el-500) text-sm")}
        data-slot="menu-block"
      >
        Menu is empty
      </div>
    );
  }

  return (
    <ul
      {...editorProps}
      className={cn("menu-renderer", editorProps?.className)}
      data-slot="menu-block"
      data-style={data.style || "horizontal"}
      data-variant={data.variant || "default"}
      data-dropdown-trigger={data.dropdownTrigger || "hover"}
    >
      {menu.items.map((item) => (
        <li key={item.id} className="menu-item">
          <Link
            href={item.url || "#"}
            className="menu-link"
            data-highlight={item.highlight || undefined}
            target={item.target === "_blank" ? "_blank" : undefined}
            rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
          >
            <span>{item.label}</span>
            {item.children && item.children.length > 0 && (
              <svg
                className="menu-icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 9 12 12 9" />
              </svg>
            )}
          </Link>

          {item.children && item.children.length > 0 && (
            <ul
              className="menu-dropdown"
              data-animation={data.dropdownAnimation || "slide"}
            >
              {item.children.map((child) => (
                <li key={child.id} className="menu-dropdown-item">
                  <Link
                    href={child.url || "#"}
                    className="menu-dropdown-link"
                    target={child.target === "_blank" ? "_blank" : undefined}
                    rel={
                      child.target === "_blank"
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
