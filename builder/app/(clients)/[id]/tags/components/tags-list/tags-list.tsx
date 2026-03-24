"use client";

import { type Tag } from "@/lib/hooks/use-tags";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tags, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import "./tags-list.css";

interface TagsListProps {
  tags: Tag[];
  isLoading: boolean;
  search: string;
  onRename: (tag: Tag) => void;
  onDelete: (tag: Tag) => void;
}

export function TagsList({
  tags,
  isLoading,
  search,
  onRename,
  onDelete,
}: TagsListProps) {
  if (isLoading) {
    return (
      <div className="content-table">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="content-table-skeleton-row">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-8" />
          </div>
        ))}
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="content-list-empty">
        <Tags className="content-list-empty-icon" />
        <h3>{search ? "No tags found" : "No tags yet"}</h3>
        <p>
          {search
            ? "Try adjusting your search"
            : "Tags will appear here when you add them to posts"}
        </p>
      </div>
    );
  }

  return (
    <div className="content-table">
      <div className="content-table-header">
        <div className="content-table-header-row">
          <div className="content-table-header-cell tags-col-name">Tag</div>
          <div className="content-table-header-cell tags-col-count">Posts</div>
          <div className="content-table-header-cell content-table-header-cell-actions" />
        </div>
      </div>
      <div className="content-table-body">
        {tags.map((tag) => (
          <div key={tag.id} className="content-table-row">
            <div className="content-table-cell tags-col-name">
              <span className="tags-name-text">{tag.name}</span>
            </div>
            <div className="content-table-cell tags-col-count">
              <span className="tags-count-text">{tag.count}</span>
            </div>
            <div className="content-table-cell content-table-cell-actions">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="content-actions-trigger"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => onRename(tag)}>
                    <Pencil className="h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive [&>svg]:text-destructive"
                    onClick={() => onDelete(tag)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
