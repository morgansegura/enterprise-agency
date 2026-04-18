"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FolderPlus,
  Library,
  MoreHorizontal,
} from "lucide-react";
import type { MediaFolder } from "@/lib/hooks/use-folders";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "./folder-tree.css";

interface FolderTreeProps {
  folders: MediaFolder[] | undefined;
  activeFolderId: string | null;
  dropTargetId?: string | null;
  onSelect: (folderId: string | null) => void;
  onCreateFolder: (parentId: string | null) => void;
  onRename: (folder: MediaFolder) => void;
  onDelete: (folder: MediaFolder) => void;
  onAssetDrop?: (folderId: string | null, event: React.DragEvent) => void;
  onDragEnter?: (folderId: string | null) => void;
  onDragLeave?: (folderId: string | null) => void;
}

export function FolderTree({
  folders,
  activeFolderId,
  dropTargetId,
  onSelect,
  onCreateFolder,
  onRename,
  onDelete,
  onAssetDrop,
  onDragEnter,
  onDragLeave,
}: FolderTreeProps) {
  return (
    <nav data-slot="folder-tree" aria-label="Media folders">
      <header data-slot="folder-tree-header">
        <span>Library</span>
        <button
          type="button"
          data-slot="folder-tree-add"
          onClick={() => onCreateFolder(null)}
          aria-label="Create folder at root"
        >
          <FolderPlus aria-hidden="true" />
        </button>
      </header>

      <button
        type="button"
        data-slot="folder-tree-item"
        data-depth="0"
        data-active={activeFolderId === null ? "true" : "false"}
        data-drop={dropTargetId === null ? "true" : "false"}
        onClick={() => onSelect(null)}
        onDragOver={(e) => {
          e.preventDefault();
          onDragEnter?.(null);
        }}
        onDragLeave={() => onDragLeave?.(null)}
        onDrop={(e) => {
          e.preventDefault();
          onAssetDrop?.(null, e);
        }}
      >
        <Library aria-hidden="true" />
        <span>All files</span>
      </button>

      {(folders ?? []).map((folder) => (
        <FolderNode
          key={folder.id}
          folder={folder}
          depth={1}
          activeFolderId={activeFolderId}
          dropTargetId={dropTargetId}
          onSelect={onSelect}
          onCreateFolder={onCreateFolder}
          onRename={onRename}
          onDelete={onDelete}
          onAssetDrop={onAssetDrop}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
        />
      ))}
    </nav>
  );
}

interface FolderNodeProps
  extends Omit<FolderTreeProps, "folders"> {
  folder: MediaFolder;
  depth: number;
}

function FolderNode({
  folder,
  depth,
  activeFolderId,
  dropTargetId,
  onSelect,
  onCreateFolder,
  onRename,
  onDelete,
  onAssetDrop,
  onDragEnter,
  onDragLeave,
}: FolderNodeProps) {
  const [open, setOpen] = React.useState(true);
  const hasChildren = (folder.children?.length ?? 0) > 0;
  const isActive = activeFolderId === folder.id;
  const isDropTarget = dropTargetId === folder.id;

  return (
    <>
      <div
        data-slot="folder-tree-item"
        data-depth={depth}
        data-active={isActive ? "true" : "false"}
        data-drop={isDropTarget ? "true" : "false"}
        onDragOver={(e) => {
          e.preventDefault();
          onDragEnter?.(folder.id);
        }}
        onDragLeave={() => onDragLeave?.(folder.id)}
        onDrop={(e) => {
          e.preventDefault();
          onAssetDrop?.(folder.id, e);
        }}
        role="treeitem"
        aria-selected={isActive}
      >
        <button
          type="button"
          data-slot="folder-tree-toggle"
          onClick={() => hasChildren && setOpen((o) => !o)}
          aria-label={open ? "Collapse" : "Expand"}
          data-visible={hasChildren ? "true" : "false"}
        >
          {open ? <ChevronDown aria-hidden="true" /> : <ChevronRight aria-hidden="true" />}
        </button>
        <button
          type="button"
          data-slot="folder-tree-main"
          onClick={() => onSelect(folder.id)}
        >
          {isActive || open ? (
            <FolderOpen aria-hidden="true" />
          ) : (
            <Folder aria-hidden="true" />
          )}
          <span>{folder.name}</span>
          {folder._count?.assets ? (
            <span data-slot="folder-tree-count">{folder._count.assets}</span>
          ) : null}
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              data-slot="folder-tree-menu"
              aria-label="Folder actions"
            >
              <MoreHorizontal aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onCreateFolder(folder.id)}>
              New subfolder
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onRename(folder)}>
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => onDelete(folder)}
              data-variant="destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {open && hasChildren
        ? folder.children!.map((child) => (
            <FolderNode
              key={child.id}
              folder={child}
              depth={depth + 1}
              activeFolderId={activeFolderId}
              dropTargetId={dropTargetId}
              onSelect={onSelect}
              onCreateFolder={onCreateFolder}
              onRename={onRename}
              onDelete={onDelete}
              onAssetDrop={onAssetDrop}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
            />
          ))
        : null}
    </>
  );
}
