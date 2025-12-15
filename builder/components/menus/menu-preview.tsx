"use client";

import * as React from "react";
import {
  type MenuItem,
  type MenuStyle,
  type MenuType,
} from "@/lib/hooks/use-menus";
import { ChevronDown, ExternalLink } from "lucide-react";

import "./menu-preview.css";

interface MenuPreviewProps {
  items: MenuItem[];
  type: MenuType;
  style: MenuStyle;
}

interface MenuItemPreviewProps {
  item: MenuItem;
  style: MenuStyle;
  isVertical: boolean;
  depth?: number;
}

function MenuItemPreview({
  item,
  style,
  isVertical,
  depth = 0,
}: MenuItemPreviewProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const showDropdown = style.dropdownTrigger === "click" ? isOpen : undefined;

  const itemClasses = [
    "menu-preview-item",
    hasChildren && "menu-preview-item-has-children",
    item.highlight && "menu-preview-item-highlight",
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = () => {
    if (hasChildren && style.dropdownTrigger === "click") {
      setIsOpen(!isOpen);
    }
  };

  return (
    <li
      className={itemClasses}
      data-open={showDropdown}
      onMouseEnter={() => style.dropdownTrigger !== "click" && setIsOpen(true)}
      onMouseLeave={() => style.dropdownTrigger !== "click" && setIsOpen(false)}
    >
      <a
        href={item.url}
        target={item.target}
        className="menu-preview-link"
        onClick={(e) => {
          e.preventDefault();
          handleClick();
        }}
      >
        <span className="menu-preview-label">{item.label || "Untitled"}</span>
        {hasChildren && <ChevronDown className="menu-preview-chevron" />}
        {item.target === "_blank" && (
          <ExternalLink className="menu-preview-external" />
        )}
      </a>

      {hasChildren && isOpen && (
        <ul className="menu-preview-dropdown" data-depth={depth + 1}>
          {item.children!.map((child) => (
            <MenuItemPreview
              key={child.id}
              item={child}
              style={style}
              isVertical={true}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function MenuPreview({ items, type, style }: MenuPreviewProps) {
  const isVertical = type === "vertical";
  const isMega = type === "mega";

  const containerClasses = [
    "menu-preview",
    `menu-preview-${type}`,
    `menu-preview-spacing-${style.spacing || "comfortable"}`,
    `menu-preview-align-${style.alignment || "left"}`,
    `menu-preview-font-${style.fontSize || "md"}`,
    `menu-preview-weight-${style.fontWeight || "normal"}`,
    `menu-preview-transform-${style.textTransform || "none"}`,
    `menu-preview-hover-${style.hoverStyle || "none"}`,
    `menu-preview-hover-anim-${style.hoverAnimation || "none"}`,
    `menu-preview-dropdown-anim-${style.dropdownAnimation || "fade"}`,
    `menu-preview-dropdown-shadow-${style.dropdownShadow || "md"}`,
    `menu-preview-dropdown-radius-${style.dropdownRadius || "md"}`,
    `menu-preview-active-${style.activeStyle || "none"}`,
  ].join(" ");

  const cssVars = {
    "--menu-hover-color": style.hoverColor || "#3b82f6",
    "--menu-active-color": style.activeColor || "#3b82f6",
    "--menu-dropdown-bg": style.dropdownBackground || "#ffffff",
  } as React.CSSProperties;

  if (items.length === 0) {
    return (
      <div className="menu-preview-empty">
        <p>Add menu items to see preview</p>
      </div>
    );
  }

  return (
    <div className="menu-preview-container">
      <div className="menu-preview-label-text">Preview</div>
      <nav className={containerClasses} style={cssVars} data-mega={isMega}>
        <ul className="menu-preview-list">
          {items.map((item) => (
            <MenuItemPreview
              key={item.id}
              item={item}
              style={style}
              isVertical={isVertical}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
}
