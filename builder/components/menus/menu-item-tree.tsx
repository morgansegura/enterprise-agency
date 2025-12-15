"use client";

import * as React from "react";
import { type MenuItem } from "@/lib/hooks/use-menus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Link,
} from "lucide-react";

import "./menu-item-tree.css";

interface MenuItemTreeProps {
  items: MenuItem[];
  onChange: (items: MenuItem[]) => void;
  maxDepth?: number;
}

interface MenuItemRowProps {
  item: MenuItem;
  depth: number;
  index: number;
  maxDepth: number;
  onUpdate: (item: MenuItem) => void;
  onRemove: () => void;
  onAddChild: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

function generateId(): string {
  return `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function MenuItemRow({
  item,
  depth,
  maxDepth,
  onUpdate,
  onRemove,
  onAddChild,
  onMoveUp,
  onMoveDown,
}: MenuItemRowProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(!item.label);
  const hasChildren = item.children && item.children.length > 0;
  const canAddChildren = depth < maxDepth;

  const handleChildUpdate = (index: number, updatedChild: MenuItem) => {
    const newChildren = [...(item.children || [])];
    newChildren[index] = updatedChild;
    onUpdate({ ...item, children: newChildren });
  };

  const handleChildRemove = (index: number) => {
    const newChildren = [...(item.children || [])];
    newChildren.splice(index, 1);
    onUpdate({ ...item, children: newChildren });
  };

  const handleAddNestedChild = (index: number) => {
    const newChildren = [...(item.children || [])];
    const child = newChildren[index];
    newChildren[index] = {
      ...child,
      children: [
        ...(child.children || []),
        { id: generateId(), label: "", url: "#" },
      ],
    };
    onUpdate({ ...item, children: newChildren });
  };

  const handleChildMoveUp = (index: number) => {
    if (index === 0) return;
    const newChildren = [...(item.children || [])];
    [newChildren[index - 1], newChildren[index]] = [
      newChildren[index],
      newChildren[index - 1],
    ];
    onUpdate({ ...item, children: newChildren });
  };

  const handleChildMoveDown = (index: number) => {
    const children = item.children || [];
    if (index === children.length - 1) return;
    const newChildren = [...children];
    [newChildren[index], newChildren[index + 1]] = [
      newChildren[index + 1],
      newChildren[index],
    ];
    onUpdate({ ...item, children: newChildren });
  };

  return (
    <div className="menu-item-tree-item" data-depth={depth}>
      <div className="menu-item-tree-row">
        <div className="menu-item-tree-drag">
          <GripVertical />
        </div>

        {canAddChildren && (
          <button
            type="button"
            className="menu-item-tree-expand"
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={!hasChildren}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown />
              ) : (
                <ChevronRight />
              )
            ) : (
              <span className="menu-item-tree-expand-placeholder" />
            )}
          </button>
        )}

        <div className="menu-item-tree-content">
          {isEditing ? (
            <div className="menu-item-tree-edit">
              <Input
                placeholder="Label"
                value={item.label}
                onChange={(e) => onUpdate({ ...item, label: e.target.value })}
                className="menu-item-tree-input-label"
              />
              <Input
                placeholder="URL"
                value={item.url}
                onChange={(e) => onUpdate({ ...item, url: e.target.value })}
                className="menu-item-tree-input-url"
              />
              <Select
                value={item.target || "_self"}
                onValueChange={(value: "_self" | "_blank") =>
                  onUpdate({ ...item, target: value })
                }
              >
                <SelectTrigger className="menu-item-tree-input-target">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_self">
                    <span className="menu-item-tree-target-option">
                      <Link />
                      Same tab
                    </span>
                  </SelectItem>
                  <SelectItem value="_blank">
                    <span className="menu-item-tree-target-option">
                      <ExternalLink />
                      New tab
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Done
              </Button>
            </div>
          ) : (
            <button
              type="button"
              className="menu-item-tree-display"
              onClick={() => setIsEditing(true)}
            >
              <span className="menu-item-tree-label">
                {item.label || "Untitled"}
              </span>
              <span className="menu-item-tree-url">{item.url}</span>
              {item.target === "_blank" && (
                <ExternalLink className="menu-item-tree-external-icon" />
              )}
            </button>
          )}
        </div>

        <div className="menu-item-tree-actions">
          {canAddChildren && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onAddChild}
              title="Add sub-item"
            >
              <Plus />
            </Button>
          )}
          {onMoveUp && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onMoveUp}
              title="Move up"
            >
              <ChevronRight className="menu-item-tree-move-up" />
            </Button>
          )}
          {onMoveDown && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onMoveDown}
              title="Move down"
            >
              <ChevronRight className="menu-item-tree-move-down" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            title="Remove"
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="menu-item-tree-children">
          {item.children!.map((child, index) => (
            <MenuItemRow
              key={child.id}
              item={child}
              depth={depth + 1}
              index={index}
              maxDepth={maxDepth}
              onUpdate={(updated) => handleChildUpdate(index, updated)}
              onRemove={() => handleChildRemove(index)}
              onAddChild={() => handleAddNestedChild(index)}
              onMoveUp={index > 0 ? () => handleChildMoveUp(index) : undefined}
              onMoveDown={
                index < item.children!.length - 1
                  ? () => handleChildMoveDown(index)
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function MenuItemTree({
  items,
  onChange,
  maxDepth = 3,
}: MenuItemTreeProps) {
  const handleAddItem = () => {
    onChange([...items, { id: generateId(), label: "", url: "#" }]);
  };

  const handleUpdateItem = (index: number, updatedItem: MenuItem) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    onChange(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  const handleAddChild = (index: number) => {
    const newItems = [...items];
    const item = newItems[index];
    newItems[index] = {
      ...item,
      children: [
        ...(item.children || []),
        { id: generateId(), label: "", url: "#" },
      ],
    };
    onChange(newItems);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [
      newItems[index],
      newItems[index - 1],
    ];
    onChange(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [
      newItems[index + 1],
      newItems[index],
    ];
    onChange(newItems);
  };

  return (
    <div className="menu-item-tree">
      <div className="menu-item-tree-header">
        <h3 className="menu-item-tree-title">Menu Items</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddItem}
        >
          <Plus />
          Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="menu-item-tree-empty">
          <p>No menu items yet.</p>
          <Button type="button" variant="outline" onClick={handleAddItem}>
            <Plus />
            Add your first item
          </Button>
        </div>
      ) : (
        <div className="menu-item-tree-list">
          {items.map((item, index) => (
            <MenuItemRow
              key={item.id}
              item={item}
              depth={0}
              index={index}
              maxDepth={maxDepth}
              onUpdate={(updated) => handleUpdateItem(index, updated)}
              onRemove={() => handleRemoveItem(index)}
              onAddChild={() => handleAddChild(index)}
              onMoveUp={index > 0 ? () => handleMoveUp(index) : undefined}
              onMoveDown={
                index < items.length - 1
                  ? () => handleMoveDown(index)
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
